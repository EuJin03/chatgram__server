import { defaultCreateRemoteResolver } from "apollo-server";
import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    body: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const likeSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    likes: [likeSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
