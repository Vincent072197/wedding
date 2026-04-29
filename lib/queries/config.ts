import pool from "../db";

export async function getAllConfig() {
  const result = await pool.query(
    `SELECT section, key, value FROM site_config`,
  );
  return result.rows;
}

export async function upsertConfig(
  section: string,
  key: string,
  value: string,
) {
  await pool.query(
    `INSERT INTO site_config (section, key, value)                                                                     
       VALUES ($1, $2, $3)
       ON CONFLICT (section, key) DO UPDATE SET value = $3, updated_at = NOW()`,
    [section, key, value],
  );
}
