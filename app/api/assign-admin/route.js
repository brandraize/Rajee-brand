import { authAdmin } from "../../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await authAdmin.getUserByEmail(email);

    await authAdmin.setCustomUserClaims(user.uid, { admin: true });

    return NextResponse.json({
      message: `Successfully assigned admin role to ${email}. The user may need to log out and log back in for changes to take effect.`,
    });
  } catch (error) {
    console.error("Error assigning admin role:", error);
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to assign admin role" },
      { status: 500 }
    );
  }
}