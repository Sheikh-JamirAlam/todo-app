import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { Checkbox } from "@mui/material";
import { RadioButtonUnchecked, CheckCircleOutline } from "@mui/icons-material";

interface TodoType {
  title: string;
  isDone: boolean;
}

interface PropTypes {
  todoList: TodoType[];
  setTodoList: React.Dispatch<React.SetStateAction<TodoType[]>>;
  userFetchDone: { username: string };
}

const Todos = ({ todoList, setTodoList }: PropTypes) => {
  const [isDone, setIsDone] = useState<boolean>(false);
  const { data } = useSWR(true && "http://localhost:3000/todo", fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    data && setTodoList(data);
  }, [data, setTodoList]);

  const handleDoneCheck = async (todoId: string) => {
    const res = await axios.post(
      "http://localhost:3000/todo/done",
      {
        todoId,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
    );
    const todo: TodoType = { title: res.data.title, isDone: res.data.isDone };
    setTodoList((prev) => [...prev, todo]);
  };

  return (
    <>
      {todoList.map((todo: TodoType, index: number) => {
        return (
          <div key={index} className="w-[70%] mx-auto pt-8 grid gap-4">
            <div className="p-3 flex gap-2 bg-slate-100">
              <Checkbox icon={<RadioButtonUnchecked />} checkedIcon={<CheckCircleOutline />} onClick={handleDoneCheck(todo.todoId)} />
              <p className={`w-full px-2 my-auto text-lg ${todo.isDone && "line-through"}`}>{todo.title}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

const fetcher = async (url: string) => {
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } });
  return res.data;
};

export default Todos;
