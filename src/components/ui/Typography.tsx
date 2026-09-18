import { cn } from "@/lib/utils";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "p";
};

export function EditorialHeading({
  children,
  className,
  as: Tag = "h2",
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        "font-editorial font-medium tracking-[-0.02em] text-balance text-charcoal",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement>;

export function Eyebrow({ children, className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-ui text-[0.72rem] uppercase tracking-[0.22em] text-burgundy-pale",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
