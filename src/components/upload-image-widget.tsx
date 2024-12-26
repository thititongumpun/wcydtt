"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function UploadImageWidget() {
  const router = useRouter();

  const handleUploadSuccess = async () => {
    try {
      // Call a server-side revalidation endpoint
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: "/",
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Revalidation failed");
      }
    } catch (error) {
      console.error("Error during revalidation:", error);
    }
  };

  return (
    <CldUploadWidget
      options={{ sources: ["local", "url"] }}
      uploadPreset="wcydtt"
      signatureEndpoint="/api/cloudinary"
      onSuccess={() => {
        handleUploadSuccess();
      }}
    >
      {({ open }) => {
        return (
          <Button
            onClick={() => open()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Upload an Image
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}
