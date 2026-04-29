import { NextResponse } from "next/server";
import { getAllConfig, upsertConfig } from "@/lib/queries/config";

export async function GET() {
  const rows = await getAllConfig();
  const config: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!config[row.section]) config[row.section] = {};
    // config[row.section][row.key] = row.value;
    try {
      config[row.section][row.key] = JSON.parse(row.value);
    } catch {
      config[row.section][row.key] = row.value;
    }
  }
  return NextResponse.json(config);
}
export async function PUT(request: Request) {
  const body = await request.json();
  for (const [section, fields] of Object.entries(body)) {
    for (const [key, value] of Object.entries(
      fields as Record<string, string>,
    )) {
      await upsertConfig(
        section,
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
    }
  }
  return NextResponse.json({ success: true });
}

// Define the path to our local JSON file
// const dataFilePath = path.join(process.cwd(), "data", "config.json");
// export async function GET() {
//   try {
//     const fileData = fs.readFileSync(dataFilePath, "utf8");
//     const config = JSON.parse(fileData);
//     return NextResponse.json(config);
//   } catch (error) {
//     console.error("Error reading config:", error);
//     return NextResponse.json(
//       { error: "Failed to read configuration" },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const newConfig = await request.json();

//     // In a real app, we would validate the input data here

//     fs.writeFileSync(dataFilePath, JSON.stringify(newConfig, null, 2), "utf8");
//     return NextResponse.json({
//       success: true,
//       message: "Configuration saved successfully",
//     });
//   } catch (error) {
//     console.error("Error writing config:", error);
//     return NextResponse.json(
//       { error: "Failed to save configuration" },
//       { status: 500 },
//     );
//   }
// }
