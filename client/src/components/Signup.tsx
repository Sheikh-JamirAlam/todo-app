import { useEffect, useState } from "react";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import Header from "./Header";

const signupInput = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username cannot be empty",
    })
    .max(20, {
      message: "Username must be 20 characters or less",
    })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  password: z.string().min(1, {
    message: "Password cannot be empty",
  }),
});

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isInputUsernameSafe, setIsInputUsernameSafe] = useState<boolean>(true);
  const [isInputPasswordSafe, setIsInputPasswordSafe] = useState<boolean>(true);

  const handleSignup = async () => {
    const input = signupInput.safeParse({ username, password });
    if (!input.success) {
      input.error.issues[0].path[0] === "username" && setIsInputUsernameSafe(false);
      input.error.issues[0].path[0] === "password" && setIsInputPasswordSafe(false);
      input.error.issues[1]?.path[0] === "password" && setIsInputPasswordSafe(false);
      return;
    }

    const response = await axios
      .post(
        "http://localhost:3000/auth/signup",
        {
          username: input.data.username,
          password: input.data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.error(err);
      });
    if (response?.data.token) {
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } else {
      alert("Username or password incorrect");
    }
  };

  useEffect(() => {
    const keyDownHandler = (event: { key: string; preventDefault: () => void }) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSignup();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  return (
    <>
      <Header />
      <section className="h-[40rem] grid content-center">
        <div className="w-[80%] md:w-[50%] lg:w-[30%] mx-auto grid gap-8">
          <p className="text-2xl">Sign Up</p>
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
              value={password}
              error={!isInputPasswordSafe}
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
              Already a user?{" "}
              <span
                className="text-blue-500 font-semibold cursor-pointer"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log in
              </span>
            </p>
            <Button variant="contained" onClick={handleSignup}>
              Sign Up
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
