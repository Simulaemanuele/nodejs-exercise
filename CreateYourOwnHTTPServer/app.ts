import express from "express";
import "express-async-errors";

const app = express();

app.get("/foods", (request, response) => {
  response.json([{ name: "Pizza" }, { name: "Pasta" }]);
});

export default app;
