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
import type { Game } from "./game";
import {
  Phase,
  actorDown,
  collapse,
  doNextShape,
  endActorSession,
  initActor,
  initData,
  isFinish,
  isNextMovePossible,
  matching,
  moveLeft,
  moveRight,
  randomColors,
  swapActorColors,
} from "./game";

export const BLOCK_SIZE = 15;

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
      let shouldRender = false;
      if (keyEvent.code === "KeyA") {
        moveLeft(game);
        shouldRender = true;
      } else if (keyEvent.code === "KeyD") {
        moveRight(game);
        shouldRender = true;
      } else if (keyEvent.code === "KeyS" || keyEvent.code === "Space") {
        game.phase = Phase.DROP;
      } else if (keyEvent.code === "KeyW") {
        swapActorColors(game);
        shouldRender = true;
      }
      if (shouldRender) {
        window.requestAnimationFrame(() => {
          render(game, svgRef, store.width, store.height);
        });
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

      window.requestAnimationFrame(() => {
        render(game, svgRef, store.width, store.height);
      });
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
