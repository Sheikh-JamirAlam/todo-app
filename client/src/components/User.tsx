import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import { fetcher } from "../swr";
import { authState } from "../store/authState.ts";

const User = () => {
  const setAuth = useSetRecoilState(authState);
  const { data: user, error: userError, mutate } = useSWR("http://localhost:3000/auth/user", fetcher);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    userError && setAuth({ user, userError, mutate });
  }, [userError, setAuth]);

  useEffect(() => {
    user && setAuth({ user, userError, mutate });
  }, [user, setAuth]);

  return <></>;
};

export default User;
