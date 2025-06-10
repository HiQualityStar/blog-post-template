"use client";

import useUserSetting from "@/hooks/useUserSetting";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const { loading, setUsername } = useUserSetting();
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const handleUsername = async () => {
    const res = await setUsername(name.trim());
    if (res.status === 200) {
      toast.success("Set username successfully.", {
        autoClose: 2000,
        onClose: () => router.push("/blog/create"),
      });
    } else {
      toast.error(res.message || "Something went wrong.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-gray-800 dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">
          Set Your Username
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleUsername}
            disabled={loading || !name.trim()}
            className="bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
