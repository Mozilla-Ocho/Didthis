import { Button } from "@/components/uiLib";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import { StyledFirebaseAuth } from "@/components/StyledFirebaseAuth";

const LoginButton = observer(
  ({
    overrideCodeCheck,
    overrideCodeCheckIfNoSignupCode,
    useCase,
    text,
    onClick,
    'data-testid': dataTestid,
  }) => {
    const store = useStore();
    if (!store.signupCode) {
      overrideCodeCheck = overrideCodeCheck || overrideCodeCheckIfNoSignupCode;
    }
    const handleClick = (e) => {
      store.launchGlobalLoginOverlay(overrideCodeCheck);
      onClick && onClick(e);
    };
    return (
      <Button
        onClick={handleClick}
        useCase={useCase || "primary"}
        loading={store.loginButtonsSpinning}
        data-testid={dataTestid || "loginButton"}
      >
        {text || 'Log in / Sign up'}
      </Button>
    );
  }
);

export { LoginButton };
