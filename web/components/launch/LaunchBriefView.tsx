import { CheckCircle2, ListChecks, Quote, Target, UsersRound } from "lucide-react";
import type { Launch } from "@/lib/launches";
import { plainLanguage } from "@/lib/strip-jargon";

/**
 * Brief view — renders the structured fields of the campaign brief into
 * scannable sub-cards rather than dumping the markdown. The raw prose body
 * (above and below the YAML block) is rendered at the bottom for context.
 */
export default function LaunchBriefView({ launch }: { launch: Launch }) {
  const audience = launch.audience as Record<string, Record<string, unknown>> | null;
  const positioning = launch.positioning as
    | { promise?: string; proof_points?: string[]; anti_positioning?: string[] }
    | null;
  const offer = launch.yaml.offer as
    | { hook?: string; call_to_action?: string; destination?: string }
    | undefined;
  const constraints = launch.constraints as
    | {
        must_include?: string[];
        must_avoid?: string[];
        brand_voice_ref?: string;
        compliance_flags?: string[];
      }
    | null;

  return (
    <div className="space-y-6">
      <BriefSection icon={Target} title="Goal & primary KPI">
        <div className="space-y-2 text-body-sm leading-relaxed">
          <p className="text-ink-800 dark:text-ink-100">
            <span className="font-semibold">Goal:</span>{" "}
            {plainLanguage(launch.goal) || "—"}
          </p>
          {launch.primaryKpi && (
            <p className="text-ink-700 dark:text-ink-200">
              <span className="font-semibold">Primary KPI:</span>{" "}
              {plainLanguage(launch.primaryKpi)}
            </p>
          )}
          {Array.isArray(launch.yaml.secondary_kpis) && (
            <ul className="list-disc list-inside text-body-sm text-ink-600 dark:text-ink-300 space-y-1">
              {(launch.yaml.secondary_kpis as string[]).map((k, i) => (
                <li key={i}>{plainLanguage(String(k))}</li>
              ))}
            </ul>
          )}
        </div>
      </BriefSection>

      {audience && Object.keys(audience).length > 0 && (
        <BriefSection icon={UsersRound} title="Audience segments">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(audience).map(([key, seg]) => {
              const obj = seg as { name?: string; pains?: string[] };
              return (
                <div
                  key={key}
                  className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30 p-3"
                >
                  <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
                    {key.replace(/_/g, " ")}
                  </div>
                  <div className="text-body-sm font-semibold text-ink-900 dark:text-ink-50 mt-0.5 leading-snug">
                    {obj.name ?? "—"}
                  </div>
                  {Array.isArray(obj.pains) && obj.pains.length > 0 && (
                    <ul className="mt-2 text-body-xs text-ink-600 dark:text-ink-300 space-y-1 list-disc list-inside">
                      {obj.pains.slice(0, 3).map((p, i) => (
                        <li key={i} className="leading-snug">
                          {plainLanguage(p)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </BriefSection>
      )}

      {positioning?.promise && (
        <BriefSection icon={Quote} title="Positioning">
          <blockquote className="border-l-4 border-l-accent pl-4 py-1 text-body text-ink-800 dark:text-ink-100 italic leading-relaxed">
            {plainLanguage(positioning.promise.trim())}
          </blockquote>
          {Array.isArray(positioning.proof_points) && positioning.proof_points.length > 0 && (
            <div className="mt-3">
              <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400 mb-1.5">
                Proof points
              </div>
              <ul className="text-body-sm text-ink-700 dark:text-ink-200 space-y-1.5">
                {positioning.proof_points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" aria-hidden />
                    <span className="leading-snug">{plainLanguage(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </BriefSection>
      )}

      {offer?.hook && (
        <BriefSection icon={ListChecks} title="Offer">
          <div className="space-y-1.5 text-body-sm">
            <p className="text-ink-800 dark:text-ink-100">
              <span className="font-semibold">Hook:</span> {plainLanguage(offer.hook)}
            </p>
            {offer.call_to_action && (
              <p className="text-ink-700 dark:text-ink-200">
                <span className="font-semibold">CTA:</span>{" "}
                {plainLanguage(offer.call_to_action)}
              </p>
            )}
            {offer.destination && (
              <p className="text-label-xs font-mono text-ink-500 dark:text-ink-400">
                → {offer.destination}
              </p>
            )}
          </div>
        </BriefSection>
      )}

      {constraints && (constraints.must_include || constraints.must_avoid) && (
        <BriefSection icon={ListChecks} title="Must include / must avoid">
          <div className="grid sm:grid-cols-2 gap-4">
            {constraints.must_include && (
              <div>
                <div className="text-label-xs font-mono uppercase tracking-wider text-success-700 dark:text-success-400 mb-1.5">
                  Must include
                </div>
                <ul className="text-body-sm text-ink-700 dark:text-ink-200 space-y-1.5">
                  {constraints.must_include.map((c, i) => (
                    <li key={i} className="leading-snug list-disc list-inside">
                      {plainLanguage(c)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {constraints.must_avoid && (
              <div>
                <div className="text-label-xs font-mono uppercase tracking-wider text-warning-700 dark:text-warning-400 mb-1.5">
                  Must avoid
                </div>
                <ul className="text-body-sm text-ink-700 dark:text-ink-200 space-y-1.5">
                  {constraints.must_avoid.map((c, i) => (
                    <li key={i} className="leading-snug list-disc list-inside">
                      {plainLanguage(c)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </BriefSection>
      )}

      {launch.briefFiles.length > 0 && (
        <BriefSection icon={ListChecks} title="Creative briefs (decomposed)">
          <ul className="text-body-sm text-ink-700 dark:text-ink-200 space-y-1">
            {launch.briefFiles.map((f) => (
              <li key={f} className="font-mono text-label-sm text-ink-500 dark:text-ink-400">
                {f}
              </li>
            ))}
          </ul>
        </BriefSection>
      )}
    </div>
  );
}

function BriefSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink-100 dark:border-ink-800 pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <header className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-accent/10 text-accent flex-shrink-0">
          <Icon className="w-4 h-4" aria-hidden />
        </span>
        <h3 className="text-body-sm font-semibold tracking-tight text-ink-800 dark:text-ink-100">
          {title}
        </h3>
      </header>
      <div>{children}</div>
    </section>
  );
}
