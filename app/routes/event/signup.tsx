import { useState, useCallback } from "react";
import { Link } from "react-router";
import { doc, query, where, writeBatch, type DocumentReference } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Loading } from "@/components/Loading";
import { Markdown } from "@/components/Markdown";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import { ColorBadge } from "@/components/ColorBadge";
import { participantsForRace, getRaceById } from "@/lib/filters";
import { validate } from "@/lib/validators";
import { CheckCircle, XCircle, Check, ChevronRight, Users } from "lucide-react";
import type { Config, Participant, Race } from "@/lib/types";

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
    race: "",
    firstName: "",
    lastName: "",
    nickName: "",
    email: "",
    age: "",
    group: "",
    note: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmitResult>(null);

  const [participants, pLoading] = useCollectionData(
    query(
      typedCollection<Participant>("participants"),
      where("event", "==", event.id),
    ),
  );
  const [races, rLoading] = useCollectionData(
    query(typedCollection<Race>("races"), where("event", "==", event.id)),
  );

  const isLoading = pLoading || rLoading || !participants || !races;
  const isDev = import.meta.env.VITE_DEV_MODE === "true";

  const selectedRace = races?.find((r) => r.id === formData.race);

  const [config] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>,
  );
  const knownGroups = config?.knownGroups ?? [];

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
      if (req(formData.firstName))
        newErrors.firstName = req(formData.firstName)!;
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
      setResult({
        message: "Někdo tě předběhl, limit pro stranu dosažen.",
        variant: "error",
      });
      return;
    }
    const pk = `${event.id}:${formData.firstName}-${formData.nickName || ""}-${formData.lastName}`;
    const batch = writeBatch(db);
    batch.set(doc(db, "participants", pk), {
      event: event.id,
      race: formData.race,
      firstName: formData.firstName,
      lastName: formData.lastName,
      nickName: formData.nickName,
      group: formData.group,
      note: formData.note,
      createdate: new Date(),
    });
    batch.set(doc(db, "participants", pk, "private", "_"), {
      age: parseInt(formData.age, 10),
      email: formData.email,
    });
    try {
      await batch.commit();
      setResult({ message: "Registrace proběhla úspěšně", variant: "success" });
    } catch (e: unknown) {
      const code = (e as { code?: string }).code;
      setResult({
        message:
          code === "permission-denied"
            ? "Tento účastník je již registrován"
            : "Něco se nepovedlo, kontaktujte nás prosím",
        variant: "error",
      });
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setResult(null);
    setStep(0);
    setFormData({
      race: "",
      firstName: "",
      lastName: "",
      nickName: "",
      email: "",
      age: "",
      group: "",
      note: "",
      terms: false,
    });
  };

  const updateField = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  }, []);

  if (!event.registrationAvailable && !isDev) {
    return (
      <>
        <PageHero title="Registrace" compact />
        <section className="-mx-4 min-h-[50vh] bg-primary-light text-primary">
          <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-20">
            <p className="text-lg text-primary/40">Registrace není dostupná.</p>
          </div>
        </section>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <PageHero title="Registrace" compact />
        <section className="-mx-4 min-h-screen bg-primary-light text-primary">
          <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
            <div className="flex flex-col items-center gap-8 py-12">
              {!result ? (
                <Loading />
              ) : result.variant === "success" ? (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle size={64} className="text-green-500" />
                  </div>
                  <div className="text-center">
                    <h2 className="mb-2 font-display text-2xl font-bold">
                      {result.message}
                    </h2>
                    <p className="text-primary/50">
                      Těšíme se na tebe na akci!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
                    <XCircle size={64} className="text-red-500" />
                  </div>
                  <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
                    Registrace nebyla provedena: {result.message}
                  </div>
                </>
              )}

              {result && (
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="cursor-pointer rounded-lg border border-primary/10 px-6 py-3 text-sm transition-colors hover:bg-primary/5"
                  >
                    Nová registrace
                  </button>
                  <Link
                    to={`/${event.id}/attendees`}
                    className="flex items-center gap-2 rounded-lg border border-primary/10 px-6 py-3 text-sm transition-colors hover:bg-primary/5"
                  >
                    <Users size={16} />
                    Zobrazit přihlášené účastníky
                  </Link>
                  {parseInt(formData.age, 10) < 18 && event.declaration && (
                    <a
                      href={event.declaration.src}
                      target="_blank"
                      rel="external"
                      className="rounded-lg bg-secondary px-6 py-3 text-sm text-white transition-colors hover:bg-secondary-dark"
                    >
                      Potvrzení pro nezletilé
                    </a>
                  )}
                </div>
              )}

              {result?.variant === "success" &&
                parseInt(formData.age, 10) < 18 && (
                  <div className="mx-auto max-w-md rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-center text-yellow-800">
                    Ještě ti nebylo 18 let. Nezapomeň si stáhnout, vyplnit a
                    hlavně přinést podepsané potvrzení pro nezletilé.
                  </div>
                )}
            </div>
          </div>
        </section>
      </>
    );
  }

  const stepNames = ["Výběr strany", "Legenda", "Osobní údaje"];

  return (
    <>
      <PageHero title="Registrace" compact />

      <section className="-mx-4 min-h-screen bg-primary-light text-primary">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
          {/* Step indicator */}
          <div className="mb-10 flex items-center justify-center">
            {stepNames.map((name, i) => (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => {
                    if (i < step) setStep(i);
                  }}
                  disabled={i > step}
                  className={`flex items-center gap-2 ${i < step ? "cursor-pointer" : ""}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      i < step
                        ? "bg-secondary text-white"
                        : i === step
                          ? "bg-secondary/10 text-secondary ring-2 ring-secondary"
                          : "bg-primary/5 text-primary/30"
                    }`}
                  >
                    {i < step ? <Check size={16} /> : i + 1}
                  </span>
                  <span
                    className={`hidden text-sm font-medium sm:block ${
                      i <= step ? "text-primary" : "text-primary/30"
                    }`}
                  >
                    {name}
                  </span>
                </button>
                {i < stepNames.length - 1 && (
                  <ChevronRight
                    size={16}
                    className="mx-3 shrink-0 text-primary/20 sm:mx-4"
                  />
                )}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="py-20">
              <Loading />
            </div>
          ) : (
            <>
              {/* Step 1: Race selection */}
              {step === 0 && (
                <div>
                  <div className="mx-auto mb-8 max-w-3xl text-center">
                    <h2 className="mb-3 font-display text-2xl font-bold">
                      Vyber si stranu
                    </h2>
                    {event.registrationBeforeAbove ? (
                      <Markdown content={event.registrationBeforeAbove} />
                    ) : (
                      <p className="text-primary/50">
                        Jen za jednu stranu opravdu stojí bojovat. Zvol moudře.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {races!.map((race) => {
                      const count = participantsForRace(participants!, race);
                      const isFull = count >= race.limit;
                      const isSelected = formData.race === race.id;

                      return (
                        <button
                          key={race.id}
                          onClick={() => updateField("race", race.id)}
                          disabled={isFull}
                          className={`group cursor-pointer overflow-hidden rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? "border-secondary shadow-md"
                              : isFull
                                ? "cursor-not-allowed border-primary/5 opacity-50"
                                : "border-primary/10 hover:border-primary/20 hover:shadow-md"
                          }`}
                        >
                          <ArticleCardHeader
                            height={280}
                            titleVariant="small"
                            image={race.image?.src}
                            title={
                              <span className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <span
                                    className="block h-3 w-3 shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: race.color }}
                                  />
                                  <span className="truncate">{race.name}</span>
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    isFull
                                      ? "bg-red-500/80 text-white"
                                      : "bg-black/40 text-white"
                                  }`}
                                >
                                  {count} / {race.limit}
                                </span>
                              </span>
                            }
                          />
                        </button>
                      );
                    })}
                  </div>

                  {errors.race && (
                    <p className="mt-3 text-center text-sm text-red-500">
                      {errors.race}
                    </p>
                  )}

                  {event.registrationBeforeBelow && (
                    <div className="mx-auto mt-8 max-w-3xl">
                      <Markdown content={event.registrationBeforeBelow} />
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Legend */}
              {step === 1 && selectedRace && (
                <div>
                  {/* Race header bar */}
                  <div className="mb-6 flex items-center gap-3">
                    <span
                      className="block h-4 w-4 shrink-0 rounded-full shadow-sm"
                      style={{ backgroundColor: selectedRace.color }}
                    />
                    <h2 className="font-display text-2xl font-bold">
                      {selectedRace.name}
                    </h2>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary/50">
                      {participantsForRace(participants!, selectedRace)} /{" "}
                      {selectedRace.limit}
                    </span>
                  </div>

                  {/* Race image */}
                  {selectedRace.image?.src && (
                    <div className="mb-8 overflow-hidden rounded-lg">
                      <ArticleCardHeader
                        height={350}
                        image={selectedRace.image.src}
                      />
                    </div>
                  )}

                  {/* Legend text */}
                  <div className="mx-auto max-w-3xl">
                    <Markdown content={selectedRace.legend} />
                  </div>
                </div>
              )}

              {/* Step 3: Personal data */}
              {step === 2 && selectedRace && (
                <div>
                  {/* Race characteristics callout */}
                  <div className="mb-8 rounded-lg border border-primary/10 bg-white p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="block h-4 w-4 shrink-0 rounded-full shadow-sm"
                        style={{ backgroundColor: selectedRace.color }}
                      />
                      <h3 className="font-display text-lg font-bold">
                        {selectedRace.name}
                      </h3>
                      <ColorBadge
                        color={selectedRace.color}
                        colorName={selectedRace.colorName}
                      />
                    </div>
                    <div className="text-sm text-primary/70">
                      <Markdown content={selectedRace.requirements} />
                      <p className="mt-2">
                        Kostým pro každou stranu je laděn do jiných barevných
                        odstínů pro snadnější orientaci v boji.
                      </p>
                    </div>
                  </div>

                  {/* Personal data form */}
                  <h3 className="mb-6 font-display text-xl font-bold">
                    Osobní údaje
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Input
                      label="Přezdívka"
                      value={formData.nickName}
                      onChange={(v) => updateField("nickName", v)}
                      placeholder="Mirek"
                    />
                    <Input
                      label="Jméno *"
                      value={formData.firstName}
                      onChange={(v) => updateField("firstName", v)}
                      error={errors.firstName}
                      placeholder="Mirek"
                    />
                    <Input
                      label="Příjmení *"
                      value={formData.lastName}
                      onChange={(v) => updateField("lastName", v)}
                      error={errors.lastName}
                      placeholder="Dušín"
                    />
                  </div>
                  <div className="mt-4">
                    <Input
                      label="E-mail *"
                      value={formData.email}
                      onChange={(v) => updateField("email", v)}
                      error={errors.email}
                      placeholder="mirek@rychlesipy.cz"
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <div className="sm:col-span-5">
                      <Input
                        label="Skupina"
                        value={formData.group}
                        onChange={(v) => updateField("group", v)}
                        placeholder="Rychlé Šípy"
                        suggestions={knownGroups}
                      />
                    </div>
                    <Input
                      label="Věk *"
                      value={formData.age}
                      onChange={(v) => updateField("age", v)}
                      error={errors.age}
                      type="number"
                    />
                  </div>

                  {/* Registration extras */}
                  {event.registrationExtras &&
                    event.registrationExtras.length > 0 && (
                      <div className="mt-8 border-t border-primary/10 pt-8">
                        {event.registrationExtras.map((extra, i) => {
                          if (extra.type === "markdown")
                            return (
                              <div key={i} className="mb-4">
                                <Markdown content={extra.content} />
                              </div>
                            );
                          if (extra.type === "text" && extra.props)
                            return (
                              <div key={i} className="mb-4">
                                <Input
                                  label={extra.props.label ?? ""}
                                  value={String(
                                    formData[extra.props.id ?? ""] ?? "",
                                  )}
                                  onChange={(v) =>
                                    updateField(extra.props!.id ?? "", v)
                                  }
                                />
                              </div>
                            );
                          return null;
                        })}
                      </div>
                    )}

                  {/* Note */}
                  <div className="mt-8 border-t border-primary/10 pt-8">
                    <Input
                      label="Poznámka"
                      value={formData.note}
                      onChange={(v) => updateField("note", v)}
                      placeholder="A můžeme s sebou vzít i Bublinu?"
                      multiline
                    />
                  </div>

                  {/* Terms */}
                  <div className="mt-8 border-t border-primary/10 pt-8">
                    <p className="mb-4 text-sm text-primary/50">
                      Pro přijetí výše uvedených údajů je třeba tvůj souhlas.
                      Slibujeme, že s&nbsp;tvými údaji budeme nakládat pouze pro
                      potřeby konání akce.
                    </p>
                    <label className="flex cursor-pointer items-center justify-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.terms as boolean}
                        onChange={(e) => updateField("terms", e.target.checked)}
                        className="h-5 w-5 accent-secondary"
                      />
                      <span className="font-medium">Souhlasím</span>
                    </label>
                    {errors.terms && (
                      <p className="mt-2 text-center text-sm text-red-500">
                        {errors.terms}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          {!isLoading && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                className="cursor-pointer rounded-lg border border-primary/10 px-6 py-2.5 text-sm transition-colors hover:bg-primary/5 disabled:cursor-default disabled:opacity-30"
              >
                Zpět
              </button>
              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="cursor-pointer rounded-lg bg-secondary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary-dark"
                >
                  Další
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="cursor-pointer rounded-lg bg-secondary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary-dark"
                >
                  Odeslat
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SignupPage;

const Input = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  readOnly,
  multiline,
  suggestions,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  multiline?: boolean;
  suggestions?: string[];
}) => {
  const [focused, setFocused] = useState(false);
  const cls = `w-full rounded-lg border bg-white px-4 py-3 text-sm text-primary placeholder-primary/30 outline-none transition-colors ${error ? "border-red-400" : "border-primary/20 focus:border-secondary"} ${readOnly ? "opacity-60" : ""}`;

  const filtered = suggestions?.filter(
    (s) =>
      s.toLowerCase().includes(value.toLowerCase()) &&
      s.toLowerCase() !== value.toLowerCase(),
  );
  const showSuggestions =
    focused && value.length > 0 && filtered && filtered.length > 0;

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-primary/60">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={cls}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cls}
        />
      )}
      {showSuggestions && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-primary/10 bg-white shadow-lg">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-primary hover:bg-primary/5"
                onMouseDown={() => onChange?.(s)}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};
