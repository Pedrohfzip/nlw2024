import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const app = fastify();
const prisma = new PrismaClient({
  log: ["query"],
});
app.post("/events", async (req, res) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  });

  const data = createEventSchema.parse(req.body);
  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: new Date().toISOString(),
    },
  });

  return res.status(201).send({ ebentId: event.id });
});

app
  .listen({ port: 3333 })
  .then(() => {
    console.log("Conectado");
  })
  .catch(() => {});
