import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/Backend/Server-Side/Actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.SIGNING_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Create new Svix instance with secret
    const webhook = new Webhook(WEBHOOK_SECRET);

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error: Missing Svix headers", { status: 400 });
    }

    // Get request payload
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let event: WebhookEvent;

    // Verify payload with headers
    try {
        event = webhook.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error: Could not verify webhook:", err);
        return new Response("Error: Verification error", { status: 400 });
    }

    const eventType = event.type;

    if (eventType === "user.created") {
        const { id, email_addresses, image_url, username, first_name, last_name } = event.data;
        // Call a server action to create a new User in DB
        await createUser({
            clerkId: id,
            name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || "User",
            username: username || "User",
            email: email_addresses[0].email_address,
            picture: image_url,
        });
        return NextResponse.json({ message: "Webhook received: User created" }, { status: 200 });
    }

    if (eventType === "user.updated") {
        const { id, email_addresses, image_url, username, first_name, last_name } = event.data;
        // Call a server action to update existing User in DB
        await updateUser({
            clerkId: id,
            updatedData: {
                name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || "User",
                username: username || "User",
                email: email_addresses[0].email_address,
                picture: image_url,
            },
            pathToRefetch: `/profile/${id}`,
        });
        return NextResponse.json({ message: "Webhook received: User updated" }, { status: 200 });
    }

    if (eventType === "user.deleted") {
        const { id } = event.data;
        // Call a server action to delete a User from DB
        await deleteUser({ clerkId: id! });
        return NextResponse.json({ message: "Webhook received: User deleted" }, { status: 200 });
    }

    return new Response("Webhook received", { status: 200 });
}
