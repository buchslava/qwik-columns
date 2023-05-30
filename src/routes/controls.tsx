import type { PropFunction } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";

interface ControlsProps {
  onStart$?: PropFunction<() => void>;
  onStop$?: PropFunction<() => void>;
}

export default component$<ControlsProps>(({ onStart$, onStop$ }) => {
  return (
    <>
      <div>
        <button onClick$={onStart$}>Start</button>
      </div>
      <div>
        <button onClick$={onStop$}>Stop</button>
      </div>
    </>
  );
});
