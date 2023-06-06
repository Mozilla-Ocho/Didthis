import { Button } from "@/components/uiLib";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";

const LogoutButton = observer(
  ({
    useCase,
    text,
    onClick,
    'data-testid': dataTestid,
  }:any) => {
    const store = useStore();
    const handleClick = (e:any) => {
      store.logOut();
      onClick && onClick(e);
    };
    const defaultText = 'Log Out'
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

export { LogoutButton };
