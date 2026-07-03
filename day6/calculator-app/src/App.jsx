import { useEffect, useState, useCallback } from "react";
import "./App.css";
const buttons = [
  { label: "C", action: "clear", type: "function" },
  { label: "DEL", action: "delete", type: "function" },
  { label: "(", action: "(", type: "operator" },
  { label: ")", action: ")", type: "operator" },
  { label: "/", action: "/", type: "operator" },
  { label: "7", action: "7" },
  { label: "8", action: "8" },
  { label: "9", action: "9" },
  { label: "*", action: "*", type: "operator" },
  { label: "4", action: "4" },
  { label: "5", action: "5" },
  { label: "6", action: "6" },
  { label: "-", action: "-", type: "operator" },
  { label: "1", action: "1" },
  { label: "2", action: "2" },
  { label: "3", action: "3" },
  { label: "+", action: "+", type: "operator" },
  { label: "0", action: "0" },
  { label: ".", action: ".", type: "operator" },
  { label: "=", action: "calculate", type: "equal" },
];
const operators = ["+", "-", "*", "/", "."];

const evaluateExpression = (expression) => {
  const sanitized = expression.replace(/\s+/g, "");
  if (!sanitized) {
    throw new Error("Empty expression");
  }

  if (/[^0-9+\-*/().]/.test(sanitized)) {
    throw new Error("Invalid characters");
  }

  const result = Function(`"use strict"; return (${sanitized})`)();
  if (typeof result !== "number" || !Number.isFinite(result)) {
    throw new Error("Math error");
  }

  return Number.isInteger(result)
    ? result.toString()
    : result.toFixed(8).replace(/\.0+$|(?<=\d)0+$/, "");
};

function App() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const appendValue = useCallback((value) => {
    if (input === "Error") {
      setInput(value);
      setError("");
      return;
    }

    const lastChar = input.slice(-1);

    if (operators.includes(value)) {
      if (input === "" && value !== "-") {
        return;
      }

      if (operators.includes(lastChar) && value !== "-") {
        return;
      }

      if (value === ".") {
        const lastNumber = input.split(/[-+*/]/).pop();
        if (lastNumber.includes(".")) {
          return;
        }
      }
    }

    setInput((prev) => prev + value);
    setError("");
  }, [input]);

  const calculate = useCallback(() => {
    try {
      const expression = input;
      const result = evaluateExpression(expression);
      setInput(result);
      setError("");
      setHistory((prev) => [{ expression, result }, ...prev].slice(0, 5));
    } catch {
      setInput("Error");
      setError("Invalid expression. Use numbers and + - * / only.");
    }
  }, [input]);

  const deleteLast = useCallback(() => {
    setInput((prev) => (prev === "Error" ? "" : prev.slice(0, -1)));
    setError("");
  }, []);

  const clear = useCallback(() => {
    setInput("");
    setError("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculate();
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        deleteLast();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        clear();
        return;
      }

      if (/^[0-9]$/.test(event.key) || operators.includes(event.key) || event.key === "(" || event.key === ")") {
        event.preventDefault();
        appendValue(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendValue, calculate, clear, deleteLast]);

  const handleButton = (action) => {
    if (action === "clear") {
      clear();
      return;
    }

    if (action === "delete") {
      deleteLast();
      return;
    }

    if (action === "calculate") {
      calculate();
      return;
    }

    appendValue(action);
  };

  return (
    <div className="container">
      <div className="calculator">
        <h2>Ashes Calculator</h2>

        <div className="display-wrapper">
          <input type="text" value={input} readOnly className="display" placeholder="0" />
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="buttons">
          {buttons.map(({ label, action, type }) => (
            <button
              key={label}
              type="button"
              className={`button ${type ?? ""}`.trim()}
              onClick={() => handleButton(action)}
            >
              {label}
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <div className="history">
            <h3>History</h3>
            <ul>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.result}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
