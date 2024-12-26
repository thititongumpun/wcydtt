"use client";

import { CldImage } from "next-cloudinary";
import { ImageCloudinary } from "@/types/Image";

type MemeImagesProps = {
  images: ImageCloudinary[];
};

export default function MemeImage({ images }: MemeImagesProps) {
  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search images..."
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={image.public_id} className="aspect-[16/10] w-full">
            <CldImage
              width="400"
              height="400"
              src={image.public_id}
              sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
              alt={`Image ${index + 1}`}
              className="object-cover"
              placeholder="blur"
              blurDataURL={image.blur_url}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
