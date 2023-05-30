import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { json } from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import "reflect-metadata";
import { EntryResolver } from "./resolvers/EntryResolver";
import { MyContext } from "./types";
import { buildSchema } from "type-graphql";

const app = express();

/*
const typeDefs = `#graphql
type Entry {
    name: String!
    path: String!
    size: Int!
    extension: String!
    createdAt: String!
    isDirectory: Boolean!
    link: String!
    depth: Int!
    children: [Entry]!
  }

  type Query {
    directory(path: String!): Entry!
  }
`;

const resolvers = {
  Query: {
    directory: async (_: any, { path }: { path: string }) => {
      const protocol = "http"; // Replace with your desired protocol
      const host = "localhost:3000"; // Replace with your actual host

      return await createDirectoryTree(path, protocol, host);
    },
  },
};
*/

export const resolvers = [EntryResolver] as const;

// Create an instance of ApolloServer
// Create an Express app and apply ApolloServer middleware
const main = async () => {
  const schema = await buildSchema({
    resolvers,
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: ["http://localhost:4200", "https://studio.apollographql.com"],
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  const port = 3000;

  app.listen({ port: 3000 }, () => {
    console.log(`Server is running on http://localhost:${port}, GraphQL on http://localhost:${port}/graphql `);
  });
};

main();
