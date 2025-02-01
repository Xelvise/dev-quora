import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
    const url = new URL(request.url);
    // validating route...
    const response = await fetch(url.origin + url.pathname, { method: "HEAD" });

    // checking if requested route matches any of the defined public routes and if it exists
    if (!isPublicRoute(request) && response.status !== 404) {
        // If condition is satisfied, the requested route is protected until sign-up or sign-in is completed
        await auth.protect();
    }
    // Otherwise, the requested route is allowed to proceed unprotected
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
