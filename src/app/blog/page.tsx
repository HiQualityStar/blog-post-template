"use client";

import useBlog from "@/hooks/useBlog";
import { BlogType } from "@/types/blogApiType";
import { confirmModal } from "@/types/confirmModal";
import { useRouter } from "next/navigation";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingMiddle from "../_components/ui/loading";
import useVerifyAuth from "@/hooks/userVerifyAuth";
import useUserSetting from "@/hooks/useUserSetting";

const Page = () => {
  const { getBlogs, deleteBlog, loading } = useBlog();
  const { checkUsername } = useUserSetting();
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [blogs2, setBlogs2] = useState<BlogType[]>([]);
  const [userId, setUserId] = useState<string>();
  const [localLoading, setLocalLoading] = useState(true);
  const [keyword, setKeyword] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();
  const { isAuth } = useVerifyAuth();
  useLayoutEffect(() => {
    (async () => {
      const res = await getBlogs();
      if (res.status === 200 && "blogs" in res) {
        setBlogs(res.blogs);
        setBlogs2(res.blogs);
        setUserId(res.userId);
        console.log(res.userId);
      }
      setLocalLoading(false);
    })();
  }, []);

  const handleDelete = (blogId: string) => {
    confirmModal("Are you sure you want to delete this blog?", () =>
      deleteOne(blogId)
    );
  };

  const deleteOne = async (blogId: string) => {
    const res = await deleteBlog(blogId);
    if (res.status === 200 && "blogs" in res) {
      setBlogs(res.blogs);
      setUserId(res.userId);
      toast.success(res.message, {
        autoClose: 2000,
      });
    } else {
      toast.error(res.message || "Something went wrong", {
        autoClose: 2000,
      });
    }
  };

  const handleEdit = (blogId: string) => {
    router.push(`/blog/${blogId}`);
  };

  // filter my blogs
  const handleFilter = (filt: string) => {
    if (filt === "all") {
      setBlogs(blogs2);
      setFilter("all");
    } else if (filt === "mine") {
      const filteredBlogs = blogs2.filter((item) => item.userId === userId);
      setBlogs(filteredBlogs);
      setFilter("mine");
    }
  };
  //search specific blogs
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyword(keyword);
    const filteredBlogs = blogs2.filter(
      (item) =>
        item?.desc?.toUpperCase().includes(keyword.toUpperCase()) ||
        item?.title?.toUpperCase().includes(keyword.toUpperCase()) ||
        item?.userName?.toUpperCase().includes(keyword.toUpperCase()) ||
        item?.tags?.some((tag) =>
          tag.toUpperCase().includes(keyword.toUpperCase())
        )
    );
    // detect if all blogs is.
    if (keyword === "") {
      setFilter("all");
    } else {
      setFilter("");
    }
    setBlogs(filteredBlogs);
  };

  const handleCreate = async () => {
    if (isAuth) {
      const res = await checkUsername();
      if (res.status === 200 && res.message === "Username exists.") {
        router.push("/blog/create");
      } else {
        toast.error("Please set a username before creating.", {
          autoClose: 2000,
          onClose: () => router.push("/setusername"),
        });
      }
    } else {
      toast.error("Please login first.", {
        autoClose: 2000,
        onClose: () => router.push("/login"),
      });
    }
  };

  if (localLoading || loading) return <LoadingMiddle />;

  return (
    <>
      <header className="flex flex-wrap fixed right-0 left-0 justify-between items-center gap-4 px-6 py-4 border-b border-gray-300 bg-white dark:bg-black">
        <div className="flex gap-2">
          <button
            onClick={() => handleFilter("all")}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              filter === "all"
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-800 text-white"
            }`}
          >
            All Blogs
          </button>
          <button
            onClick={() => handleFilter("mine")}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              filter === "mine"
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-800 text-white"
            }`}
          >
            My Blogs
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-1 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Create
          </button>
          <button
            onClick={() => router.push("/setusername")}
            className="px-4 py-1 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Setting
          </button>
        </div>
        <input
          type="search"
          value={keyword}
          onChange={handleSearch}
          placeholder="Search blogs..."
          className="px-4 py-1 text-background border border-gray-300 rounded-full w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </header>

      <main className="px-6 py-10 mt-[68px] bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="grid gap-6 max-w-4xl mx-auto mt-[100px]">
          {[...blogs].reverse().map((item, index) => (
            <article
              key={index}
              className="border border-gray-300 dark:border-gray-700 shadow-md rounded-2xl p-6 bg-white dark:bg-gray-800 transition hover:shadow-xl"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h2>
                {item.userId === userId && (
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      onClick={() => handleEdit(item._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400 hover:underline text-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-3 text-gray-700 dark:text-gray-300">
                {item.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-[2px] rounded-full text-xs font-medium"
                    key={index}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span> {item.userName}</span>
                <span> {new Date(item.time).toLocaleString()}</span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
};

export default Page;
