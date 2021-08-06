const { ApolloServer, gql } = require("apollo-server");
const gsql = require("graphql-tag");
const mongoose = require("mongoose");

const Post = require("./models/Post");

const { MONGODB } = require("./config");

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server Running at ${res.url}`);
  });
