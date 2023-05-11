import { UserProfile } from "@/lib/UserProfile";

type JSONABLE = undefined | boolean | string | number | {[key:string]: JSONABLE} | Array<JSONABLE>
type POJO = {[key:string]:JSONABLE}

type GenericErrorId = "ERR_UNAUTHORIZED" | "ERR_CSRF_TOKEN"

type ErrorId = GenericErrorId

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
}

interface Failure {
  success: false;
  errorId: ErrorId;
  errorMsg?: string;
}
interface Success {
  success: true;
  payload: POJO;
}

interface Wrapper {
  action: string;
  status: number;
  result: Success | Failure;
}

interface MeSuccess extends Success {
  payload: User;
}
interface MeWrapper extends Wrapper {
  result: MeSuccess | Failure
}

export type { Wrapper, POJO, MeWrapper, ErrorId }
