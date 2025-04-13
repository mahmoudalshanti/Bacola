import Link from "next/link";

function Logo({ wieght, horizontal }: { wieght: string; horizontal: string }) {
  return (
    <Link href={"/"}>
      <div
        className={`h-20 flex items-center justify-${horizontal}  gap-2   cursor-pointer`}
      >
        <img
          src="/bacola-logo.webp"
          alt="bacola Logo"
          className="h-12 w-auto hover:scale-105 transition-transform"
        />
      </div>
    </Link>
  );
}

export default Logo;
