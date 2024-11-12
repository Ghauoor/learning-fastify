const creatUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },

  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
        message: { type: "string" },
      },
    },
  },
};

async function userRouter(fastify, options) {
  fastify.post(
    "/api/users",
    { schema: creatUserSchema },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const userCollection = fastify.mongo.db.collection("users");

      const existingUser = await userCollection.findOne({ email });

      if (existingUser) {
        fastify.log.error(`User with email ${email} already exists`);
        reply.code(400);
        return { message: "User with this email already exists" };
      }

      const user = await userCollection.insertOne({
        name,
        email,
        password,
      });

      fastify.log.info(`User created ${user.insertedId}`);
      const insertedId = user.insertedId;
      reply.code(201);
      return {
        id: insertedId,
        message: "User created successfully",
      };
    }
  );

  // get all user

  fastify.get("/api/users", async (request, reply) => {
    const userCollection = fastify.mongo.db.collection("users");
    const users = await userCollection.find().toArray();

    fastify.log.info(`All users ${users}`);
    reply.code(200);
    return users;
  });

  // get simple user by id
  fastify.get("/api/users/:id", async (request, reply) => {
    const id = new fastify.mongo.ObjectId(request.params.id);

    const userCollection = fastify.mongo.db.collection("users");
    const user = await userCollection.findOne({
      _id: id,
    });

    if (!user) {
      fastify.log.error(`User with id ${id} not found`);
      reply.code(404);
      return { message: "User not found" };
    }

    fastify.log.info(`User with id ${id} ${user}`);
    reply.code(200);
    return user;
  });

  fastify.get("/api/users/me", async (request, reply) => {
    const user = request.user;
    if (!user) {
      fastify.log.error(`User not found`);
      reply.code(404);
      return { message: "User not found" };
    }

    fastify.log.info(`User with id ${user._id} ${user}`);
    reply.code(200);
    return user;
  });

  fastify.get("/api/user", async (request, reply) => {
    const { q } = request.query;
    const userCollection = fastify.mongo.db.collection("users");
    const users = await userCollection
      .find({ name: { $regex: q, $options: "i" } })
      .toArray();

    fastify.log.info(`All users ${users}`);
    reply.code(200);
    return users;
  });
}

export default userRouter;
