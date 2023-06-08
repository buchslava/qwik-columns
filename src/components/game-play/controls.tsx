import type { PropFunction, Signal } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import * as d3 from "d3";
import type { Game } from "./game-logic";
import { Phase } from "./game-logic";

interface ControlsProps {
  game: Game;
  onStart$: PropFunction<() => void>;
  onPause$: PropFunction<() => void>;
  onStop$: PropFunction<() => void>;
  onLeft$: PropFunction<() => void>;
  onRight$: PropFunction<() => void>;
  onSwap$: PropFunction<() => void>;
  onDrop$: PropFunction<() => void>;
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
    y: i * size,
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
    .attr("fill", (d) => d3.color(d.value))
    .attr("stroke", "#000000")
    .attr("stroke-width", 1);
}

export default component$<ControlsProps>(
  ({
    onStart$,
    onPause$,
    onStop$,
    onLeft$,
    onRight$,
    onSwap$,
    onDrop$,
    game,
    blockSize,
  }) => {
    const svgRef = useSignal<Element>();

    renderNextActor(game.nextActor, blockSize, svgRef);

    return (
      <div class="relative text-white w-72 h-48">
        <div class="pl-3 inset-x-0 top-0">
          <div class="mb-5 text-base lg:text-2xl md:text-xl font-extrabold font-mono">
            SCORE: {game.score}
          </div>
          <div class="mb-5">
            <div class="bg-white w-32 pt-2 pb-2 flex justify-center">
              <svg
                width={blockSize}
                height={blockSize * game.nextActor.length}
                ref={svgRef}
              />
            </div>
          </div>
          {game.phase === Phase.INACTIVE && (
            <div class="mb-5">
              <button
                onClick$={onStart$}
                type="button"
                class="font-mono px-8 py-3 w-32 text-white bg-pink-300 rounded focus:outline-none"
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
                class="font-mono px-8 py-3 w-32 text-white bg-blue-300 rounded focus:outline-none"
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
                class="font-mono px-8 py-3 w-32 text-white bg-gray-300 rounded focus:outline-none"
              >
                STOP
              </button>
            </div>
          )}
        </div>
        {game.phase !== Phase.INACTIVE && (
          <div class="pl-3 grid grid-rows-3 grid-cols-2 gap-4">
            <div class="col-span-2">
              <button
                onClick$={onSwap$}
                type="button"
                class="text-2xl py-3 w-32 text-white bg-gray-400 rounded focus:outline-none"
              >
                ⬆ <sup>W</sup>
              </button>
            </div>
            <div class="flex w-full justify-between">
              <button
                onClick$={onLeft$}
                type="button"
                class="text-2xl py-3 w-14 text-white bg-green-300 rounded focus:outline-none"
              >
                ⬅ <sup>A</sup>
              </button>
              <button
                onClick$={onRight$}
                type="button"
                class="text-2xl py-3 w-14 text-white bg-green-300 rounded focus:outline-none"
              >
                <sup>D</sup> ⮕
              </button>
            </div>
            <div class="col-span-2">
              <button
                onClick$={onDrop$}
                type="button"
                class="text-2xl py-3 w-32 text-white bg-gray-400 rounded focus:outline-none"
              >
                ⬇ <sup>S</sup>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
