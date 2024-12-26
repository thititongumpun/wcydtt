export default function EvPage() {
  const evMapUrl =
    "https://www.google.com/maps/d/embed?mid=1YKD1Z5CdoyMnSTCOf2TgLmKV-REwfmIC&ehbc=2E312F";
  return (
    <div className="w-screen h-screen">
      <iframe
        src={evMapUrl}
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
