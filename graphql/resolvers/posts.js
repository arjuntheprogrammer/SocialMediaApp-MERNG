const Post = require("../../models/Post");

module.exports = {
  Query: {
    // sayHi: () => "Hello World!",
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw error;
      }
    },
  },
};
