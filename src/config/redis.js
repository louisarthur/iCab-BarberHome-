// por padrão o redis roda no ip padrão e a porta é a padrão também a 6379
export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};
