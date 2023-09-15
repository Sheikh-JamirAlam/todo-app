import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotLoggedIn = () => {
  const navigate = useNavigate();

  return (
    <section className="h-[40rem] grid content-center">
      <div className="w-96 mx-auto text-center grid">
        <p className="text-lg">To create Todos you need to first have an account. Login or Signup here.</p>
        <div className="my-10 flex justify-evenly">
          <Button variant="contained" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
          <Button variant="outlined" onClick={() => navigate("/login")}>
            Log In
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotLoggedIn;
