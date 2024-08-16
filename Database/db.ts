
import { Pool } from 'pg';

const pool = new Pool({
    host: 'ep-falling-resonance-a50lks8j.us-east-2.aws.neon.tech',
    user: 'moviereviewandratingplatform_owner',
    password: 'vZ1YSWHj8EiN',
    database: 'moviereviewandratingplatform',
    port: 5432,  // Default port for PostgreSQL
    ssl: {
      rejectUnauthorized: false,   // Adjust this based on your SSL requirements
    },
  });

export default pool;
