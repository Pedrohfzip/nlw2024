import fastify from "fastify";
const app = fastify();

app.get("/", () => {
  return "Hello nlw";
});

app
  .listen({ port: 3333 })
  .then(() => {
    console.log("Conectado");
  })
  .catch(() => {});
