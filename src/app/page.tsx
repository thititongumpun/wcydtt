import MemeImage from "@/components/MemeImage";
import UploadImageWidget from "@/components/upload-image-widget";
import { getMemeImages } from "@/lib/fetchMemeImage";

export default async function Home() {
  const images = await getMemeImages();
  return (
    <>
      <UploadImageWidget />
      <MemeImage images={images!} />
    </>
  );
}
