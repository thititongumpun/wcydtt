import { v2 as cloudinary } from "cloudinary";
import { getCldImageUrl } from "next-cloudinary";
import { ImageCloudinary, Resource, Resources } from "@/types/Image";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getMemeImages() {
  try {
    const blurImageUrls: ImageCloudinary[] = [];

    // Get all images from Cloudinary account
    const result: Resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "wcydtt",
      max_results: 100,
    });

    // Use Promise.all to wait for all image processing to complete
    await Promise.all(
      result.resources.map(async (image: Resource) => {
        const cldImageUrl = await getCldImageUrl({
          src: image.public_id,
          width: 960,
          height: 600,
          removeBackground: true,
        });

        try {
          const response = await fetch(cldImageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString("base64");
          const dataUrl = `data:${response.type};base64,${base64}`;

          // Synchronously push to the array
          blurImageUrls.push({
            public_id: image.public_id,
            blur_url: dataUrl,
          });
        } catch (imageError) {
          console.error(
            `Error processing image ${image.public_id}:`,
            imageError
          );
        }
      })
    );

    return blurImageUrls;
  } catch (error) {
    console.error("Error fetching images:", error);
    return []; // Return empty array in case of error
  }
}