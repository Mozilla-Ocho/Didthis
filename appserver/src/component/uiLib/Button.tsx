import { ReactNode, FC } from "react";
import classNames from "classnames";

type Props = {
  useCase?: "primary" | "secondary" | undefined;
  children: ReactNode;
  type?: "submit" | undefined;
};

const Button: FC<Props> = (props) => {
  const useCase = props.useCase || "primary";
  const bType = props.type || "button";
  const classes: any = {
    primary: "bg-primary hover:bg-primary-hover",
    secondary: "bg-secondary hover:bg-secondary-hover",
  };
  return (
    <button
      type={bType}
      className={classNames(
        "p-4 text-white py-2 px-4 rounded",
        classes[useCase]
      )}
    >
      {props.children}
    </button>
  );
};

export default Button;
