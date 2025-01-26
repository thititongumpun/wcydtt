"use client";

import { useState, useEffect, useTransition } from "react";
import { CldImage } from "next-cloudinary";
import { ImageCloudinary } from "@/types/Image";
import Loading from "./Loading";

type MemeImagesProps = {
  images: ImageCloudinary[];
};

export default function MemeImage({ images }: MemeImagesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState<ImageCloudinary[]>([]);
  const [isPending, startTransition] = useTransition();

  const getDisplayName = (publicId: string) => {
    // Get the last part after '/'
    const fullName = publicId.split("/").pop() || "";
    // Remove the unique ID suffix (after last underscore)
    return fullName.split("_").slice(0, -1).join("_");
  };

  // const filteredImages = images.filter((image) =>
  //   image.public_id.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  useEffect(() => {
    startTransition(() => {
      const filtered = images.filter((image) =>
        image.public_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    });
  }, [images, searchTerm]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search images..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isPending && <Loading />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {filteredImages.map((image, index) => (
          <div key={image.public_id} className="relative pb-[100%]">
            <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
              <CldImage
                width="400"
                height="400"
                src={image.public_id}
                sizes="(max-width: 640px) 100vw,
                        (max-width: 768px) 50vw,
                        (max-width: 1024px) 33vw,
                        (max-width: 1280px) 25vw,
                        20vw"
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                placeholder="blur"
                blurDataURL={image.blur_url}
                priority
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm truncate">
                {getDisplayName(image.public_id)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
