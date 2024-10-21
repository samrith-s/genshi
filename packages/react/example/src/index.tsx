import { useState } from "react";
import { createRoot } from "react-dom/client";

import {
  clear,
  decrement,
  increment,
  minus,
  plus,
  tick,
  useStore,
} from "./store";

const container = document.getElementById("app");
const root = createRoot(container!);

export function App() {
  const [count, countDispatch, history] = useStore((s) => s.count);
  const [timer, timerDispatch] = useStore((s) => s.timer);
  const [value, setValue] = useState(10);

  return (
    <main
      style={{
        textAlign: "center",
        width: "100%",
        display: "grid",
        gridTemplateRows: "max-content max-content 1fr",
        gap: 10,
      }}
    >
      <h1>{count}</h1>

      <div>
        <button onClick={() => countDispatch(decrement)}>-1</button>
        <button onClick={() => countDispatch(minus, value)}>-{value}</button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <button onClick={() => countDispatch(plus, value)}>+{value}</button>
        <button onClick={() => countDispatch(increment)}>+1</button>
      </div>

      <div>
        <button onClick={() => timerDispatch(tick)} disabled={!!timer}>
          Start timer
        </button>
        <button onClick={() => timerDispatch(clear)} disabled={!timer}>
          Stop
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          overflow: "auto",
        }}
      >
        <p>
          <strong>Timestamp</strong>
        </p>
        <p>
          <strong>Name</strong>
        </p>
        <p>
          <strong>Type</strong>
        </p>
        <p>
          <strong>Source</strong>
        </p>
        <p>
          <strong>Payload</strong>
        </p>
        <p>
          <strong>Global</strong>
        </p>

        {history.map((h) => (
          <>
            <p>{h.timestamp.toLocaleString()}</p>
            <p>{h.name}</p>
            <p>{h.type}</p>
            {h.source ? (
              <p>
                Name: {h.source.name}
                <br />
                Type: {h.source.type}
              </p>
            ) : (
              <p>-</p>
            )}
            {h.payload !== undefined ? (
              <p>{JSON.stringify(h.payload, null, 2)}</p>
            ) : (
              <p>-</p>
            )}
            <p>{String(!!h.global).toUpperCase()}</p>
          </>
        ))}
      </div>
    </main>
  );
}

root.render(<App />);
