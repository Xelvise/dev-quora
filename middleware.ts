import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/ask-question(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        // Redirects to Auth page capable of accepting Sign-in or Sign-up
        await auth.protect();
        // If Auth is successful, User is redirected back to requested route
    }
});

// ALTERNATIVELY,
// export default clerkMiddleware(async (auth, req) => {
//     const { userId, redirectToSignIn } = await auth();
//     if (!userId && isProtectedRoute(req)) {
//         return redirectToSignIn({returnBackUrl: req.url});
//     }
// });

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
