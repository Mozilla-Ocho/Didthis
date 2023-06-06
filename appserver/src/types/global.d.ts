type ApiUser = {
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

interface UserDbRow {
  id: string;
  email: string;
  url_slug: string | null;
  profile: POJO;
  created_at_millis: number;
  updated_at_millis: number;
  signup_code_name: string | null;
  admin_status: string | null;
  ban_status: string | null;
  last_write_from_user: number | null;
  last_read_from_user: number | null;
};


type JSONABLE =
  | undefined
  | boolean
  | string
  | number
  | { [key: string]: JSONABLE }
  | Array<JSONABLE>;

type POJO = { [key: string]: JSONABLE };

