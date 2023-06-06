import type { ReactNode } from "react";
import { StoreWrapper, StoreLoadingWrapper } from "@/lib/store";
import { LoginGlobalOverlay } from "@/components/LoginGlobalOverlay";

export default function DefaultLayout({
  user,
  signupCode,
  children,
}: {
  user: ApiUser | false;
  signupCode: false | string;
  children: ReactNode; // ReactNode not ReactElement 
}) {
  return (
    <StoreWrapper user={user} signupCode={signupCode}>
      <StoreLoadingWrapper ifLoading={<p>loading</p>}>
        <LoginGlobalOverlay />
        <main className="p-10">{children}</main>
      </StoreLoadingWrapper>
    </StoreWrapper>
  );
}
