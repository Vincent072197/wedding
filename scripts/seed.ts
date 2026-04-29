import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool } from "pg";
import bcrypt from "bcryptjs";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await pool.query(
    `INSERT INTO admins (email,password_hash,name,role)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (email) DO NOTHiNG
    `,
    ["admin@wedding.com", passwordHash, "Admin", "super_admin"],
  );
  console.log("Admin seeded.");
  await pool.end();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
