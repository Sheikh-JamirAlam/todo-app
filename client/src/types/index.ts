export interface TodoType {
  title: string;
  isDone: boolean;
  _id: string;
}

export interface UserAtomType {
  user: { username: string } | null;
  userError: Error | null;
  mutate: (() => void) | null;
}
