import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LiquidGlassVariant = "primary" | "ghost" | "nav" | "icon";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: LiquidGlassVariant;
  isActive?: boolean;
};

type AnchorProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LiquidGlassButtonProps = AnchorProps | NativeButtonProps;

export function LiquidGlassButton({
  children,
  className,
  variant = "ghost",
  isActive = false,
  ...props
}: LiquidGlassButtonProps) {
  const content = (
    <>
      <span className="liquid-glass-button__skin" aria-hidden="true" />
      <span className="liquid-glass-button__filter" aria-hidden="true" />
      <span className="liquid-glass-button__shine" aria-hidden="true" />
      <span className="liquid-glass-button__content">{children}</span>
    </>
  );

  const classes = cn(
    "liquid-glass-button",
    `liquid-glass-button--${variant}`,
    isActive && "is-active",
    className
  );

  if ("href" in props && props.href) {
    const anchorProps = props as Omit<AnchorProps, keyof SharedProps>;

    return (
      <a className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = props as Omit<NativeButtonProps, keyof SharedProps>;

  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
