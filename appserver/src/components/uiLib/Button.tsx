import { ReactNode, FC, MouseEventHandler } from "react";
// import classNames from "classnames";

import { cva, type VariantProps } from "class-variance-authority";

const buttonCVA = cva(
  "button p-4 py-2 px-4 rounded text-white disabled:bg-slate-300",
  {
    variants: {
      intent: {
        primary: ["bg-primary", "hover:bg-primary-hover"],
        secondary: ["bg-secondary", "hover:bg-secondary-hover"],
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
  }
);

interface ButtonProps extends VariantProps<typeof buttonCVA> {
  children: ReactNode;
  className?: string;
  type?: "submit" | undefined;
  onClick?: React.MouseEventHandler;
  loading?: boolean; // XXX_PORTING
  "data-testid"?: string; // XXX_PORTING
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  onClick,
  children,
  intent,
  size,
  className,
  disabled,
  ...props
}) => {
  const bType = props.type || "button";
  const ourOnClick : MouseEventHandler = (e) => {
    if (onClick) onClick(e);
  };
  return (
    <button
      type={bType}
      className={buttonCVA({ intent, size, className })}
      onClick={ourOnClick}
      disabled={!!disabled}
    >
      {children}
    </button>
  );
};

export default Button;
