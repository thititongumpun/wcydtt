import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    // Get all images from Cloudinary account
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'wcydtt',
      max_results: 100
    });


    // Return the resources array
    return NextResponse.json(result.resources || []);

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { paramsToSign } = body

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!);

  revalidatePath("/")

  return Response.json({ signature });
}
