export default () => {
  const port = parseInt(process.env.PORT || '3000', 10);
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

  // // Validate port numbers
  // if (isNaN(port) || port <= 0 || port > 65535) {
  //   throw new Error(
  //     `Invalid PORT: ${process.env.PORT}. Must be a number between 1 and 65535.`,
  //   );
  // }

  // if (isNaN(redisPort) || redisPort <= 0 || redisPort > 65535) {
  //   throw new Error(
  //     `Invalid REDIS_PORT: ${process.env.REDIS_PORT}. Must be a number between 1 and 65535.`,
  //   );
  // }

  return {
    port,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: redisPort,
    },
  };
};
