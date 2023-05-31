import type { PropFunction, Signal } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import * as d3 from "d3";
import type { Game } from "./game";
import { Phase } from "./game";

interface ControlsProps {
  game: Game;
  onStart$: PropFunction<() => void>;
  onPause$: PropFunction<() => void>;
  onStop$: PropFunction<() => void>;
  blockSize: number;
}

export function renderNextActor(
  data: string[],
  size: number,
  svgRef: Signal<Element | undefined>
) {
  if (!svgRef.value) {
    return;
  }
  const svg = d3
    .select(svgRef.value)
    .append("svg")
    .attr("width", size)
    .attr("height", size * data.length)
    .append("g")
    .attr("transform", "translate(0,0)");

  const displayData = data.map((d, i) => ({
    value: d,
    y: (data.length - 1) * size - i * size,
    size,
  }));

  svg
    .selectAll()
    .data(displayData)
    .enter()
    .append("g")
    .append("rect")
    .attr("x", 0)
    .attr("width", (d) => d.size)
    .attr("y", (d) => d.y)
    .attr("height", (d) => d.size)
    // @ts-ignore
    .attr("fill", (d) => d3.color(d.value));
}

export default component$<ControlsProps>(
  ({ onStart$, onPause$, onStop$, game, blockSize }) => {
    const svgRef = useSignal<Element>();

    renderNextActor(game.nextActor, blockSize, svgRef);

    return (
      <div class="relative text-white w-72 h-48">
        <div class="pl-3 pt-10 inset-x-0 top-0">
          <div class="mb-5 text-2xl font-extrabold">SCORE: {game.score}</div>
          <div class="mb-5">
            <svg
              width={blockSize}
              height={blockSize * game.nextActor.length}
              ref={svgRef}
            />
          </div>
          {game.phase === Phase.INACTIVE && (
            <div class="mb-5">
              <button
                onClick$={onStart$}
                type="button"
                class="px-8 py-3 w-32 text-white bg-pink-300 rounded focus:outline-none"
              >
                START
              </button>
            </div>
          )}
          {game.phase !== Phase.INACTIVE && (
            <div class="mb-5">
              <button
                onClick$={onPause$}
                type="button"
                class="px-8 py-3 w-32 text-white bg-blue-300 rounded focus:outline-none"
              >
                {game.phase === Phase.PAUSED ? "GO" : "PAUSE"}
              </button>
            </div>
          )}

          {game.phase !== Phase.INACTIVE && (
            <div class="mb-5">
              <button
                onClick$={onStop$}
                type="button"
                class="px-8 py-3 w-32 text-white bg-gray-300 rounded focus:outline-none"
              >
                STOP
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
