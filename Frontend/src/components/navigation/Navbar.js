import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../config/firebase";
import {
  AiOutlineDashboard,
  AiOutlineUpload,
  AiOutlineFolder,
} from "react-icons/ai";

const Navbar = ({ children }) => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <div className="navbar fixed w-50 h-screen p-4 bg-black border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center text-center">
          <div className="logo text-white text-2xl mb-4 p-4">
            <Link href="/">
              <div>
                <Image
                  src="/logo.png"
                  alt="SwiftScribe Logo"
                  className="dark:invert"
                  width={150}
                  height={100}
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="nav-links">
            <Link href="/">
              <div className="flex items-center text-white mb-2 p-4 hover:bg-white hover:text-black transition-colors cursor-pointer rounded-lg">
                <AiOutlineDashboard className="mr-2" />
                <span className="ml-2">Dashboard</span>
              </div>
            </Link>
            <Link href="/upload">
              <div className="flex items-center text-white mb-2 p-4 hover:bg-white hover:text-black transition-colors cursor-pointer rounded-lg">
                <AiOutlineUpload className="mr-2" />
                Upload Media
              </div>
            </Link>
            <Link href="/manage">
              <div className="flex items-center text-white mb-2 p-4 hover:bg-white hover:text-black transition-colors cursor-pointer rounded-lg">
                <AiOutlineFolder className="mr-2" />
                Manage Files
              </div>
            </Link>
          </div>
        </div>
        {loggedIn && (
          <div className="p-2">
            <button
              className="w-full rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 py-2"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
      <div className="ml-20 w-full">{children}</div>
    </div>
  );
};

export default Navbar;
