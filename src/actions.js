import { HttpError } from "wasp/server";

// Constants for input validation
const MAX_TITLE_LENGTH = 78;
const MAX_DESCRIPTION_LENGTH = 600;

export const createTask = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { title, description } = args;

  // Validate title and description lengths
  if (!title || title.trim() === "") {
    throw new HttpError(400, "Task title is required");
  }

  if (title.length > MAX_TITLE_LENGTH) {
    throw new HttpError(
      400,
      `Task title cannot exceed ${MAX_TITLE_LENGTH} characters`
    );
  }

  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    throw new HttpError(
      400,
      `Task description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
    );
  }

  // Shift all existing tasks down by 1 to make room for the new task at position 0
  await context.entities.Task.updateMany({
    where: { userId: context.user.id },
    data: {
      position: { increment: 1 },
    },
  });

  // Create the new task at position 0 (top of the list)
  const newTask = await context.entities.Task.create({
    data: {
      title,
      description,
      isDone: false,
      position: 0,
      user: { connect: { id: context.user.id } },
    },
  });

  return newTask;
};

export const updateTask = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.findUnique({
    where: { id: args.id },
  });
  if (!task || task.userId !== context.user.id) {
    throw new HttpError(403);
  }

  // Validate title and description if they are being updated
  if (args.title !== undefined) {
    if (!args.title || args.title.trim() === "") {
      throw new HttpError(400, "Task title is required");
    }

    if (args.title.length > MAX_TITLE_LENGTH) {
      throw new HttpError(
        400,
        `Task title cannot exceed ${MAX_TITLE_LENGTH} characters`
      );
    }
  }

  if (
    args.description !== undefined &&
    args.description &&
    args.description.length > MAX_DESCRIPTION_LENGTH
  ) {
    throw new HttpError(
      400,
      `Task description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
    );
  }

  return context.entities.Task.update({
    where: { id: args.id },
    data: {
      title: args.title,
      description: args.description,
      isDone: args.isDone,
    },
  });
};

export const deleteTask = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.findUnique({
    where: { id: args.id },
  });
  if (!task || task.userId !== context.user.id) {
    throw new HttpError(403);
  }

  await context.entities.Task.delete({
    where: { id: args.id },
  });

  return { id: args.id };
};

export const reorderTasks = async ({ taskIds }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // Fetch tasks of the authenticated user and ensure all tasks belong to them
  const tasks = await context.entities.Task.findMany({
    where: {
      id: { in: taskIds },
      userId: context.user.id,
    },
  });

  if (tasks.length !== taskIds.length) {
    throw new HttpError(403, "Some tasks do not belong to the user.");
  }

  // Update each task's position
  await Promise.all(
    taskIds.map((taskId, index) =>
      context.entities.Task.update({
        where: { id: taskId },
        data: { position: index },
      })
    )
  );

  // Return a success response
  return { success: true, message: "Tasks reordered successfully" };
};
