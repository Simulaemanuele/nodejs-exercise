import supertest from "supertest";
import { prismaMock } from './lib/prisma/client.mock';
import app from "./app";

const request = supertest(app);

//GET ALL RESOURCES

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

//GET A RESOURCE BY ID

describe("GET /planets/:id", () => {
    test("Valid request", async () => {
        const planet =
        {
            id: 1,
            name: "Mercury",
            description: "null",
            diameter: 1234,
            moons: 12,
            createdAt: "2022-09-13T11:10:20.422Z",
            updatedAt: "2022-09-13T11:09:48.636Z",
        };



        //@ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(planet)

        const response = await request
            .get("/planets/1")
            .expect(200)
            .expect("Content-Type", /application\/json/);


        expect(response.body).toEqual(planet);
    });

    test("Planet does not exist", async () => {
        //@ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(null);

        const response = await request
            .get("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/23");
    });

    test("Invalid planet ID", async () => {

        const response = await request
            .get("/planets/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/asdf");
    });
})

//ADD A RESOURCE BY POST METHOD

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

//UPDATE A RESOURCE BY ID

describe("PUT /planets/:id", () => {
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
        prismaMock.planet.update.mockResolvedValue(planet)

        const response = await request
            .put("/planets/3")
            .send({
                name: "Mercury",
                description: "Lovely planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);


        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        const response = await request
            .put("/planets/23")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array)
            }
        });
    });

    test("Planet does not exist", async () => {
        //@ts-ignore
        prismaMock.planet.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .put("/planets/23")
            .send({
                name: "Mercury",
                description: "Lovely planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/23");
    });

    test("Invalid planet ID", async () => {

        const response = await request
            .put("/planets/asdf")
            .send({
                name: "Mercury",
                description: "Lovely planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/asdf");
    });
});

//DELETE A RESOURCE BY ID

describe("DELETE /planets/:id", () => {
    test("Valid request", async () => {


        const response = await request
            .delete("/planets/1")
            .expect(204);



        expect(response.text).toEqual("");
    });

    test("Planet does not exist", async () => {
        //@ts-ignore
        prismaMock.planet.delete.mockRejectedValue(new Error("Error"));

        const response = await request
            .delete("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/23");
    });

    test("Invalid planet ID", async () => {

        const response = await request
            .delete("/planets/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/asdf");
    });
})