import { Pool } from 'pg';

export default new Pool ({
    max: 20,
    idleTimeoutMillis: 30000,
    database:'agro-stat-db',
    port: 5432,
    user: 'agrostat',
    password: 'agrostat',
    host: 'db'
});