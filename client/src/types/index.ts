export interface TodoType {
  title: string;
  isDone: boolean;
  _id: string;
}

export interface UserAtomType {
  user: { username: string } | null;
  userError: Error | null;
  isLoading: boolean | null;
  mutate: (() => void) | null;
}

export interface SafeInputType {
  isSafe: boolean;
  message: string;
}
