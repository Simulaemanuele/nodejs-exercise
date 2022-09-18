import prisma from './lib/prisma/client';
import express from "express";
import "express-async-errors";

const app = express();

app.get("/planets", async (request, response) => {
    const planets = await prisma.planet.findMany();
    response.json(planets);
});

export default app;
