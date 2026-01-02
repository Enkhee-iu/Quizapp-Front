import { prisma } from "@/lib/db"; // @prisma/client-аас биш, эндээс импортло!
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany(); 
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}