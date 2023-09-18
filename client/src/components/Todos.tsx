import { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { Checkbox, IconButton } from "@mui/material";
import { RadioButtonUnchecked, CheckCircleOutline, Delete } from "@mui/icons-material";
import { TodoType } from "./../types";

interface PropTypes {
  todoList: TodoType[];
  setTodoList: React.Dispatch<React.SetStateAction<TodoType[]>>;
  hasAddTodoClicked: boolean;
}

const Todos = ({ todoList, setTodoList, hasAddTodoClicked }: PropTypes) => {
  const { data, mutate } = useSWR("http://localhost:3000/todo", fetcher);

  useEffect(() => {
    data && setTodoList(data);
  }, [data, setTodoList]);

  if (hasAddTodoClicked) {
    mutate();
  }

  const handleDoneCheck = async (todoId: string) => {
    try {
      const res = await axios.patch(
        "http://localhost:3000/todo/done",
        {
          todoId,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
      );
      const todo: TodoType = { title: res.data.title, isDone: res.data.isDone, _id: res.data._id };
      const clickedTodoIndex = todoList.findIndex((eachTodo) => eachTodo._id === todo._id);
      const newTodos = [...todoList.slice(0, clickedTodoIndex), todo, ...todoList.slice(clickedTodoIndex + 1)];
      setTodoList(newTodos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      const res = await axios.put(
        "http://localhost:3000/todo/delete",
        {
          todoId,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
      );
      if (res) {
        mutate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {todoList.map((todo: TodoType, index: number) => {
        return (
          <div key={index} className="w-[70%] mx-auto pt-4 grid gap-4">
            <div className="p-3 flex gap-2 bg-slate-100">
              <Checkbox icon={<RadioButtonUnchecked />} checkedIcon={<CheckCircleOutline />} checked={todo.isDone} onClick={() => handleDoneCheck(todo._id)} />
              <p className={`w-full px-2 my-auto text-lg ${todo.isDone && "line-through"}`}>{todo.title}</p>
              <IconButton aria-label="delete" onClick={() => handleDelete(todo._id)}>
                <Delete className="hover:fill-red-600" />
              </IconButton>
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
