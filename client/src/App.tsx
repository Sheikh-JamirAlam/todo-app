import { useState } from "react";
import { RecoilRoot } from "recoil";
import useSWR from "swr";
import axios from "axios";
import { Checkbox, Fab } from "@mui/material";
import { RadioButtonUnchecked, CheckCircleOutline, Add } from "@mui/icons-material";
import Header from "./components/Header";
import NotLoggedIn from "./components/NotLoggedIn";
import Todos from "./components/Todos";

interface TodoType {
  title: string;
  isDone: boolean;
}

function App() {
  const [title, setTitle] = useState<string>("");
  const [todos, setTodos] = useState<TodoType[]>([]);
  const { data: user, error: userError } = useSWR("http://localhost:3000/auth/user", fetcher, { revalidateOnFocus: false });

  const addTodo = async () => {
    const res = await axios.post(
      "http://localhost:3000/todo",
      {
        title,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
    );
    const todo: TodoType = { title: res.data.title, isDone: res.data.isDone };
    setTodos((prev) => [...prev, todo]);
    setTitle("");
  };

  return (
    <RecoilRoot>
      {/* <InitialState setTodos={setTodos} /> */}
      <main className="h-screen bg-slate-200">
        <Header />
        {userError && <NotLoggedIn />}
        {user && (
          <>
            <div className="w-[70%] mx-auto pt-8 grid gap-4">
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
                <Fab color="primary" aria-label="add" onClick={addTodo}>
                  <Add />
                </Fab>
              </div>
            </div>
            <Todos todoList={todos} setTodoList={setTodos} userFetchDone={user} />
            {/* {todos.map((todo: TodoType, index: number) => {
              return <Todos key={index} title={todo.title} />;
            })} */}
          </>
        )}
      </main>
    </RecoilRoot>
  );
}

// const InitialState = ({ setTodos }: { setTodos: Dispatch<SetStateAction<TodoType[]>> }) => {
//   const { data: todoList, error: todoError } = useSWR("http://localhost:3000/todo", fetchTodoList, { revalidateOnFocus: false });
//   todoList && setTodos(todoList);
//   return <></>;
// };

const fetcher = async (url: string) => {
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } });
  return res.data;
};

// const fetchTodoList = async (url: string) => {
//   const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } });
//   return res.data;
// };

export default App;
