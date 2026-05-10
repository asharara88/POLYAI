import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_WORKSPACE = "aldar-developments";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle /workspace and /workspace/*
  if (pathname !== "/workspace" && !pathname.startsWith("/workspace/")) {
    return NextResponse.next();
  }

  const cookieSlug = req.cookies.get("flow-workspace")?.value;
  const slug = cookieSlug && cookieSlug.length > 0 ? cookieSlug : DEFAULT_WORKSPACE;

  // No workspace bound at all (extreme fallback) — send admin/visitor to picker
  if (!slug) {
    return NextResponse.redirect(new URL("/clients", req.url));
  }

  const rest = pathname.replace(/^\/workspace/, "");
  const target = `/clients/${slug}${rest}${req.nextUrl.search}`;
  return NextResponse.rewrite(new URL(target, req.url));
}

export const config = {
  matcher: ["/workspace", "/workspace/:path*"],
};
