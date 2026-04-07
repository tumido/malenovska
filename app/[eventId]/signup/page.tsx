"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { doc, query, where, writeBatch } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Article } from "@/components/Article";
import { Loading } from "@/components/Loading";
import { Markdown } from "@/components/Markdown";
import { SmallArticleCard } from "@/components/SmallArticleCard";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import { ColorBadge } from "@/components/ColorBadge";
import { participantsForRace, getRaceById } from "@/lib/filters";
import { validate } from "@/lib/validators";
import { CheckCircle, XCircle } from "lucide-react";
import type { Participant, Race } from "@/lib/types";

interface FormData {
  race: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  age: string;
  group: string;
  note: string;
  terms: boolean;
  [key: string]: string | boolean;
}

type SubmitResult = { message: string; variant: "success" | "error" } | null;

const SignupPage = () => {
  const event = useEvent();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    race: "", firstName: "", lastName: "", nickName: "", email: "", age: "", group: "", note: "", terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmitResult>(null);

  const [participants, pLoading] = useCollectionData(
    query(typedCollection<Participant>("participants"), where("event", "==", event.id))
  );
  const [races, rLoading] = useCollectionData(
    query(typedCollection<Race>("races"), where("event", "==", event.id))
  );

  const isLoading = pLoading || rLoading || !participants || !races;
  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";

  const selectedRace = races?.find((r) => r.id === formData.race);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      const err = validate(["required"])(formData.race);
      if (err) newErrors.race = err;
    }
    if (step === 2) {
      const req = validate(["required"]);
      const emailVal = validate(["required", "email"]);
      const ageVal = validate(["required", ["greater", [10]]]);
      if (req(formData.firstName)) newErrors.firstName = req(formData.firstName)!;
      if (req(formData.lastName)) newErrors.lastName = req(formData.lastName)!;
      if (emailVal(formData.email)) newErrors.email = emailVal(formData.email)!;
      if (ageVal(formData.age)) newErrors.age = ageVal(formData.age)!;
      if (!formData.terms) newErrors.terms = "Souhlas je nutný";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 2));
  };

  const handleSubmit = async () => {
    if (!validateStep() || !races || !participants) return;
    setSubmitted(true);
    const race = getRaceById(races, formData.race);
    if (race && participantsForRace(participants, race) >= race.limit) {
      setResult({ message: "Někdo tě předběhl, limit pro stranu dosažen.", variant: "error" });
      return;
    }
    const pk = `${event.id}:${formData.firstName}-${formData.nickName || ""}-${formData.lastName}`;
    const batch = writeBatch(db);
    batch.set(doc(db, "participants", pk), {
      event: event.id, race: formData.race, firstName: formData.firstName, lastName: formData.lastName,
      nickName: formData.nickName, group: formData.group, note: formData.note, createdate: new Date(),
    });
    batch.set(doc(db, "participants", pk, "private", "_"), {
      age: parseInt(formData.age, 10), email: formData.email,
    });
    try {
      await batch.commit();
      setResult({ message: "Registrace proběhla úspěšně", variant: "success" });
    } catch (e: unknown) {
      const code = (e as { code?: string }).code;
      setResult({
        message: code === "permission-denied" ? "Tento účastník je již registrován" : "Něco se nepovedlo, kontaktujte nás prosím",
        variant: "error",
      });
    }
  };

  const handleReset = () => {
    setSubmitted(false); setResult(null); setStep(0);
    setFormData({ race: "", firstName: "", lastName: "", nickName: "", email: "", age: "", group: "", note: "", terms: false });
  };

  const updateField = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }, []);

  if (!event.registrationAvailable && !isDev) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-grey-400 text-lg">Registrace není dostupná.</p></div>;
  }

  if (submitted) {
    return (
      <>
        <Banner title="Registrace" />
        <div className="flex flex-col items-center gap-6 py-12">
          {!result ? <Loading /> : result.variant === "success" ? <CheckCircle size={100} className="text-green-500" /> : <XCircle size={100} className="text-red-500" />}
          {result && (
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={handleReset} className="rounded bg-primary px-6 py-3 text-white shadow hover:bg-white/10">Nová registrace</button>
              <Link href={`/${event.id}/attendees`} className="rounded bg-primary px-6 py-3 text-white shadow hover:bg-white/10">Zobrazit přihlášené účastníky</Link>
              {parseInt(formData.age, 10) < 18 && event.declaration && (
                <a href={event.declaration.src} target="_blank" rel="external" className="rounded bg-secondary px-6 py-3 text-white shadow hover:bg-secondary-dark">Potvrzení pro nezletilé</a>
              )}
            </div>
          )}
          {result?.variant === "error" && <div className="mx-auto max-w-md rounded border border-red-500/30 bg-red-500/10 p-4 text-red-300">Registrace nebyla provedena: {result.message}</div>}
          {parseInt(formData.age, 10) < 18 && <div className="mx-auto max-w-md rounded border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300">Ještě ti nebylo 18 let. Nezapomeň si stáhnout, vyplnit a hlavně přinést podepsané potvrzení pro nezletilé.</div>}
        </div>
      </>
    );
  }

  const stepNames = ["Výběr strany", "Legenda", "Osobní údaje"];

  return (
    <>
      <Banner title="Registrace" />
      <Article>
        <div className="hidden sm:flex items-center justify-center gap-2 bg-transparent p-5">
          {stepNames.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-secondary text-white" : "bg-white/10 text-grey-400"}`}>{i + 1}</span>
              <span className={i <= step ? "text-white" : "text-grey-400"}>{name}</span>
              {i < stepNames.length - 1 && <span className="mx-2 h-px w-8 bg-white/20" />}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="p-6"><div className="h-[300px] animate-pulse rounded bg-grey-500/20" /></div>
        ) : (
          <>
            {step === 0 && (
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold">Vyber si stranu</h2>
                {event.registrationBeforeAbove ? <Markdown content={event.registrationBeforeAbove} /> : <p className="mb-6">Jen za jednu stranu opravdu stojí bojovat. Zvol moudře.</p>}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {races!.map((race) => {
                    const count = participantsForRace(participants!, race);
                    return (
                      <SmallArticleCard key={race.id} title={<span className="flex items-center justify-between"><span className="truncate">{race.name}</span><span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs">{count} / {race.limit}</span></span>} image={race.image} selected={formData.race === race.id} disabled={count >= race.limit} onClick={() => updateField("race", race.id)} />
                    );
                  })}
                </div>
                {errors.race && <p className="mt-2 text-sm text-red-400">{errors.race}</p>}
                {event.registrationBeforeBelow && <div className="mt-4"><Markdown content={event.registrationBeforeBelow} /></div>}
              </div>
            )}
            {step === 1 && selectedRace && (
              <>
                <ArticleCardHeader image={selectedRace.image?.src} title={<span className="flex items-center gap-2">{selectedRace.name}<span className="rounded-full bg-primary px-2 py-0.5 text-sm">{participantsForRace(participants!, selectedRace)} / {selectedRace.limit}</span></span>} />
                <div className="p-6"><div className="mx-auto max-w-3xl my-4"><Markdown content={selectedRace.legend} /></div></div>
              </>
            )}
            {step === 2 && selectedRace && (
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">Charakteristika strany</h3>
                <Markdown content={selectedRace.requirements} />
                <p className="mb-2">Kostým pro každou stranu je laděn do jiných barevných odstínů pro snadnější orientaci v boji.</p>
                <p className="mb-4">Barva této strany je: <ColorBadge color={selectedRace.color} colorName={selectedRace.colorName} /></p>
                <hr className="my-6 border-white/10" />
                <h3 className="mb-4 text-xl font-bold">Osobní údaje</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input label="Přezdívka" value={formData.nickName} onChange={(v) => updateField("nickName", v)} placeholder="Mirek" />
                  <Input label="Jméno *" value={formData.firstName} onChange={(v) => updateField("firstName", v)} error={errors.firstName} placeholder="Mirek" />
                  <Input label="Příjmení *" value={formData.lastName} onChange={(v) => updateField("lastName", v)} error={errors.lastName} placeholder="Dušín" />
                </div>
                <div className="mt-4"><Input label="E-mail *" value={formData.email} onChange={(v) => updateField("email", v)} error={errors.email} placeholder="mirek@rychlesipy.cz" /></div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-5"><Input label="Skupina" value={formData.group} onChange={(v) => updateField("group", v)} placeholder="Rychlé Šípy" /></div>
                  <Input label="Věk *" value={formData.age} onChange={(v) => updateField("age", v)} error={errors.age} type="number" />
                </div>
                <div className="mt-4"><Input label="Strana" value={selectedRace.name} readOnly /></div>
                <hr className="my-6 border-white/10" />
                {event.registrationExtras?.map((extra, i) => {
                  if (extra.type === "markdown") return <div key={i} className="mb-4"><Markdown content={extra.content} /></div>;
                  if (extra.type === "text" && extra.props) return <div key={i} className="mb-4"><Input label={extra.props.label ?? ""} value={String(formData[extra.props.id ?? ""] ?? "")} onChange={(v) => updateField(extra.props!.id ?? "", v)} /></div>;
                  return null;
                })}
                <hr className="my-6 border-white/10" />
                <div className="mt-4"><Input label="Poznámka" value={formData.note} onChange={(v) => updateField("note", v)} placeholder="A můžeme s sebou vzít i Bublinu?" multiline /></div>
                <p className="mt-4 text-sm text-grey-400">Pro přijetí výše uvedených údajů je třeba tvůj souhlas. Slibujeme, že s&nbsp;tvými údaji budeme nakládat pouze pro potřeby konání akce.</p>
                <label className="mt-4 flex items-center justify-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.terms as boolean} onChange={(e) => updateField("terms", e.target.checked)} className="h-5 w-5 accent-secondary" />
                  <span>Souhlasím</span>
                </label>
                {errors.terms && <p className="mt-1 text-center text-sm text-red-400">{errors.terms}</p>}
              </div>
            )}
          </>
        )}
        <div className="flex justify-center gap-4 p-5">
          <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="rounded px-6 py-2 text-white disabled:opacity-30 hover:bg-white/10">Zpět</button>
          {step < 2 ? (
            <button onClick={handleNext} className="rounded bg-secondary px-6 py-2 text-white hover:bg-secondary-dark">Další</button>
          ) : (
            <button onClick={handleSubmit} className="rounded bg-secondary px-6 py-2 text-white hover:bg-secondary-dark">Odeslat</button>
          )}
        </div>
      </Article>
    </>
  );
};

export default SignupPage;

const Input = ({ label, value, onChange, error, placeholder, type = "text", readOnly, multiline }: {
  label: string; value: string; onChange?: (v: string) => void; error?: string; placeholder?: string; type?: string; readOnly?: boolean; multiline?: boolean;
}) => {
  const cls = `w-full rounded border-2 bg-transparent p-3 text-white placeholder-grey-500 outline-none transition-colors ${error ? "border-red-400" : "border-transparent focus:border-secondary"} ${readOnly ? "opacity-60" : ""}`;
  return (
    <div>
      <label className="mb-1 block text-sm text-grey-400">{label}</label>
      {multiline ? <textarea value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className={cls} rows={3} /> : <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} readOnly={readOnly} className={cls} />}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
