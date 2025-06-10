"use client";

import useBlog from "@/hooks/useBlog";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import Tag from "@/app/_components/tag.json";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import LoadingMiddle from "@/app/_components/ui/loading";
import Link from "next/link";

const Page = (): ReactElement => {
  const params = useParams();
  const blogId: string | undefined = Array.isArray(params.blogid)
    ? params.blogid[0]
    : params.blogid;
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const { loading, updateBlog, getBlog } = useBlog();
  const [localLoading, setLocalLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!blogId) return;
    (async () => {
      const res = await getBlog(blogId || "");
      if (res.status === 200 && "blog" in res) {
        setTitle(res.blog.title);
        setDesc(res.blog.desc);
        setTags(res.blog.tags);
      }
      setLocalLoading(false);
    })();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      return toast.error("Enter the Title", { autoClose: 2000 });
    } else if (!desc) {
      return toast.error("Fill the Description", { autoClose: 2000 });
    } else if (!tags) {
      return toast.error("Select the one more tag", { autoClose: 2000 });
    }
    const data = { title, desc, tags };
    const res = await updateBlog(data, blogId || "");
    if (res.status === 200) {
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

  if (localLoading) return <LoadingMiddle />;

  return (
    <main className="h-[90svh] flex justify-center items-center text-[16px]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto flex flex-col gap-3 justify-center items-center px-4 py-6 bg-white rounded-2xl shadow-xl text-gray-800"
      >
        <div className="w-full">
          <label htmlFor="title" className="block mb-1 font-semibold">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title here..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="w-full">
          <label htmlFor="desc" className="block mb-1 font-semibold">
            Description
          </label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter the description here..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="w-full">
          <label htmlFor="tags" className="block mb-1 font-semibold">
            Tags
          </label>
          <select
            id="tags"
            value={tag}
            onChange={handleSelect}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((item, index) => (
              <span
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                key={index}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <Link
            href="/blog"
            className="mt-4 w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Page;
