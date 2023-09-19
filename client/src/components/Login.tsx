import { useEffect, useState } from "react";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import Header from "./Header";
import { signupInput } from "../zod";
import { fetcher } from "../swr";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isInputUsernameSafe, setIsInputUsernameSafe] = useState<boolean>(true);
  const [isInputPasswordSafe, setIsInputPasswordSafe] = useState<boolean>(true);
  const { data: user } = useSWR("http://localhost:3000/auth/user", fetcher, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });

  const handleLogin = async () => {
    const input = signupInput.safeParse({ username, password });
    if (!input.success) {
      input.error.issues[0].path[0] === "username" && setIsInputUsernameSafe(false);
      input.error.issues[0].path[0] === "password" && setIsInputPasswordSafe(false);
      input.error.issues[1]?.path[0] === "password" && setIsInputPasswordSafe(false);
      return;
    }

    const response = await axios
      .post(
        "http://localhost:3000/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.error(err + " : " + err.response.data.msg);
      });
    if (response?.data.token) {
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } else {
      setIsInputUsernameSafe(false);
      setIsInputPasswordSafe(false);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const keyDownHandler = (event: { key: string; preventDefault: () => void }) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleLogin();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [username, password]);

  useEffect(() => {
    user && navigate("/");
  }, [user]);

  return (
    <>
      <Header />
      <section className="h-[40rem] grid content-center">
        <div className="w-[80%] md:w-[50%] lg:w-[30%] mx-auto grid gap-8">
          <p className="text-2xl">Log In</p>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            error={!isInputUsernameSafe}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsInputUsernameSafe(true);
              setIsInputPasswordSafe(true);
            }}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password" error={!isInputPasswordSafe}>
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              error={!isInputPasswordSafe}
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsInputUsernameSafe(true);
                setIsInputPasswordSafe(true);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(e) => {
                      setShowPassword((show) => !show);
                      e.preventDefault();
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <div className="grid">
            <p className="pr-3 mb-4 text-right">
              Don't have an account yet?{" "}
              <span
                className="text-blue-500 font-semibold cursor-pointer"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </span>
            </p>
            <Button variant="contained" onClick={handleLogin}>
              Log In
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
