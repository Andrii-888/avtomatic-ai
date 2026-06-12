"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.DEMO_PASSWORD;

  if (expected && password === expected) {
    const store = await cookies();
    store.set("demo-auth", expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    redirect("/");
  }

  redirect("/login?error=1");
}
