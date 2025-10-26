"use client";

import { useMemo, useState } from "react";
import {
  BlueprintResponse,
  Complexity,
  Domain,
  FeatureKey,
  domainOptions,
  featureDefinitions,
} from "@/lib/blueprint";

const complexityOptions: Array<{ value: Complexity; label: string }> = [
  { value: "beginner", label: "Beginner (4 weeks)" },
  { value: "intermediate", label: "Intermediate (6 weeks)" },
  { value: "advanced", label: "Advanced (8+ weeks)" },
];

const defaultFeatureSelection: FeatureKey[] = ["authentication", "crud"];

export default function Home() {
  const [projectName, setProjectName] = useState("Campus Connect");
  const [domain, setDomain] = useState<Domain>("student-portal");
  const [complexity, setComplexity] = useState<Complexity>("beginner");
  const [features, setFeatures] = useState<FeatureKey[]>(
    defaultFeatureSelection
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<BlueprintResponse | null>(null);

  const domainDescription = useMemo(
    () => domainOptions.find((option) => option.value === domain)?.description,
    [domain]
  );

  const toggleFeature = (feature: FeatureKey) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, domain, features, complexity }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { errors?: string[] };
        throw new Error(payload.errors?.join(" ") || "Unknown error");
      }

      const payload = (await response.json()) as BlueprintResponse;
      setBlueprint(payload);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while creating your plan."
      );
      setBlueprint(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-900/40 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-300/80">
            Full Stack Java Blueprint
          </p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            Generate a complete Spring Boot + Next.js project roadmap in minutes
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Pick your domain, choose the features you care about, and we&apos;ll
            assemble a Java-first architecture, development milestones, and a
            sample REST controller to kick-start your college project.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-900/40 backdrop-blur"
          >
            <div>
              <label className="text-sm font-medium text-emerald-200">
                Project name
              </label>
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="e.g. Campus Connect"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-slate-100 shadow-inner shadow-black/40 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/40"
              />
            </div>

            <div className="grid gap-3">
              <span className="text-sm font-medium text-emerald-200">
                Domain focus
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                {domainOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDomain(option.value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      domain === option.value
                        ? "border-emerald-400/70 bg-emerald-400/10 shadow-lg shadow-emerald-500/20"
                        : "border-white/10 bg-slate-950/60 hover:border-emerald-300/30"
                    }`}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
              {domainDescription ? (
                <p className="text-sm text-slate-400">
                  Current focus: {domainDescription}
                </p>
              ) : null}
            </div>

            <div>
              <span className="text-sm font-medium text-emerald-200">
                Build features
              </span>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(Object.entries(featureDefinitions) as Array<
                  [FeatureKey, { label: string; description: string }]
                >).map(([key, definition]) => {
                  const selected = features.includes(key);
                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-4 transition ${
                        selected
                          ? "border-emerald-400/70 bg-emerald-400/10 shadow-lg shadow-emerald-500/20"
                          : "border-white/10 bg-slate-950/60 hover:border-emerald-300/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">
                          {definition.label}
                        </span>
                        <input
                          checked={selected}
                          onChange={() => toggleFeature(key)}
                          type="checkbox"
                          className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                      <p className="text-sm text-slate-300">
                        {definition.description}
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-emerald-200">
                Complexity target
              </span>
              <div className="mt-3 flex flex-wrap gap-3">
                {complexityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setComplexity(option.value)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      complexity === option.value
                        ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-300">
              <p className="font-semibold text-slate-100">
                What you&apos;ll receive
              </p>
              <ul className="flex list-disc flex-col gap-1 pl-5">
                <li>Spring Boot &amp; Next.js technology stack suggestions.</li>
                <li>Module breakdown tailored to your features.</li>
                <li>Weekly milestone plan for viva &amp; submissions.</li>
                <li>Sample Java REST controller to paste into your app.</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-8 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Project Blueprint"}
            </button>

            {error ? (
              <p className="text-sm text-red-300">
                {error || "Unable to create the blueprint right now."}
              </p>
            ) : null}
          </form>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl shadow-slate-900/40 backdrop-blur">
              <h2 className="text-lg font-semibold text-emerald-300">
                Why this tool?
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                College evaluators love seeing a clear roadmap. This generator
                makes sure you cover Java backend fundamentals while showcasing
                a modern UI with Next.js that you can deploy on Vercel for demos
                and viva.
              </p>
              <p className="mt-3 text-sm text-slate-300">
                Customize the plan with your own ideas later—once generated,
                every section is easy to tweak.
              </p>
            </div>
            {blueprint ? (
              <div className="rounded-3xl border border-emerald-400/60 bg-emerald-400/10 p-7 shadow-xl shadow-emerald-500/40 backdrop-blur">
                <h2 className="text-lg font-semibold text-emerald-200">
                  Quick Summary
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-100">
                  {blueprint.summary}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-7 text-sm text-slate-400 backdrop-blur">
                Fill the form to generate your customized plan. You can export
                or copy the result as soon as it appears.
              </div>
            )}
          </aside>
        </section>

        {blueprint ? (
          <section className="flex flex-col gap-10">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-900/40 backdrop-blur">
              <h2 className="text-2xl font-semibold text-emerald-300">
                Suggested Tech Stack
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <StackColumn
                  title="Backend"
                  items={blueprint.stack.backend}
                />
                <StackColumn
                  title="Frontend"
                  items={blueprint.stack.frontend}
                />
                <StackColumn
                  title="Database"
                  items={blueprint.stack.database}
                />
                <StackColumn
                  title="Tooling"
                  items={blueprint.stack.tooling}
                />
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-900/40 backdrop-blur">
              <h2 className="text-2xl font-semibold text-emerald-300">
                Recommended Modules
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {blueprint.recommendedModules.map((module) => (
                  <div
                    key={module.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner shadow-black/40"
                  >
                    <h3 className="text-lg font-semibold text-slate-100">
                      {module.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-900/40 backdrop-blur">
              <h2 className="text-2xl font-semibold text-emerald-300">
                Implementation Timeline
              </h2>
              <div className="mt-6 space-y-5">
                {blueprint.milestonePlan.map((milestone) => (
                  <div
                    key={milestone.label}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner shadow-black/40"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <h3 className="text-lg font-semibold text-slate-100">
                        {milestone.label}
                      </h3>
                      <p className="text-sm text-emerald-200">
                        {milestone.focus}
                      </p>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                      {milestone.tasks.map((task) => (
                        <li key={task} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-900/40 backdrop-blur">
              <h2 className="text-2xl font-semibold text-emerald-300">
                Sample Spring Boot Controller
              </h2>
              <p className="mt-4 text-sm text-slate-300">
                {blueprint.javaSnippet.description}
              </p>
              <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs leading-relaxed text-emerald-100 shadow-inner shadow-black/60">
                <code>{blueprint.javaSnippet.code}</code>
              </pre>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-900/40 backdrop-blur">
              <h2 className="text-2xl font-semibold text-emerald-300">
                Suggested Next Steps
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {blueprint.suggestedNextSteps.map((step) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-emerald-400" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function StackColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner shadow-black/40">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
