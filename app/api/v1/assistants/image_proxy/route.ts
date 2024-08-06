// import { sendEmailUsingSendgrid } from "@/lib/sendgrid"O

import { NextRequest, NextResponse } from 'next/server';

// export const fetchCache = 'force-no-store'
export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse(JSON.stringify({ error: 'URL query parameter is required' }), { status: 400 });
  }

  // url decode the url
  const decodedUrl = decodeURIComponent(url);

  try {
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(
      imageBuffer,
      { status: 200 ,
        headers: {
          'Content-Type': response.headers.get('content-type'),
          'Cache-Control': 's-maxage=86400, stale-while-revalidate'
        }
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    })
  }
}
