import { auth } from "@clerk/nextjs/server";

export async function requireUser(): Promise<string> {
  const session = await auth();

  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  return session.userId;
}
