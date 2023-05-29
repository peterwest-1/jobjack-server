import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import { json } from "body-parser";

const DEFAULT_PATH = "../server";
const app = express();

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

const createDirectoryTree = async (directoryPath: string, protocol: string, host: string) => {
  const stats = await fs.promises.stat(directoryPath);

  const entries = await fs.promises.readdir(directoryPath);
  const statsArray = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry);
      const entryStats = await fs.promises.stat(entryPath);
      return entryStats;
    })
  );

  const entriesData = entries.map((entry, index) => {
    const stats = statsArray[index];
    const isDirectory = stats.isDirectory();
    const entryData = {
      name: entry,
      path: path.join(directoryPath, entry),
      size: stats.size,
      extension: path.extname(entry),
      createdAt: stats.birthtime,
      isDirectory,
      link: getEntryLink(path.join(directoryPath, entry), protocol, host),
    };
    return entryData;
  });

  const directoryTree = {
    name: path.basename(directoryPath),
    path: directoryPath,
    isDirectory: true,
    link: getEntryLink(directoryPath, protocol, host),
    size: 0,
    extension: "",
    createdAt: stats.birthtime,
    children: entriesData,
  };

  return directoryTree;
};

export const getEntryLink = (entryPath: string, protocol: string, host: string) => {
  return `${protocol}://${host}/directory?path=${encodeURIComponent(entryPath)}`;
};

// Create an instance of ApolloServer
// Create an Express app and apply ApolloServer middleware
const main = async () => {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  app.get("/directory", async (req: Request, res: Response) => {
    const directoryPath = (req.query.path as string) || DEFAULT_PATH;
    const root = await createDirectoryTree(directoryPath, req.protocol, req.get("host"));
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.json(root);
  });

  const port = 3000;

  app.use(
    cors({
      origin: "http://localhost:4200/",
    })
  );

  app.listen({ port: 3000 }, () => {
    console.log(`Server is running on http://localhost:${port}, GraphQL on http://localhost:${port}/graphql `);
  });
};

main();
