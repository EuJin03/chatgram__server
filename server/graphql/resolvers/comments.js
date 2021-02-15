import { AuthenticationError, UserInputError } from "apollo-server";
import Post from "../../model/Post.js";
import { protect } from "../../utils/checkAuth.js";

export default {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = protect(context);

      if (body.trim() === "") {
        throw UserInputError("Empty comment", {
          errors: {
            body: "Comment must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
        });

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = protect(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId);

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);

          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post does not exist");
      }
    },
  },
};
