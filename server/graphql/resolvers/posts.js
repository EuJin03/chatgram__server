import { AuthenticationError, UserInputError } from "apollo-server";
import Post from "../../model/Post.js";
import { protect } from "../../utils/checkAuth.js";

export default {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);

        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = protect(context);

      console.log(user);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        gender: user.gender,
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },

    deletePost: async (_, { postId }, context) => {
      const user = protect(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();

          return "Post is deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    likePost: async (_, { postId }, context) => {
      const { username } = protect(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // Not liked, like it now
          post.likes.push({
            username,
          });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not Found");
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
