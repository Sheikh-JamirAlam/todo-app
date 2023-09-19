import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import App from "./App.tsx";
import Signup from "./components/Signup.tsx";
import Login from "./components/Login.tsx";
import User from "./components/User.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <User />
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
