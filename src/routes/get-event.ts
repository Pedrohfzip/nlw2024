import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { REPL_MODE_SLOPPY } from "repl";
import { idText } from "typescript";
export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: {
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendess: z.number().int().nullable(),
              attendeesAmont: z.number().int(),
            }),
          },
        },
      },
    },
    async (req, res) => {
      const { eventId } = req.params;
      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        where: {
          id: eventId,
        },
      });
      if (event === null) {
        throw new Error("Event not found");
      }

      return res.send({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendess: event.maximumAttendees,
          attendeesAmount: event._count.attendees,
        },
      });
    }
  );
}
