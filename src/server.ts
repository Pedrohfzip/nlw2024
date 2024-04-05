import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { generateString } from "./utils/generate-slug";
const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const prisma = new PrismaClient({
  log: ["query"],
});

//Erro 200 sucesso
//erro 300 Redirecionamento
//Erro 400 erro informação enviada por cliente que chamou a api
//erro 500 erro servidor, independente do que esta sendo enviado para os servidor

app.withTypeProvider<ZodTypeProvider>().post(
  "/events",
  {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
  },
  async (req, res) => {
    const { title, details, maximumAttendees } = req.body;

    const slug = generateString(title);
    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      },
    });
    if (eventWithSameSlug != null) {
      throw new Error("Another event with same title already exists");
    }
    const event = await prisma.event.create({
      data: {
        title: title,
        details: details,
        maximumAttendees: maximumAttendees,
        slug,
      },
    });

    return res.status(201).send({ ebentId: event.id, title: event.title });
  }
);

app
  .listen({ port: 3333 })
  .then(() => {
    console.log("Conectado");
  })
  .catch(() => {});
