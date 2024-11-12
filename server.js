import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const start = async () => {
  const PORT = process.env.PORT || 3000;

  try {
    await fastify.listen({ port: PORT });

    console.log(`Server running on ${fastify.server.address().port}`);
  } catch (error) {
    console.log(fastify.log.error);
    process.exit(1);
  }
};

start();
