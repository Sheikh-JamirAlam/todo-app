import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { Checkbox, Fab } from "@mui/material";
import { RadioButtonUnchecked, CheckCircleOutline, Add } from "@mui/icons-material";
import Header from "./components/Header";
import NotLoggedIn from "./components/NotLoggedIn";
import Todos from "./components/Todos";
import { TodoType } from "./types";

// TODO: Recoil user data, dockerization

function App() {
  const [title, setTitle] = useState<string>("");
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [hasAddTodoClicked, setHasAddTodoClicked] = useState<boolean>(false);
  const { data: user, error: userError } = useSWR("http://localhost:3000/auth/user", fetcher, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });

  const addTodo = async () => {
    setHasAddTodoClicked(true);
    try {
      await axios.post(
        "http://localhost:3000/todo",
        {
          title,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
      );
      setTitle("");
    } catch (err) {
      console.error(err);
    }
    setHasAddTodoClicked(false);
  };

  useEffect(() => {
    const keyDownHandler = (event: { key: string; preventDefault: () => void }) => {
      if (title !== "") {
        if (event.key === "Enter") {
          event.preventDefault();
          addTodo();
        }
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <main>
      <Header username={user ? user.username : null} />
      {userError && <NotLoggedIn />}
      {user && (
        <>
          <section className="w-[90%] md:w-[70%] mx-auto pt-8 grid gap-4">
            <div className="p-3 flex gap-2 bg-slate-100">
              <Checkbox icon={<RadioButtonUnchecked />} checkedIcon={<CheckCircleOutline />} disabled />
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
              <Fab color="primary" aria-label="add" onClick={addTodo} disabled={hasAddTodoClicked}>
                <Add />
              </Fab>
            </div>
          </section>
          <Todos todoList={todos} setTodoList={setTodos} hasAddTodoClicked={hasAddTodoClicked} />
        </>
      )}
    </main>
  );
}

const fetcher = async (url: string) => {
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } });
  return res.data;
};

export default App;
