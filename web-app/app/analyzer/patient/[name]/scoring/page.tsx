// app/analyzer/patient/[name]/scoring/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { exampleUsers, User } from "@/app/example-user";
import { CategoryRing } from "../../../../components/analyzer/CategoryRing";

type Params = {
  name: string;
};

type Category = {
  key: string;
  label: string;
  value: number;
};

const categories: Category[] = [
  { key: "anthropometry", label: "Körperliche Grunddaten", value: 30 },
  { key: "activity", label: "Bewegung & Aktivität", value: 50 },
  {
    key: "cardio-metabolic",
    label: "Herz- Kreislauf &\nStoffwechselrisiken",
    value: 34,
  },
  { key: "lifestyle", label: "Lifestyle-Risiken", value: 71 },
  { key: "nutrition", label: "Ernährung", value: 85 },
];

export default async function ScoringPage({
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

  const nextHref = `/analyzer/patient/${encodeURIComponent(
    decodedName
  )}/scoring-better`;

  return (
    <div className="min-h-90vh bg-background flex items-start justify-center px-4 pt-24">
      <div className="flex flex-col items-center text-center w-full max-w-5xl">
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary">
          Auswertung aus dem Test
        </h1>
        <p className="mt-3 max-w-xl text-xs md:text-sm text-font-secondary">
          Die Auswertung zeigt in welchen Kategorien du noch etwas aufholen
          kannst, um gesünder, länger zu leben!
        </p>

        <div className="mt-10 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-10 justify-items-center">
          {categories.map((cat) => (
            <CategoryRing
              key={cat.key}
              label={cat.label}
              baseValue={cat.value}
              mode="single"
            />
          ))}
        </div>

        <p className="mt-14 text-sm text-font-primary">
          Wie könnte es aussehen wenn du alles richtig machst?
        </p>

        <Link
          href={nextHref}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-sm font-medium text-card hover:opacity-90 transition-opacity"
        >
          Jetzt verbessern
        </Link>
      </div>
    </div>
  );
}
