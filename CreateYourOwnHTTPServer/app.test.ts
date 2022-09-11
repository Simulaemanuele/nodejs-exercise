import supertest from "supertest";

import app from "./app";

const request = supertest(app);

test("GET /foods", async () => {
  const response = await request
    .get("/foods")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toEqual([{ name: "Pizza" }, { name: "Pasta" }]);
});
