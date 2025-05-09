import React from "react";

const ErrorAlert = ({ message }) => {
  return (
    <div
      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">
        {message || "Something went wrong"}
      </span>
    </div>
  );
};

export default ErrorAlert;
