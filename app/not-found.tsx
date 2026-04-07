import Link from "next/link";
import { Logo } from "@/components/Logo";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center text-white">
      <h1 className="font-display text-8xl font-bold">
        Nenalezen
        <Logo size="5rem" bgColor="#fff" fgColor="#000" />
      </h1>
      <p className="text-lg text-grey-400">
        Tato stránka byla náhodou sežrána organizátory, či spálena gobliny.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-secondary px-6 py-3 text-white transition-colors hover:bg-secondary-dark"
      >
        Chci na hlavní stránku
      </Link>
    </div>
  );
};

export default NotFound;
