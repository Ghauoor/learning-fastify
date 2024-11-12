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
  fastify.post("/api/users", { schema: creatUserSchema }, (resuest, reply) => {
    // validate request body

    reply.code(201);
    return {
      id: "123456",
      message: "User created successfully",
    };
  });
}

export default userRouter;
