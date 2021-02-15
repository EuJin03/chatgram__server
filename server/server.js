import { config } from "dotenv";
config();
import colors from "colors";

import { ApolloServer, PubSub } from "apollo-server";
import connectDB from "./config/db.js";
import { typeDefs } from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";

connectDB();

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

const __port__ = process.env.PORT || 5000;

server.listen(
  __port__,
  console.log(`Server is running on port ${__port__}`.green.bold.underline)
);
