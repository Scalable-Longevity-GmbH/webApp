// app/analyzer/patient-view/[name]/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";
import { exampleUsers, User as BaseUser } from "@/app/example-user";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Params = {
  name: string;
};

type ExtendedUser = BaseUser & {
  waistCircumference?: number | string;
  dailyActivityMinutes?: string;
  sportMinutesPerDay?: string;

  systolicBloodPressure?: number | string;
  miStrokeHistory?: "ja" | "nein" | string;
  familyMiStrokeHistory?: "ja" | "nein" | string;
  diabetesDiagnosis?: "ja" | "nein" | string;
  hba1c?: number | string;
  ldl?: number | string;
  hdl?: number | string;

  smokingStatus?: string;
  fastFoodFrequency?: string;
  stressLevel?: string;

  fruitsVegPerDay?: string;
  fishPerWeek?: string;
};

export default async function PatientViewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // ⬅️ THIS is the important part: await params
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const baseUser = exampleUsers.find((u) => u.name === decodedName);
  if (!baseUser) notFound();

  const user: ExtendedUser = baseUser;
  const bmi = user.bmi?.toFixed(1);

  return (
    <div className="h-full bg-background flex items-center justify-center">
      {/* Card constrained to viewport height */}
      <div className="bg-card rounded-3xl shadow-sm max-w-5xl w-full max-h-[80vh] flex flex-col md:flex-row overflow-hidden">
        {/* LEFT – DATA, scrollable if needed */}
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          {/* Name */}
          <h1 className="text-lg font-semibold text-font-primary mb-4">
            {user.name}
          </h1>

          <div className="space-y-4 text-xs">
            {/* 1. Körperliche Grunddaten */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-font-secondary pb-1 border-b border-card-border">
                Körperliche Grunddaten (Anthropometrie)
              </h2>
              <div className="mt-2 space-y-1">
                <Row label="Aktuelles Alter / Chronologisches Alter">
                  {user.chronologicalAge} Jahre
                </Row>
                <Row label="Biologisches Alter">{user.biologicalAge} Jahre</Row>
                <Row label="BMI">{bmi ?? "—"}</Row>
                <Row label="Bauchumfang">{user.waistCircumference ?? "—"}</Row>
              </div>
            </section>

            {/* 2. Bewegung & Aktivität */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-font-secondary pb-1 border-b border-card-border">
                Bewegung &amp; Aktivität
              </h2>
              <div className="mt-2 space-y-1">
                <Row label="Bewegung im Alltag &gt; 30 min/Tag">
                  {user.dailyActivityMinutes ?? "—"}
                </Row>
                <Row label="Sport &gt; 30 min/Tag">
                  {user.sportMinutesPerDay ?? "—"}
                </Row>
              </div>
            </section>

            {/* 3. Herz-Kreislauf & Stoffwechselrisiken */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-font-secondary pb-1 border-b border-card-border">
                Herz-Kreislauf &amp; Stoffwechselrisiken
              </h2>
              <div className="mt-2 space-y-1">
                <Row label="Systolischer Blutdruck">
                  {user.systolicBloodPressure ?? "—"}
                </Row>
                <Row label="MI/Stroke (eigene Vorgeschichte)">
                  {user.miStrokeHistory ?? "—"}
                </Row>
                <Row label="Familienvorgeschichte MI/Stroke">
                  {user.familyMiStrokeHistory ?? "—"}
                </Row>
                <Row label="Wenn Familienvorgeschichte positiv → Konditionalregel">
                  {user.familyMiStrokeHistory === "ja" ? "relevant" : "—"}
                </Row>
                <Row label="Diabetes-Diagnose">
                  {user.diabetesDiagnosis ?? "—"}
                </Row>
                <Row label="HbA1c (wenn Diabetes negativ)">
                  {user.hba1c ?? "—"}
                </Row>
                <Row label="LDL">{user.ldl ?? "—"}</Row>
                <Row label="HDL">{user.hdl ?? "—"}</Row>
              </div>
            </section>

            {/* 4. Lifestyle-Risiken */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-font-secondary pb-1 border-b border-card-border">
                Lifestyle-Risiken
              </h2>
              <div className="mt-2 space-y-1">
                <Row label="Rauchen">{user.smokingStatus ?? "—"}</Row>
                <Row label="Fastfood">{user.fastFoodFrequency ?? "—"}</Row>
                <Row label="Stress">{user.stressLevel ?? "—"}</Row>
              </div>
            </section>

            {/* 5. Ernährung */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-font-secondary pb-1 border-b border-card-border">
                Ernährung
              </h2>
              <div className="mt-2 space-y-1">
                <Row label="Obst &amp; Gemüse">
                  {user.fruitsVegPerDay ?? "—"}
                </Row>
                <Row label="Fisch">{user.fishPerWeek ?? "—"}</Row>
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT – IMAGE */}
        <div className="md:w-[45%] w-full h-52 md:h-auto">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={800}
              height={800}
              className="w-full h-full object-cover md:rounded-l-none rounded-b-3xl md:rounded-b-none md:rounded-r-3xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-card-border text-font-primary text-3xl font-semibold md:rounded-l-none rounded-b-3xl md:rounded-b-none md:rounded-r-3xl">
              {user.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <Link
        href={`/analyzer/patient/${encodeURIComponent(user.name)}/chrono-bio`}
        className="p-5 rounded-full bg-card ml-10"
      >
        <ArrowRight className="text-primary" />
      </Link>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-font-primary">{label}</span>
      <span className="text-font-primary text-right">{children}</span>
    </div>
  );
}
