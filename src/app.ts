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

const main = async () => {
  const resolvers = [EntryResolver] as const;

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
