import { Schema, model, models } from "mongoose";

const blogSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  tags: { type: [String], default: [] },
  time: { type: Date, default: Date.now },
});

const Blog = models.Blog || model("Blog", blogSchema);
export default Blog;
