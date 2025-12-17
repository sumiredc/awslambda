import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

const API_ID = import.meta.env.VITE_API_ID || "";
const STAGE = import.meta.env.VITE_API_STAGE || "";
const BASE_URL = `http://localhost:4566/_aws/execute-api/${API_ID}/${STAGE}`;

function App() {
  const [count, setCount] = useState(0);

  async function helloWorld() {
    try {
      await fetch(`${BASE_URL}/hello-world`);
    } catch (error) {
      console.error(error);
    }
  }

  async function login() {
    try {
      await fetch(`${BASE_URL}/login`, {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => helloWorld()}>Hello World!</button>
      </div>
      <div className="card">
        <button onClick={() => login()}>login</button>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">{BASE_URL}</p>
    </>
  );
}

export default App;
