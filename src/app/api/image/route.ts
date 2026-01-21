import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || 'Aleppo food';

    // Use Unsplash Source API (free, no key required for basic usage)
    // This returns a random image matching the query
    const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},food,middle-east`;

    return NextResponse.json({
      imageUrl,
      query
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
