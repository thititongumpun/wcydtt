import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <section className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <Loader2 className="animate-spin" />
    </section>
  );
}
