// src/app/api/webhook/clerk/route.ts

export const runtime = "nodejs";

import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = wh.verify(payload, {
      "svix-id": headersList.get("svix-id")!,
      "svix-timestamp": headersList.get("svix-timestamp")!,
      "svix-signature": headersList.get("svix-signature")!,
    });
  } catch {
    return new Response("Invalid webhook", { status: 400 });
  }

  if (event.type === "user.created") {
    const user = event.data;

    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.email_addresses[0].email_address,
      },
    });
    console.log(user.email_addresses[0].email_address);
  }

  return new Response("OK");
}
