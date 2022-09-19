import supertest from "supertest";
import { prismaMock } from './lib/prisma/client.mock';
import app from "./app";

const request = supertest(app);

describe("GET /planets", () => {
    test("Valid request", async () => {
        const planets = [
            {
                id: 1,
                name: "Mercury",
                description: "null",
                diameter: 1234,
                moons: 12,
                createdAt: "2022-09-13T11:10:20.422Z",
                updatedAt: "2022-09-13T11:09:48.636Z",
            },
            {
                id: 2,
                name: "Venus",
                description: "null",
                diameter: 5678,
                moons: 0,
                createdAt: "2022-09-13T11:11:44.273Z",
                updatedAt: "2022-09-13T11:11:16.895Z",
            },
        ];

        //@ts-ignore
        prismaMock.planet.findMany.mockResolvedValue(planets)

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-Type", /application\/json/);


        expect(response.body).toEqual(planets);
    });
});

describe("POST /planets", () => {
    test("Valid request", async () => {

        const planet = {
            id: 3,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moons: 12,
            createdAt: "2022-09-16T08:40:10.894Z",
            updatedAt: "2022-09-16T08:40:10.904Z"
        }

        //@ts-ignore
        prismaMock.planet.create.mockResolvedValue(planet)

        const response = await request
            .post("/planets")
            .send({
                name: "Mercury",
                diameter: 1234,
                moons: 12,
            })
            .expect(201)
            .expect("Content-Type", /application\/json/);


        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        const response = await request
            .post("/planets")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array)
            }
        });
    });
});