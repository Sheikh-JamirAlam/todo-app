import { useEffect, useState } from "react";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignup = async () => {
    const response = await axios
      .post(
        "http://localhost:3000/auth/signup",
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
        <div className="w-96 mx-auto grid gap-8">
          <p className="text-2xl">Sign Up</p>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
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
