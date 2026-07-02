// app-user.model.ts
export type AppUser = {
  uid: string;
  email: string | null;
  name: string | null;
  lastname: string | null;
  displayName: string | null;
  photoUrl: string | null;
};

export type UserProfile = {
  name: string | null;
  lastname: string | null;
};
