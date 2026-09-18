import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "glass" | "dark";
};

export function Button({
  className,
  variant = "solid",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-[1.15rem] px-5 py-3 text-sm tracking-wide disabled:cursor-not-allowed disabled:opacity-50",
        variant === "solid" &&
          "btn-glow bg-burgundy text-ivory hover:bg-burgundy-deep",
        variant === "ghost" &&
          "btn-ghost-glow border border-charcoal/15 bg-transparent text-charcoal hover:border-burgundy/40 hover:text-burgundy",
        variant === "glass" &&
          "btn-glow glass text-white hover:bg-white/20",
        variant === "dark" &&
          "btn-glow border border-white/12 bg-[rgba(90,40,48,0.55)] text-ivory hover:bg-[rgba(110,50,58,0.7)]",
        className,
      )}
      {...props}
    />
  );
}
