import ReviewForm from "./ReviewForm";

export const metadata = {
  title: "Write a Review | ANAMYST",
  description:
    "Bought from ANAMYST? Share your experience with the fragrance you received.",
  alternates: {
    canonical: "https://www.anamyst.com/review",
  },
  /* a form, not content worth showing in search */
  robots: {
    index: false,
    follow: true,
  },
};

export default function ReviewPage() {

  return <ReviewForm />;

}
