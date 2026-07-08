import { NextResponse, type NextRequest } from "next/server";

function getSubmittedPassword(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) return null;

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) return null;

    return decoded.slice(separatorIndex + 1);
  } catch {
    return null;
  }
}

function addPrivateIndexingHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export function proxy(request: NextRequest) {
  const sitePassword = process.env.CORUKAI_SITE_PASSWORD;

  if (!sitePassword) return NextResponse.next();

  const submittedPassword = getSubmittedPassword(request);

  if (submittedPassword === sitePassword) {
    return addPrivateIndexingHeaders(NextResponse.next());
  }

  return new NextResponse("CoruKai esta en fase privada.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="CoruKai privado", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
