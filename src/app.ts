import prisma from './lib/prisma/client';
import express from "express";
import "express-async-errors";
import { validate, planetSchema, validationErrorMiddleware, PlanetData } from "./lib/validation";
import cors from "cors";
import { initMulterMiddleware } from "./lib/middleware/multer";

const upload = initMulterMiddleware();

const corsOptions = {
    origin: "http://localhost:8080"
}

const app = express();

app.use(express.json());

app.use(cors(corsOptions));

//GET ALL RESOURCES

app.get("/planets", async (request, response) => {
    const planets = await prisma.planet.findMany();

    response.json(planets)
});

//GET A RESOURCE BY ID

app.get("/planets/:id(\\d+)", async (request, response, next) => {

    const planetId = Number(request.params.id);

    const planet = await prisma.planet.findUnique({
        where: { id: planetId }
    });

    if (!planet) {
        response.status(404);
        return next(`Cannot GET /planets/${planetId}`);
    }
    response.json(planet)
});

//ADD A RESOURCE BY POST METHOD

app.post("/planets", validate({ body: planetSchema }), async (request, response) => {
    const planetData: PlanetData = request.body;

    const planet = await prisma.planet.create({
        data: planetData
    })

    response.status(201).json(planet)
});

//UPDATE A RESOURCE BY ID

app.put("/planets/:id(\\d+)", validate({ body: planetSchema }), async (request, response, next) => {
    const planetData: PlanetData = request.body;
    const planetId = Number(request.params.id);

    try {
        const planet = await prisma.planet.update({
            where: { id: planetId },
            data: planetData
        })

        response.status(200).json(planet)
    } catch (error) {
        response.status(404);
        next(`Cannot PUT /planets/${planetId}`)
    }
});

//DELETE A RESOURCE BY ID

app.delete("/planets/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);

    try {
        await prisma.planet.delete({
            where: { id: planetId },
        })

        response.status(204).end()
    } catch (error) {
        response.status(404);
        next(`Cannot DELETE /planets/${planetId}`)
    }
});

app.post(
    "/planets/:id(\\d+)/photo",
    upload.single("photo"),
    async (request, response, next) => {

        if (!request.file) {
            response.status(400);

            return next("No photo file uploaded.");
        }

        const planetId = Number(request.params.id);
        const photoFilename = request.file.filename;

        try {
            await prisma.planet.update({
                where: { id: planetId },
                data: { photoFilename }
            })

            response.status(201).json({ photoFilename });
        } catch (error) {
            response.status(404);
            next(`Cannot POST /planets/${planetId}/photo`)
        }


    }
);

app.use("/planets/photos", express.static("uploads"));

app.use(validationErrorMiddleware);

export default app;
