import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
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
            <Button
              variant="contained"
              onClick={async () => {
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
                  console.log(response.data);
                  localStorage.setItem("token", response.data.token);
                  //navigate("/");
                } else {
                  alert("Username or password incorrect");
                }
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
