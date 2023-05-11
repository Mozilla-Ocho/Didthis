import { Button } from "@/components/uiLib";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";

const LoginButton = observer(
  ({
    overrideCodeCheck,
    overrideCodeCheckIfNoSignupCode,
    useCase,
    text,
    onClick,
    'data-testid': dataTestid,
  }:any) => {
    const store = useStore();
    if (!store.signupCode) {
      overrideCodeCheck = overrideCodeCheck || overrideCodeCheckIfNoSignupCode;
    }
    const handleClick = (e:any) => {
      store.launchGlobalLoginOverlay(overrideCodeCheck);
      onClick && onClick(e);
    };
    const defaultText = store.signupCode ? 'Sign Up' : 'Log In'
    return (
      <Button
        onClick={handleClick}
        useCase={useCase || "primary"}
        loading={store.loginButtonsSpinning}
        data-testid={dataTestid || "loginButton"}
      >
        {text || defaultText}
      </Button>
    );
  }
);

export { LoginButton };
