// import { UserProfile } from "@/lib/UserProfile";

type GenericErrorId = "ERR_UNAUTHORIZED" | "ERR_CSRF_TOKEN";

type ErrorId = GenericErrorId;

type User = {
  id: string;
  email: string;
  urlSlug?: string;
  profile: POJO;
  createdAt: number;
  signupCodeName?: string;
  unsolicited?: true;
  isAdmin?: true;
  isBanned?: true;
  lastFullPageLoad?: number;
  lastWrite?: number;
  updatedAt?: number;
};

interface Wrapper {
  action: string;
  status: number;
  success: boolean;
  payload?: POJO;
  errorId?: ErrorId;
  errorMsg?: string;
}
interface SuccessWrapper extends Wrapper {
  action: string;
  status: number;
  success: true;
  payload?: POJO;
}
interface ErrorWrapper extends Wrapper {
  action: string;
  status: number;
  success: false;
  errorId: ErrorId;
  errorMsg: string;
}

interface EmptySuccessWrapper extends SuccessWrapper {
  // some calls don't return data, for example sessionLogin and sessionLogout
  // because their purpose is to set/destroy cookies.
}

interface MeWrapper extends SuccessWrapper {
  payload: User;
}

interface ValidateSignupCodeWrapper extends SuccessWrapper {
  payload: { code: string; name: string; active: boolean };
}

export type {
  Wrapper,
  SuccessWrapper,
  ErrorWrapper,
  ErrorId,
  User,
  MeWrapper,
  ValidateSignupCodeWrapper,
  EmptySuccessWrapper,
};
