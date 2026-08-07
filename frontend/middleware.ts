import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    let token = request.cookies.get("smart_scroll_token")?.value;
    const tokenFromUrl = request.nextUrl.searchParams.get("token");

    if (!token && tokenFromUrl) {
        token = tokenFromUrl;
    }

    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname.startsWith("/login");
    const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/feed");

    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/feed", request.url));
    }

    const response = NextResponse.next();

    if (tokenFromUrl) {
        response.cookies.set("smart_scroll_token", tokenFromUrl, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};