"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  Upload,
  Cpu,
  Braces,
  Calculator,
  Scale,
  Users,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/i18n/provider";

const GITHUB_URL = "https://github.com/Andrii-888/avtomatic-ai";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

type Status = "ready" | "coming" | "roadmap";

const STATUS: Record<
  Status,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
    badgeKey: string;
    badgeClass: string;
    href?: string;
  }
> = {
  ready: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    badgeKey: "badge.live",
    badgeClass: "bg-green-100 text-green-700",
    href: "/demo",
  },
  coming: {
    icon: Clock,
    iconClass: "text-amber-500",
    badgeKey: "badge.inDevelopment",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  roadmap: {
    icon: Circle,
    iconClass: "text-muted-foreground",
    badgeKey: "badge.roadmap",
    badgeClass: "bg-muted text-muted-foreground",
  },
};

const features: { status: Status; key: string }[] = [
  { status: "ready", key: "features.pdf" },
  { status: "ready", key: "features.classify" },
  { status: "ready", key: "features.extract" },
  { status: "ready", key: "features.privacy" },
  { status: "ready", key: "features.summary" },
  { status: "ready", key: "features.status" },
  { status: "ready", key: "features.chat" },
  { status: "coming", key: "features.search" },
  { status: "coming", key: "features.cloud" },
  { status: "coming", key: "features.export" },
  { status: "roadmap", key: "features.ocr" },
  { status: "roadmap", key: "features.erp" },
];

const steps = [
  { icon: Upload, key: "steps.upload" },
  { icon: Cpu, key: "steps.analyze" },
  { icon: Braces, key: "steps.structured" },
];

const audience = [
  { icon: Calculator, key: "audience.fiduciaries" },
  { icon: Scale, key: "audience.law" },
  { icon: Users, key: "audience.hr" },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* NAV */}
      <nav className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur sm:px-10">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            {t("common.openDemo")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto w-full max-w-3xl px-6 py-20 text-center sm:py-28">
        <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-6xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {t("hero.subtitle")}
        </p>
        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {t("common.tryDemo")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="inline-flex items-center justify-center rounded-full border px-7 py-3.5 text-sm font-semibold transition hover:border-primary"
          >
            {t("common.howItWorks")}
          </a>
        </div>
      </section>

      {/* WHAT WE SOLVE */}
      <section id="features" className="border-t scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {t("solve.title")}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {t("solve.subtitle")}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.key}
                status={feature.status}
                featureKey={feature.key}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t bg-card/40 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
          <h2 className="text-center font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {t("section.howItWorks")}
          </h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, i) => (
              <div key={step.key} className="flex flex-col items-start">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold">
                    {i + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {t(`${step.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${step.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
          <h2 className="text-center font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {t("section.whoIsItFor")}
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {audience.map((item) => (
              <div
                key={item.key}
                className="rounded-xl border p-6 transition hover:border-primary"
              >
                <item.icon className="h-6 w-6 text-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  {t(`${item.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${item.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY FIRST */}
      <section id="privacy" className="bg-foreground text-background scroll-mt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/10">
            <ShieldCheck className="h-7 w-7 text-green-400" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            {t("privacy.title")}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-background/70 sm:text-lg">
            {t("privacy.body")}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t bg-card/30">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          {/* CTA band */}
          <div className="py-14">
            <div className="flex flex-col gap-6 rounded-2xl border bg-card p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                  {t("footer.cta.title")}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t("footer.cta.subtitle")}
                </p>
              </div>
              <Link
                href="/demo"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {t("common.openDemo")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 border-t pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t("footer.brandDesc")}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                {t("footer.localAi")}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold">{t("footer.product")}</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="transition hover:text-foreground">
                    {t("footer.features")}
                  </a>
                </li>
                <li>
                  <a href="#how" className="transition hover:text-foreground">
                    {t("common.howItWorks")}
                  </a>
                </li>
                <li>
                  <Link href="/demo" className="transition hover:text-foreground">
                    {t("footer.liveDemo")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold">{t("footer.resources")}</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#privacy" className="transition hover:text-foreground">
                    {t("footer.privacy")}
                  </a>
                </li>
                <li>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition hover:text-foreground"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t py-8 text-sm text-muted-foreground sm:flex-row">
            <span>Avtomatic.AI © 2026</span>
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                {t("footer.builtForSmes")}
              </span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  status,
  featureKey,
}: {
  status: Status;
  featureKey: string;
}) {
  const { t } = useI18n();
  const s = STATUS[status];
  const Icon = s.icon;

  const card = (
    <div className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary">
      <div className="mb-4 flex items-center justify-between">
        <Icon className={`h-5 w-5 ${s.iconClass}`} />
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badgeClass}`}
        >
          {t(s.badgeKey)}
        </span>
      </div>
      <h3 className="text-base font-semibold">{t(`${featureKey}.title`)}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t(`${featureKey}.desc`)}
      </p>
      {s.href && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground opacity-0 transition group-hover:opacity-100">
          {t("card.tryIt")}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );

  return s.href ? (
    <Link href={s.href} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}
