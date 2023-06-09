import type { PropFunction, Signal } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import * as d3 from "d3";
import type { Game } from "./game-logic";
import { Phase } from "./game-logic";
import { Level } from "./game";

interface ControlsProps {
  game: Game;
  onStart$: PropFunction<() => void>;
  onPause$: PropFunction<() => void>;
  onStop$: PropFunction<() => void>;
  onLeft$: PropFunction<() => void>;
  onRight$: PropFunction<() => void>;
  onSwap$: PropFunction<() => void>;
  onDrop$: PropFunction<() => void>;
  onLevel$: PropFunction<(level: Level) => void>;
  blockSize: number;
  level: Level;
}

export function renderNextActor(
  data: string[],
  size: number,
  svgRef: Signal<Element | undefined>
) {
  if (!svgRef.value) {
    return;
  }
  const svg = d3.select(svgRef.value);

  svg.selectAll("*").remove();

  svg
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
    onLevel$,
    game,
    blockSize,
    level,
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
        <div class="pl-3 mb-5 flex w-36 justify-between">
          <button
            onClick$={() => {
              onLevel$(Level.SLOW);
            }}
            type="button"
            class={[
              "w-10 py-3 text-white rounded focus:outline-none",
              level === Level.SLOW ? "bg-green-700" : "bg-yellow-500",
            ]}
            disabled={level === Level.SLOW}
          >
            1
          </button>
          <button
            onClick$={() => {
              onLevel$(Level.NORMAL);
            }}
            type="button"
            class={[
              "w-10 py-3 text-white rounded focus:outline-none",
              level === Level.NORMAL ? "bg-green-700" : "bg-yellow-500",
            ]}
            disabled={level === Level.NORMAL}
          >
            2
          </button>
          <button
            onClick$={() => {
              onLevel$(Level.FAST);
            }}
            type="button"
            class={[
              "w-10 py-3 text-white rounded focus:outline-none",
              level === Level.FAST ? "bg-green-700" : "bg-yellow-500",
            ]}
            disabled={level === Level.FAST}
          >
            3
          </button>
        </div>
        {game.phase !== Phase.INACTIVE && (
          <div class="pl-3 grid grid-rows-3 grid-cols-2 gap-4">
            <div class="col-span-2">
              <button
                onClick$={onSwap$}
                type="button"
                class="text-2xl py-3 w-32 text-white bg-gray-400 rounded focus:outline-none"
              >
                W
              </button>
            </div>
            <div class="w-32 grid grid-flow-col justify-stretch">
              <button
                onClick$={onLeft$}
                type="button"
                class="text-2xl mr-2 py-3 text-white bg-green-300 rounded focus:outline-none"
              >
                A
              </button>
              <button
                onClick$={onRight$}
                type="button"
                class="text-2xl ml-2 py-3 text-white bg-green-300 rounded focus:outline-none"
              >
                D
              </button>
            </div>
            <div class="col-span-2">
              <button
                onClick$={onDrop$}
                type="button"
                class="text-2xl py-3 w-32 text-white bg-gray-400 rounded focus:outline-none"
              >
                S
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
