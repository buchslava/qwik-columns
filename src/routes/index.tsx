import type { Signal } from "@builder.io/qwik";
import { useVisibleTask$ } from "@builder.io/qwik";
import {
  component$,
  useStore,
  useSignal,
  useOnDocument,
  useOnWindow,
  useTask$,
  $,
} from "@builder.io/qwik";
import * as d3 from "d3";
import { setSvgDimension } from "./utils";
import {
  actorDown,
  collapse,
  doNextShape,
  endActorSession,
  isFinish,
  isNextMovePossible,
  matching,
  moveLeft,
  moveRight,
  randomColors,
  swapActorColors,
} from "./game";

export const BLOCK_SIZE = 15;

export const w = "#ffffff";
export const b = "#000000";

export const customColors = [
  "#4169E1", // Royal Blue:
  "#FF7F50", // Coral:
  "#DAA520", // Goldenrod:
  "#DA70D6", // Orchid:
  "#32CD32", // Lime Green:
  "#008080", // Teal
  "#800000", // Maroon:
  "#00FFFF", // Aqua:
  "#FFDB58", //Mustard:
];
/**
 #A52A2A brown
 #FF0000 red
 #00FF00 green
 #0000FF blue
 #FFFF00 yellow
 #64dd17 light-green accent-4
 #330099 indigo
 #ff66be pink accent
 #008080 teal


 */

export const initData = [
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
];

export const randomColor = () =>
  customColors[Math.floor(Math.random() * customColors.length)];

export const initActor = [randomColor(), randomColor(), randomColor()];

export enum Phase {
  INACTIVE,
  PAUSED,
  MOVING,
  DROP,
  MATCH_REQUEST,
  COLLAPSE_REQUEST,
}

export interface Game {
  board: string[][];
  actor: {
    state: string[];
    x: number;
    y: number;
  };
  phase: Phase;
  nextActor: string[];
}

export function render(
  game: Game,
  svgRef: Signal<Element | undefined>,
  width: number,
  height: number
) {
  if (!svgRef.value) {
    return;
  }
  const svg = d3
    .select(svgRef.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");

  const data = [];
  for (let i = 0, x = 0, y = 0; i < game.board.length; i++) {
    x = 0;
    for (let j = 0; j < game.board[i].length; j++) {
      let value = game.board[i][j];
      if (game.phase == Phase.MOVING) {
        value =
          game.actor.x === j && game.actor.y === i
            ? game.actor.state[0]
            : game.actor.x === j && game.actor.y === i + 1
            ? game.actor.state[1]
            : game.actor.x === j && game.actor.y === i + 2
            ? game.actor.state[2]
            : game.board[i][j];
      }
      data.push({ x, y, value });
      x += BLOCK_SIZE;
    }
    y += BLOCK_SIZE;
  }

  svg
    .selectAll()
    .data(data)
    .enter()
    .append("g")
    .append("rect")
    .attr("x", (d) => d.x)
    .attr("width", BLOCK_SIZE)
    .attr("y", (d) => d.y)
    .attr("height", BLOCK_SIZE)
    // @ts-ignore
    .attr("fill", (d) => d3.color(d.value));
}

export default component$(() => {
  const store = useStore({ width: 0, height: 0 });
  const svgRef = useSignal<Element>();

  const game: Game = {
    board: [...initData],
    actor: {
      state: [...initActor],
      x: 3,
      y: -2,
    },
    phase: Phase.MOVING,
    nextActor: randomColors(3),
  };

  useOnWindow(
    "resize",
    $(() => {
      setSvgDimension(svgRef, store);
    })
  );

  useOnDocument(
    "keypress",
    $((event) => {
      const keyEvent = event as KeyboardEvent;
      if (keyEvent.code === "KeyA") {
        moveLeft(game);
        render(game, svgRef, store.width, store.height);
      } else if (keyEvent.code === "KeyD") {
        moveRight(game);
        render(game, svgRef, store.width, store.height);
      } else if (keyEvent.code === "KeyS") {
        if (isNextMovePossible(game)) {
          actorDown(game);
        } else {
          endActorSession(game);
          if (isFinish(game)) {
            ///
          } else {
            game.phase = Phase.MATCH_REQUEST;
            // startAutoMoveDown();
          }
        }
      } else if (keyEvent.code === "KeyW") {
        swapActorColors(game);
        render(game, svgRef, store.width, store.height);
      }
    })
  );

  useVisibleTask$(({ cleanup }: { cleanup: Function }) => {
    setSvgDimension(svgRef, store);
    const id = setInterval(() => {
      if (game.phase === Phase.MOVING) {
        if (isNextMovePossible(game)) {
          actorDown(game);
        } else {
          endActorSession(game);
          if (isFinish(game)) {
            game.phase = Phase.INACTIVE;
          } else {
            game.phase = Phase.MATCH_REQUEST;
          }
        }
      } else if (game.phase === Phase.DROP) {
        while (isNextMovePossible(game)) {
          actorDown(game);
        }
        game.phase = Phase.MOVING;
      } else if (game.phase === Phase.MATCH_REQUEST) {
        const matched = matching(game)(true);
        if (matched) {
          game.phase = Phase.COLLAPSE_REQUEST;
        } else {
          doNextShape(game);
          game.phase = Phase.MOVING;
        }
      } else if (game.phase === Phase.COLLAPSE_REQUEST) {
        collapse(game);
        game.phase = Phase.MATCH_REQUEST;
      }

      render(game, svgRef, store.width, store.height);
    }, 700);
    cleanup(() => clearInterval(id));
  });

  useTask$(({ track }: { track: Function }) => {
    track(() => store.width);
    track(() => store.height);

    render(game, svgRef, store.width, store.height);
  });

  return <svg class="chart" width="500" height="500" ref={svgRef} />;
});
