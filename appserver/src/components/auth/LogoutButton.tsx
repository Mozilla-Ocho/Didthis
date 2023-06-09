import { Button } from "@/components/uiLib";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";

const LogoutButton = observer(
  ({
    intent,
    text,
    onLogout,
    'data-testid': dataTestid,
  }:{
    intent?: React.ComponentProps<typeof Button>['intent'],
    text?: string,
    onLogout?: () => void,
    'data-testid'?: string,
  }) => {
    const store = useStore();
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      store.logOut();
      onLogout && onLogout();
    };
    const defaultText = 'Log Out'
    return (
      <Button
        onClick={handleClick}
        intent={intent}
        loading={store.loginButtonsSpinning}
        data-testid={dataTestid || "loginButton"}
      >
        {text || defaultText}
      </Button>
    );
  }
);

export { LogoutButton };
