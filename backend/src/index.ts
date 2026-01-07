import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT ?? "0";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
