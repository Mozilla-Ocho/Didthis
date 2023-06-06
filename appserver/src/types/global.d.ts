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

