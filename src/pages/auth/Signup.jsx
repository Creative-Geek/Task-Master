import React from "react";
import { Link } from "wasp/client/router";
import { SignupForm } from "wasp/client/auth";

export default function Signup() {
  return (
    <div className="w-full h-full">
      <div className="min-w-full min-h-[75vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                <div className="h-8 w-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Create account
              </h1>
              <p className="text-gray-600 mt-1">Get started with TaskMaster</p>
            </div>

            <SignupForm
              appearance={{
                colors: {
                  brand: "var(--auth-form-brand)",
                  brandAccent: "var(--auth-form-brand-accent)",
                  submitButtonText: "var(--auth-form-submit-button-text-color)",
                },
              }}
            />

            <div className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
