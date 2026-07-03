import React, { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTask = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="container">
      <div className="todo-box">
        <h1>
          <span>✨</span> To-Do List
        </h1>

        <form className="input-box" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <div
                className="task-content"
                onClick={() => toggleComplete(todo.id)}
              >
                <div className={`checkbox ${todo.completed ? "checked" : ""}`}>
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className={`text ${todo.completed ? "completed" : ""}`}>
                  {todo.text}
                </span>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteTask(todo.id)}
                title="Delete task"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;