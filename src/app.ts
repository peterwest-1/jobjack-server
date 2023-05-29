import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const port = 3000; // Replace with the desired port number
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
