"use client";

import useVerifyAuth from "@/hooks/userVerifyAuth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Header = () => {
  const { loading, isAuth } = useVerifyAuth();
  const router = useRouter();
  const handleAuth = async () => {
    if (!isAuth) {
      router.push("/login");
    } else {
      await signOut({ callbackUrl: "/" });
      Cookies.remove("token");
      Cookies.remove("reqUrl");
      Cookies.remove("user");
    }
  };
  if (loading) return;
  return (
    <header className="flex flex-wrap fixed w-full z-50 top-0 items-center justify-between gap-3 py-5 px-6 bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700 shadow-sm">
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/blog")}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          View Blogs
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          Home
        </button>
      </div>
      <button
        onClick={handleAuth}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {isAuth ? "Logout" : "Login"}
      </button>
    </header>
  );
};
export default Header;
