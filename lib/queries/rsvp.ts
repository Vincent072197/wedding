import db from "../db";

export async function getAllRsvps() {
  const result = await db.query(
    `
    SELECT * 
    FROM rsvp_guests
    ORDER BY submitted_at DESC
    `,
  );
  return result.rows;
}

export async function upsertRsvp(data: {
  name: string;
  phone: string;
  attending: "yes" | "no";
  adultCount: number;
  childCount: number;
  mealPreference?: string;
  note?: string;
}) {
  const result = await db.query(
    `INSERT INTO rsvp_guests
         (name, phone, attending, adult_count, child_count, meal_preference, note)                 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (phone) DO UPDATE SET                                                                                 
         name                 = $1,
         attending            = $3,                                                                                      
         adult_count          = $4,
         child_count          = $5,                                                                                      
         meal_preference      = $6,
         note                 = $7,
         updated_at           = NOW()                                                                                    
       RETURNING *`,
    [
      data.name,
      data.phone,
      data.attending,
      data.adultCount,
      data.childCount,
      data.mealPreference ?? null,
      data.note ?? null,
    ],
  );
  return result.rows[0];
}

export async function assignTable(id: number, tableNumber: number) {
  await db.query(`UPDATE rsvp_guests SET table_number = $1 WHERE id = $2`, [
    tableNumber,
    id,
  ]);
}
