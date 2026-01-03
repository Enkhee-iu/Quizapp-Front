import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Нэвтрэх шаардлагагүй (public) хуудсуудаа энд зааж өгч болно
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Үүнд _next болон статик файлууд орохгүй байх ёстой
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],

};