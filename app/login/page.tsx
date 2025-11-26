"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col space-y-6">

        <h1 className="text-2xl font-semibold text-center">
          Welcome Back
        </h1>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

      </div>
    </div>
  );
}
