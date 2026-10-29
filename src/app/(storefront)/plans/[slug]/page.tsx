export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <div className="max-w-4xl mx-auto py-16 px-4">Plan: {slug}</div>;
}
