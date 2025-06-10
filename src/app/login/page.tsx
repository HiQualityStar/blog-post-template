"use client";

import { useEffect } from "react";
import { getSession, signIn } from "next-auth/react";
import { getItem, removeItem, setItem } from "@/utils/localstorage";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { useAtom } from "jotai";
import { tokenAtom } from "@/store";

const Page = () => {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [token, setToken] = useAtom<boolean>(tokenAtom);
  //cutstomized sign in
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      const isLogin = getItem("isLogin");
      if (session && isLogin) {
        removeItem("isLogin");
        const res = await login(session.idToken);
        if ("token" in res) {
          if ("user" in res) {
            Cookies.set("user", JSON.stringify(res.user));
          }
          // Successfully authenticated and save token
          Cookies.set("token", res.token, { expires: 4 });
          setToken(!token);
          //check the there was request routing url
          const reqUrl = Cookies.get("reqUrl");
          Cookies.remove("reqUrl");
          toast.success(res.message, {
            autoClose: 2000,
            onClose: () => router.push(`${reqUrl ? `${reqUrl}` : "/blog"}`),
          });
        } else {
          // Authentication failed, handle error
          toast.error(res.message || "Something went wrong", {
            autoClose: 2000,
          });
        }
      }
    };
    fetchSession();
  }, []);
  const handleLogIn = async () => {
    if (loading) return;
    try {
      await signIn("google", { redirect: false });
      setItem("isLogin", true);
      console.log("success google sigin in");
    } catch (error) {
      console.error("Failed google signup", error);
    }
  };
  return (
    <>
      <main className="mb-[34px] h-[80vh] flex flex-col justify-center gap-[40px] items-center font-sans">
        <div className="text-[38px] font-bold">WELCOME TO MY BLOG SITE</div>
        <div className="flex flex-col items-center gap-[20px]">
          <button
            onClick={handleLogIn}
            type="submit"
            className="flex items-center justify-center gap-[12px] bg-blue-600 rounded-[12px] w-[280px] h-[40px]"
          >
            <h1 className="text-[16px]  font-semibold">LOG IN WITH GOOGLE</h1>
            <Image
              width={32}
              height={32}
              className="size-[32px]"
              src="/icon/google.png"
              alt=""
              loading="eager"
              priority
            />
          </button>
        </div>
      </main>
    </>
  );
};
export default Page;
