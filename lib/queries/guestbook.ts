import db from "../db";

export async function getApprovedPosts() {
  const result = await db.query(`
      SELECT id,guest_name,message,likes_count,created_at
      FROM guestbook_posts
      WHERE is_approved =TRUE
      ORDER BY created_at ASC
      `);
  return result.rows;
}

export async function createPost(guestName: string, message: string) {
  const result = await db.query(
    `
      INSERT INTO guestbook_posts (guest_name,message)
      VALUES ($1,$2)
      RETURNING id,guest_name,message,likes_count,created_at
      `,
    [guestName, message],
  );
  return result.rows[0];
}

export async function likePost(postId: number, fingerprint: string) {
  await db.query(
    `
    INSERT INTO guestbook_like (post_id,fingerprint)
    VALUES ($1,$2)
    ON CONFLICT (post_id,fingerprint) DO NOTHING
    `,
    [postId, fingerprint],
  );
  await db.query(
    `
    UPDATE guestbook_posts
    SET likes_count = likes_count +1
    WHERE id = $1
    `,
    [postId],
  );
}
