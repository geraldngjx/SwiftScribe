import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

import backgroundImage from '../../public/main-background.jpg';

const SignIn = () => {
  const router = useRouter();
  const { user, login } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
      e.preventDefault();

      console.log(user);
      try {
        await login(data.email, data.password);
        router.push("/");
      } catch (err) {
        setError("Invalid Email or Password");
        console.log(err);
      }
  };

  return (
    <div 
      className="bg-gray-200 h-screen"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.9,
      }}
    >
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-900 w-full max-w-md pt-8 rounded-lg shadow-lg">
          <div className="flex justify-center p-4">
          <Image
                  src="/logo.png"
                  alt="SwiftScribe Logo"
                  className="dark:invert"
                  width={300}
                  height={200}
                  priority
                />
          </div>
          <div className="px-8 pb-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-8 text-green-500 text-center">
              Welcome back!
            </h1>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-gray-400 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) =>
                    setData({
                      ...data,
                      email: e.target.value,
                    })
                  }
                  className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-400 font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={data.password}
                  onChange={(e) =>
                    setData({
                      ...data,
                      password: e.target.value,
                    })
                  }
                  className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm font-medium mb-4">{error}</p>
              )}
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Sign in
              </button>
            </form>
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm font-medium">
                New to our platform?
              </p>
              <Link
                href="/signup"
                className="text-green-500 hover:text-green-600 font-bold"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;