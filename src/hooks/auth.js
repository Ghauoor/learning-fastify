const validateToken = () => {
  return new Promise((resolve, reject) => {
    resolve({ userId: "123" });
  });
};

export const authHandler = (request, reply, done) => {
  validateToken()
    .then((user) => {
      request.userId = user.userId;
      done();
    })
    .catch((err) => {
      reply.code(401).send({ message: "Invalid token" }); // both are valid way to handle
      // done(err);
    });
};
