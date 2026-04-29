import db from "../db";

export async function getVisiblePhotos() {
  const result = await db.query(`
      SELECT * FROM gallery_photos
      WHERE is_visible =TRUE
      ORDER BY display_order ASC
      `);
  return result.rows;
}

export async function createPhoto(
  url: string,
  caption: string,
  altText: string,
  uploadedBy: number,
) {
  const result = await db.query(
    `
       INSERT INTO gallery_photos (url, caption, alt_text, uploaded_by)
        VALUES ($1,$2,$3,$4)
         RETURNING id, url, caption, alt_text, display_order   
        `,
    [url, caption, altText, uploadedBy],
  );
  return result.rows[0];
}

export async function deletePhoto(id: number) {
  await db.query(
    `
    DELETE FROM gallery_photos WHERE id = $1
    `,
    [id],
  );
}

export async function updatePhotoVisibility(id: number, isVisible: boolean) {
  await db.query(
    `
    UPDATE gallery_photos SET is_visible = $1 WHERE id = $2
    `,
    [isVisible, id],
  );
}
