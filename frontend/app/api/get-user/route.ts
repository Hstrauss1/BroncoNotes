import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const data = await fetch(
    `${process.env.PYTHON_SERVER_ENDPOINT}/user/${searchParams.get("user-id")}`,
    {
      headers: {
        Authorization: `Bearer ${searchParams.get("token")}`,
      },
    }
  );
  const posts = await data.json();
  return Response.json(posts);
}
