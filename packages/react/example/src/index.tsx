import { Fragment, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  clear,
  decrement,
  increment,
  minus,
  plus,
  store,
  tick,
  useStore,
} from "./store";

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

export function App() {
  const [count, countDispatch] = useStore((s) => s.count);
  const [timer, timerDispatch] = useStore((s) => s.timer);
  const [value, setValue] = useState(10);
  const [showDetails, setShowDetails] = useState(false);

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

      <details onClick={() => setShowDetails((prev) => !prev)}>
        <summary>History</summary>
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

          <hr
            style={{
              gridColumn: "1 / -1",
            }}
          />

          {showDetails &&
            store.history().map((h) => (
              <Fragment
                key={`${h.timestamp.valueOf()}_${h.id.valueOf().toString()}`}
              >
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
              </Fragment>
            ))}
        </div>
      </details>
    </main>
  );
}

root.render(<App />);
