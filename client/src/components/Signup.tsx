import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <section className="h-[40rem] grid content-center">
        <div className="w-96 mx-auto grid gap-8">
          <p className="text-2xl">Sign Up</p>
          <TextField id="outlined-basic" label="Username" variant="outlined" />
          <TextField id="outlined-basic" label="Password" variant="outlined" />
          <div className="grid">
            <p className="pr-3 mb-4 text-right">
              Already a user?{" "}
              <span
                className="text-blue-500 font-semibold"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log in
              </span>
            </p>
            <Button variant="contained" onClick={() => {}}>
              Sign Up
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
