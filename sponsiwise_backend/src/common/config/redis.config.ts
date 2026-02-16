export interface RedisConfig {
  host: string;
  port: number;
  db: number;
  password?: string;
}

export default (): { redis: RedisConfig } => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    db: parseInt(process.env.REDIS_DB || '0', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
});
