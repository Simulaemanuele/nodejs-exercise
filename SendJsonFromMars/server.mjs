import { createServer } from "node:http";

const server = createServer((request, response) => {
  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json");

  const jsonResBody = JSON.stringify({ location: "Mars" });

  response.end(jsonResBody);
});

server.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});

//The content-length value is 19
