import { connectDB } from "../../../lib/mongodb";
import Notice from "../../../models/Notice";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  await connectDB();

  const notice = await Notice.findOne({ slug, published: true }).lean();

  if (!notice) {
    return {
      title: "Not Found | ANAMYST",
    };
  }

  return {
    title: `${notice.title} | ANAMYST`,
    description: notice.excerpt || notice.title,
    openGraph: {
      title: notice.title,
      description: notice.excerpt || notice.title,
      images: notice.image ? [{ url: notice.image }] : [],
    },
  };
}

export default async function NoticeDetailPage({ params }) {
  const { slug } = await params;

  await connectDB();

  const notice = await Notice.findOne({ slug, published: true }).lean();

  if (!notice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/notices"
          className="text-[#D4AF37] text-sm hover:underline"
        >
          ← Back to Updates
        </Link>

        <p className="uppercase tracking-[4px] text-[#D4AF37] text-xs mt-8 mb-4">
          {new Date(notice.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          {notice.title}
        </h1>

        {notice.image && (
          <div className="relative w-full h-[320px] md:h-[420px] rounded-[32px] overflow-hidden border border-white/10 mb-10">
            <Image
              src={notice.image}
              alt={notice.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              preload
            />
          </div>
        )}

        <div className="text-gray-300 leading-9 text-lg whitespace-pre-line">
          {notice.content}
        </div>
      </div>
    </div>
  );
}
