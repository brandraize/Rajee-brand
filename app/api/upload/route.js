import { put } from "@vercel/blob";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const path = formData.get("path");

    if (!file || !path) {
      return new Response(JSON.stringify({ error: "File or path missing" }), {
        status: 400,
      });
    }

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return new Response(JSON.stringify({ url: blob.url }), { status: 200 });
  } catch (err) {
    console.error("Upload failed:", err);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}
