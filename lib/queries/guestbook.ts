import db from "../db";

export async function getApprovedPosts() {
  const result = await db.query(`
    SELECT id, guest_name, message, likes_count, created_at
    FROM guestbook_posts
    WHERE is_approved = TRUE
    ORDER BY created_at ASC
  `);
  return result.rows;
}

export async function getAllPosts() {
  const result = await db.query(`
    SELECT id, guest_name, message, likes_count, is_approved, created_at
    FROM guestbook_posts
    ORDER BY created_at DESC
  `);
  return result.rows;
}

export async function createPost(guestName: string, message: string) {
  const result = await db.query(
    `INSERT INTO guestbook_posts (guest_name, message)
     VALUES ($1, $2)
     RETURNING id, guest_name, message, likes_count, created_at`,
    [guestName, message],
  );
  return result.rows[0];
}

export async function toggleApproval(id: number, isApproved: boolean) {
  await db.query(
    `UPDATE guestbook_posts SET is_approved = $1 WHERE id = $2`,
    [isApproved, id],
  );
}

export async function deleteGuestbookPost(id: number) {
  await db.query(`DELETE FROM guestbook_posts WHERE id = $1`, [id]);
}

export async function likePost(postId: number, fingerprint: string) {
  await db.query(
    `INSERT INTO guestbook_likes (post_id, fingerprint)
     VALUES ($1, $2)
     ON CONFLICT (post_id, fingerprint) DO NOTHING`,
    [postId, fingerprint],
  );
  await db.query(
    `UPDATE guestbook_posts SET likes_count = likes_count + 1 WHERE id = $1`,
    [postId],
  );
}
