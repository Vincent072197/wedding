import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getAllConfig, upsertConfig } from "../lib/queries/config";
import { createPost, getApprovedPosts } from "@/lib/queries/guestbook";

async function test() {
  // Write a test value
  // await getApprovedPosts();
  // console.log("upsertConfig: OK");
  await createPost("test123", "Hi");
  const result = await getApprovedPosts();
  console.log("upsertConfig: OK", result);
}

test().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
