"use client";

import useBlog from "@/hooks/useBlog";
import { ChangeEvent, ReactElement, useState } from "react";
import Tag from "@/app/_components/tag.json";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = (): ReactElement => {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const { loading, publishBlog } = useBlog();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      return toast.error("Enter the Title", { autoClose: 2000 });
    } else if (!desc) {
      return toast.error("Fill the Description", { autoClose: 2000 });
    } else if (tags.length === 0) {
      return toast.error("Select the one more tag", { autoClose: 2000 });
    }
    const data = { title, desc, tags };
    const res = await publishBlog(data);
    if (res.status === 201) {
      return toast.success(res.message, {
        autoClose: 2000,
        onClose: () => router.push("/blog"),
      });
    } else {
      return toast.error(res.message, { autoClose: 2000 });
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    setTag(selectedTag);
    setTags((prevTags) => [...prevTags, selectedTag]);
  };

  return (
    <main className="min-h-[100svh] flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6 transition-all"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Create a Blog</h2>

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block mb-1 font-semibold">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title here..."
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="desc" className="block mb-1 font-semibold">
            Description
          </label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter the description here..."
            rows={5}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Tags Dropdown */}
        <div>
          <label htmlFor="tags" className="block mb-1 font-semibold">
            Tags
          </label>
          <select
            id="tags"
            value={tag}
            onChange={handleSelect}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="" disabled>
              -- Select a tag --
            </option>
            {Tag.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>

          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((item, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
          <Link
            href="/blog"
            className="w-full sm:w-auto flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Page;
