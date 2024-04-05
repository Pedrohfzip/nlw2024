import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createEventeRoute } from "./routes/create-event";
import { registerForEvent } from "./routes/resgister-for-event";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEventeRoute);
app.register(registerForEvent);

app
  .listen({ port: 3333 })
  .then(() => {
    console.log("Conectado");
  })
  .catch(() => {});
