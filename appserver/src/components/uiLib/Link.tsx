import NextLink from "next/link";
import React, { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const linkCVA = cva("link", {
  variants: {
    intent: {
      primary: [
        "underline",
        "text",
        "text-blue-600",
        "hover:text-blue-800",
        "visited:text-purple-600",
      ],
    },
    size: {
      small: ["text-sm"],
      medium: ["text-base"],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

interface LinkProps extends VariantProps<typeof linkCVA> {
  href: string;
  children: ReactNode;
  className?: string;
}

const Link: React.FC<LinkProps> = ({
  href,
  intent,
  size,
  className,
  children,
}) => {
  return (
    <NextLink className={linkCVA({ intent, size, className })} href={href}>
      {children}
    </NextLink>
  );
};

export default Link;
