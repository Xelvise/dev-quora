import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
    const url = new URL(request.url);

    // checking if requested route matches a protected route (i.e, inverse of public routes)
    if (!isPublicRoute(request)) {
        // validating route to see if it exists...
        const response = await fetch(url.origin + url.pathname, { method: "HEAD" });
        // If it does, requested route is protected until sign-up or sign-in is completed
        if (response.status !== 404) await auth.protect();
    }
    // But if requested route is public, it is allowed to proceed unprotected
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
