import { ReactNode, FC } from "react";
import classNames from "classnames";

type Props = {
  useCase?: "primary" | "secondary" | undefined;
  children: ReactNode;
  type?: "submit" | undefined;
  onClick?: Function;
  loading?: boolean; // XXX_PORTING
  "data-testid"?: string; // XXX_PORTING
};

const Button: FC<Props> = (props) => {
  const useCase = props.useCase || "primary";
  const bType = props.type || "button";
  const classes: any = {
    primary: "bg-primary hover:bg-primary-hover",
    secondary: "bg-secondary hover:bg-secondary-hover",
  };
  const onClick = (e) => {
    if (props.onClick) props.onClick(e)
  }
  return (
    <button
      type={bType}
      className={classNames(
        "p-4 text-white py-2 px-4 rounded",
        classes[useCase]
      )}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
