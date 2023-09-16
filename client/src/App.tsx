import { useState } from "react";
import { RecoilRoot } from "recoil";
import useSWR from "swr";
import axios from "axios";
import Header from "./components/Header";
import NotLoggedIn from "./components/NotLoggedIn";
import { Checkbox, Fab } from "@mui/material";
import { RadioButtonUnchecked, CheckCircleOutline, Add } from "@mui/icons-material";

function App() {
  const [title, setTitle] = useState("");
  const { data, error } = useSWR("http://localhost:3000/auth/user", fetcher, { revalidateOnFocus: false, refreshInterval: 600000 });

  const addTodo = async () => {
    const res = await axios.post(
      "http://localhost:3000/todo",
      {
        title,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
    );
    console.log(res.data);
  };

  return (
    <RecoilRoot>
      <main className="h-screen bg-slate-200">
        <Header />
        {error && <NotLoggedIn />}
        {data && (
          <div className="w-[70%] mx-auto pt-8 grid gap-4">
            <div className="p-3 flex gap-2 bg-slate-100">
              <Checkbox icon={<RadioButtonUnchecked />} checkedIcon={<CheckCircleOutline />} />
              <input
                className="w-full px-2 text-lg bg-transparent outline-none"
                placeholder="Add a task"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
              ></input>
            </div>
            <div className="flex justify-end">
              <Fab color="primary" aria-label="add">
                <Add onClick={addTodo} />
              </Fab>
            </div>
          </div>
        )}
      </main>
    </RecoilRoot>
  );
}

const fetcher = async (url: string) => {
  return axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }).then((res) => res.data);
};

export default App;
