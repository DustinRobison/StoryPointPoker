export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return {
    title: `SSP: ${params.slug}`,
  };
}

interface RoomLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export default function RoomLayout({ params, children }: RoomLayoutProps) {
  return (
    <>
      <section className="min-h-[calc(100vh-200px)] bg-slate-50 text-black">
        {children}
      </section>
    </>
  );
}
