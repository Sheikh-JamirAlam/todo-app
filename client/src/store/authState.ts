import { atom } from "recoil";
import { UserAtomType } from "../types";

export const authState = atom({
  key: "authState",
  default: { user: null, userError: null, isLoading: true, mutate: null } as UserAtomType,
});
