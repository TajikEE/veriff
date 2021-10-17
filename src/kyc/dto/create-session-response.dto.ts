export type Verification = {
  id: string;
  url: string;
  vendorData: string;
  host: string;
  status: string;
  sessionToken: string;
};

export type CreateSessionResponse = {
  verification: Verification;
  status: string;
};
