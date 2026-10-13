type PhotoStripProps = {
  data?: {
    show?: boolean;
    photos?: { image: string }[];
  } | null;
};

const DEFAULT_PHOTOS = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    alt: "Happy customer with groceries",
  },
  {
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
    alt: "Woman with fresh vegetables box",
  },
  {
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80",
    alt: "Woman holding fresh bread and vegetables",
  },
  {
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    alt: "Customer with grocery bag",
  },
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    alt: "Woman giving thumbs up with vegetables",
  },
];

export default function PhotoStrip({ data }: PhotoStripProps = {}) {
  if (data && data.show === false) return null;

  const photos =
    data?.photos && data.photos.length > 0 ? data.photos : DEFAULT_PHOTOS;

  return (
    <section className="w-full bg-white pt-6">
      <div className="mx-auto max-w-full">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
          {photos.map((p, idx) => (
            <div
              key={idx}
              className="group relative aspect-4/5 w-full overflow-hidden bg-[#F4F4F4]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt="Grocery gallery"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}