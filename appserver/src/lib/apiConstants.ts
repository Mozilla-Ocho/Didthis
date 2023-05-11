// import { UserProfile } from "@/lib/UserProfile";

type JSONABLE =
  | undefined
  | boolean
  | string
  | number
  | { [key: string]: JSONABLE }
  | Array<JSONABLE>;
type POJO = { [key: string]: JSONABLE };

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
  payload: POJO;
}
interface ErrorWrapper extends Wrapper {
  action: string;
  status: number;
  success: false;
  errorId: ErrorId;
  errorMsg: string;
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
  POJO,
  ErrorId,
  User,
  MeWrapper,
  ValidateSignupCodeWrapper,
};
