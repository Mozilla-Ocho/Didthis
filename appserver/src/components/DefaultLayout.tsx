import type { ReactElement } from 'react';
import { StoreWrapper, StoreReadinessWrapper } from "@/lib/store";
import { LoginGlobalOverlay } from "@/components/LoginGlobalOverlay";

export default function DefaultLayout({children}:{children: ReactElement}) {
  return (
    <StoreWrapper>
      <StoreReadinessWrapper ifNotReady={<p>"loading"</p>}>
        <LoginGlobalOverlay />
        <main className="p-10">
          {children}
        </main>
      </StoreReadinessWrapper>
    </StoreWrapper>
  );
};

