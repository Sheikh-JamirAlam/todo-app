import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { Checkbox, Fab, Backdrop, CircularProgress, Tooltip } from "@mui/material";
import { RadioButtonUnchecked, CheckCircleOutline, Add } from "@mui/icons-material";
import Header from "./components/Header";
import NotLoggedIn from "./components/NotLoggedIn";
import Todos from "./components/Todos";
import { TodoType, UserAtomType } from "./types";
import { authState } from "./store/authState.ts";

const App = () => {
  const [title, setTitle] = useState<string>("");
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [hasAddTodoClicked, setHasAddTodoClicked] = useState<boolean>(false);
  const [userAuthState] = useRecoilState<UserAtomType>(authState);

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
      <Header username={userAuthState.user ? userAuthState.user.username : null} />
      {userAuthState.isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1 }} open={userAuthState.isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {userAuthState.userError && <NotLoggedIn />}
      {userAuthState.user && (
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
              <Tooltip title="Add Todo" enterDelay={800} leaveDelay={100} enterNextDelay={800}>
                <Fab color="primary" aria-label="add" onClick={addTodo} disabled={hasAddTodoClicked}>
                  <Add />
                </Fab>
              </Tooltip>
            </div>
          </section>
          <Todos todoList={todos} setTodoList={setTodos} hasAddTodoClicked={hasAddTodoClicked} />
        </>
      )}
    </main>
  );
};

export default App;
