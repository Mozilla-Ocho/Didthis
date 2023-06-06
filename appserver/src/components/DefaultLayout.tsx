import type { ReactNode } from "react";
import { StoreWrapper, StoreLoadingWrapper } from "@/lib/store";
import { LoginGlobalOverlay } from "@/components/auth/LoginGlobalOverlay";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import StaticLayout from "./StaticLayout";

export default function DefaultLayout({
  authUser,
  signupCode,
  headerFooter,
  children,
}: {
  authUser: ApiUser | false;
  signupCode: false | string;
  headerFooter: boolean,
  children: ReactNode; // ReactNode not ReactElement 
}) {
  return (
    <StoreWrapper authUser={authUser} signupCode={signupCode}>
      <StoreLoadingWrapper ifLoading={<p>loading</p>}>
        <LoginGlobalOverlay />
        {headerFooter && <AppHeader />}
        <StaticLayout>{children}</StaticLayout>
        {headerFooter && <AppFooter />}
      </StoreLoadingWrapper>
    </StoreWrapper>
  );
}
