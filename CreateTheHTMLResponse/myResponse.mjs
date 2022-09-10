import { createServer } from "node:http";

const server = createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("Type-Content", "text/html");
  response.end(
    "<html><body><h1>Hi, I'm a server and I'm running!</h1><p>Nice to meet you! :) </p></body><html>"
  );
});

server.listen(3000, () => {
  console.log("Server running at https://localhost:3000");
});
