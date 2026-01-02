// src/app/api/test/route.ts
import { prisma } from "@/lib/db"; // Ингэж дуудна

export async function GET() {
  const users = await prisma.user.findMany(); // Ажиллана
  return Response.json(users);
}