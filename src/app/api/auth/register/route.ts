import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import {
  firstZodErrorMessage,
  registerSchema,
} from "@/lib/auth-schema";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: firstZodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { name, email: normalizedEmail, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name?.trim() || normalizedEmail.split("@")[0] || "User",
        email: normalizedEmail,
        password: await hash(password, 12),
        role: "USER",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
