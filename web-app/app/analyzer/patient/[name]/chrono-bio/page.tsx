import { notFound } from "next/navigation";
import Link from "next/link";
import { exampleUsers, User } from "@/app/example-user";

type Params = {
  name: string;
};

export default async function ChronoBioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const user: User | undefined = exampleUsers.find(
    (u) => u.name === decodedName
  );

  if (!user) {
    notFound();
  }

  const { biologicalAge, chronologicalAge } = user;
  const pace =
    chronologicalAge > 0 ? (biologicalAge / chronologicalAge).toFixed(1) : "—";

  const scoringHref = `/analyzer/patient/${encodeURIComponent(
    decodedName
  )}/scoring`;

  return (
    <div className="min-h-90vh bg-background flex items-center justify-center px-4 pt-24 pb-12">
      <div className="flex flex-col items-center text-center max-w-xl w-full">
        {/* Headline */}
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary mb-16">
          Chronologisches- v.s. Biologisches Alter
        </h1>

        {/* Ages block */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="flex flex-col items-center">
            <div className="text-7xl font-semibold text-font-primary">
              {biologicalAge}
            </div>
            <div className="text-xs mt-1 text-font-secondary">biologisch</div>
          </div>

          <div className="bg-font-secondary w-0.5 rounded-full h-12"></div>

          <div className="flex flex-col items-center">
            <div className="text-7xl font-semibold text-font-primary">
              {chronologicalAge}
            </div>
            <div className="text-xs mt-1 text-font-secondary">
              chronologisch
            </div>
          </div>
        </div>

        {/* Pace of Aging */}
        <div className="mb-12">
          <div className="text-xs text-font-secondary mb-1">Pace of Aging</div>
          <div className="text-sm font-semibold text-font-primary">{pace}</div>
        </div>

        {/* Question */}
        <div className="mb-12 text-sm text-font-primary">
          Aber warum ist das so?
        </div>

        {/* CTA */}
        <Link
          href={scoringHref}
          className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-sm font-medium text-card hover:opacity-90 transition-opacity"
        >
          Jetzt herausfinden
        </Link>
      </div>
    </div>
  );
}
