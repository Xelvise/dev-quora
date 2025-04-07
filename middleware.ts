import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/ask-question(.*)", "/profile/edit(.*)", "/collection(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // Checks if requested route is protected
    if (isProtectedRoute(req)) {
        // Redirects to Sign-in route, if User is not authenticated yet
        await auth.protect();
        // If Auth is successful, User is redirected back to requested route
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
