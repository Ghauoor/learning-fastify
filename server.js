import Fastify from "fastify";
import fastifyMongo from "@fastify/mongodb";

import userRouter from "./src/routes/user.js";

const fastify = Fastify({
  logger: true,
});

// db connection
fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.MONGODB_URI,
});

fastify.register(userRouter);

fastify.get("/health", function (request, reply) {
  reply.send({ message: "Server is up and running" });
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
