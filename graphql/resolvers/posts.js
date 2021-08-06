const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      console.log(user);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      return post;
    },
  },

  async deletePost(_, { postId }, context) {
    const user = checkAuth(context);
    console.log(user);

    try {
      const post = await Post.findById(postId);
      console.log("post = ", post);
      if (user.username === post.username) {
        await post.delete();
        return "Post Deleted Successfully";
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    } catch (error) {
      console.log("inside catch = ", error);
      throw new Error(error);
    }
  },
};
