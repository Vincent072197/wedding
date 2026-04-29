import db from "../db";

export async function updatePhotoVisibility(id: number, isVisible: boolean) {
  await db.query(
    `
    UPDATE gallery_photos SET is_visible = $1 WHERE id = $2
    `,
    [isVisible, id],
  );
}

export async function getMenuWithItems() {
  const categories = await db.query(
    `SELECT id, name_zh, name_en, display_order                                                                        
       FROM menu_categories
       WHERE is_visible = TRUE                                                                                           
       ORDER BY display_order ASC`,
  );

  const items = await db.query(
    `SELECT id, category_id, name_zh, name_en, description_zh, description_en, display_order
       FROM menu_items                                                                                                   
       WHERE is_visible = TRUE
       ORDER BY display_order ASC`,
  );

  return categories.rows.map((cat) => ({
    ...cat,
    items: items.rows.filter((item) => item.category_id === cat.id),
  }));
}

export async function createCategory(nameZh: string, nameEn: string) {
  const result = await db.query(
    `INSERT INTO menu_categories (name_zh, name_en)                                                                    
       VALUES ($1, $2)
       RETURNING id, name_zh, name_en`,
    [nameZh, nameEn],
  );
  return result.rows[0];
}

export async function createMenuItem(
  categoryId: number,
  nameZh: string,
  nameEn: string,
) {
  const result = await db.query(
    `INSERT INTO menu_items (category_id, name_zh, name_en)
       VALUES ($1, $2, $3)                                                                                               
       RETURNING id, category_id, name_zh, name_en`,
    [categoryId, nameZh, nameEn],
  );
  return result.rows[0];
}
