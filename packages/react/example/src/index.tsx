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
  const [count, countDispatch, store] = useStore((s) => s.count);
  const [timer, timerDispatch] = useStore((s) => s.timer);
  const [value, setValue] = useState(10);

  return (
    <main
      style={{
        textAlign: "center",
        width: "100%",
        height: 200,
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

      <code>
        <pre>{JSON.stringify(store.printHistory(), null, 2)}</pre>
      </code>
    </main>
  );
}

root.render(<App />);
