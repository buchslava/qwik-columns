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
import { COLOR_WHITE, Game } from "./game";
import { clone } from "./game";
import {
  Phase,
  actorDown,
  collapse,
  doNextActor,
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
  init,
  pause,
} from "./game";
import Controls from "./controls";

export function render(
  game: Game,
  svgRef: Signal<Element | undefined>,
  width: number,
  height: number,
  blockSize: number,
  passThroughSteps?: number
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

  svg
    .append("g")
    .append("rect")
    .attr("x", 0)
    .attr("width", width)
    .attr("y", 0)
    .attr("height", height)
    // @ts-ignore
    .attr("fill", () => d3.color(COLOR_WHITE));

  const data = [];
  for (let i = 0, x = 0, y = 0; i < game.board.length; i++) {
    x = 0;
    for (let j = 0; j < game.board[i].length; j++) {
      data.push({ x, y, value: game.board[i][j] });
      x += blockSize;
    }
    y += blockSize;
  }

  svg
    .selectAll()
    .data(data)
    .enter()
    .append("g")
    .append("rect")
    .attr("x", (d) => d.x)
    .attr("width", blockSize)
    .attr("y", (d) => d.y)
    .attr("height", blockSize)
    // @ts-ignore
    .attr("fill", (d) => d3.color(d.value));

  if (
    game.phase === Phase.MOVING ||
    game.phase === Phase.PAUSED ||
    game.phase === Phase.DROP
  ) {
    const actorData = [];
    for (let i = 0; i < game.actor.state.length; i++) {
      actorData.push({
        x: game.actor.x * blockSize,
        y: (game.actor.y + i - 1) * blockSize,
        value: game.actor.state[i],
      });
    }

    svg
      .selectAll()
      .data(actorData)
      .enter()
      .append("g")
      .append("rect")
      .attr("class", "could-fly")
      .attr("x", (d) => d.x)
      .attr("width", blockSize)
      .attr("y", (d) => d.y)
      .attr("height", blockSize)
      // @ts-ignore
      .attr("fill", (d) => d3.color(d.value));

    if (passThroughSteps) {
      game.phase = Phase.FLYING;
      svg
        .selectAll(".could-fly")
        .transition()
        .duration(700)
        .attr("y", (d: any) => d.y + passThroughSteps * blockSize)
        // don't mix with on('end', ...)
        .end()
        .then(() => {
          actorDown(game, passThroughSteps);
          game.phase = Phase.MOVING;
        });
    }
  }
}

export interface MainStore {
  width: number;
  height: number;
  game: Game;
  blockSize: number;
  gameOverPopup: boolean;
}

export default component$(() => {
  // https://qwik.builder.io/docs/concepts/reactivity/#deep-objects
  const store = useStore<MainStore>({
    width: 0,
    height: 0,
    game: {
      board: [...initData],
      actor: {
        state: [...initActor],
        x: Math.floor(initData[0].length / 2),
        y: -2,
      },
      phase: Phase.INACTIVE,
      savedPhase: Phase.INACTIVE,
      nextActor: randomColors(3),
      score: 0,
    },
    blockSize: 0,
    gameOverPopup: false,
  });
  const containerRef = useSignal<Element>();
  const svgRef = useSignal<Element>();

  useOnWindow(
    "resize",
    $(() => {
      setSvgDimension(containerRef, store);
    })
  );

  useOnDocument(
    "keypress",
    $((event) => {
      const keyEvent = event as KeyboardEvent;
      const { phase } = store.game;
      if (phase !== Phase.MOVING) {
        return;
      }
      let shouldRender = false;
      if (keyEvent.code === "KeyA") {
        moveLeft(store.game);
        shouldRender = true;
      } else if (keyEvent.code === "KeyD") {
        moveRight(store.game);
        shouldRender = true;
      } else if (keyEvent.code === "KeyS" || keyEvent.code === "Space") {
        store.game.phase = Phase.DROP;
      } else if (keyEvent.code === "KeyW") {
        swapActorColors(store.game);
        shouldRender = true;
      }
      if (shouldRender) {
        window.requestAnimationFrame(() => {
          render(
            store.game,
            svgRef,
            store.width,
            store.height,
            store.blockSize
          );
        });
      }
    })
  );

  useVisibleTask$(({ cleanup }: { cleanup: Function }) => {
    setSvgDimension(containerRef, store);
    const id = setInterval(() => {
      const game = store.game;

      if (game.phase === Phase.FLYING) {
        return;
      }

      if (game.phase === Phase.MOVING) {
        if (isNextMovePossible(game)) {
          actorDown(game);
        } else {
          endActorSession(game);
          if (isFinish(game)) {
            game.phase = Phase.INACTIVE;
            store.gameOverPopup = true;
          } else {
            game.phase = Phase.MATCH_REQUEST;
          }
        }
      } else if (game.phase === Phase.DROP) {
        const gameClone = clone(game);

        let steps = 0;
        while (isNextMovePossible(gameClone)) {
          actorDown(gameClone);
          steps++;
        }
        window.requestAnimationFrame(() => {
          render(
            game,
            svgRef,
            store.width,
            store.height,
            store.blockSize,
            steps
          );
        });
        return;
      } else if (game.phase === Phase.MATCH_REQUEST) {
        const matched = matching(game)(true);
        if (matched) {
          game.phase = Phase.COLLAPSE_REQUEST;
        } else {
          doNextActor(game);
          game.phase = Phase.MOVING;
        }
      } else if (game.phase === Phase.COLLAPSE_REQUEST) {
        collapse(game);
        game.phase = Phase.MATCH_REQUEST;
      }

      window.requestAnimationFrame(() => {
        render(game, svgRef, store.width, store.height, store.blockSize);
      });
    }, 700);
    cleanup(() => clearInterval(id));
  });

  useTask$(({ track }: { track: Function }) => {
    track(() => store.gameOverPopup);

    if (store.gameOverPopup) {
      setTimeout(() => {
        store.gameOverPopup = false;
      }, 5000);
    }
  });

  useTask$(({ track }: { track: Function }) => {
    track(() => store.width);
    track(() => store.height);
    track(() => store.game);

    render(store.game, svgRef, store.width, store.height, store.blockSize);
  });

  return (
    <div class="flex justify-center w-screen h-screen pt-5" ref={containerRef}>
      {store.gameOverPopup && (
        <div class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-72 opacity-60 text-center max-w-sm p-6 bg-white text-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          GAME OVER
        </div>
      )}

      <div>
        <svg
          class="game-area"
          width={store.width}
          height={store.height}
          ref={svgRef}
        />
      </div>
      <Controls
        game={store.game}
        blockSize={15}
        onStart$={() => {
          init(store.game);
          store.gameOverPopup = false;
          store.game.phase = Phase.MOVING;
        }}
        onPause$={() => {
          pause(store.game);
        }}
        onStop$={() => {
          store.game.phase = Phase.INACTIVE;
          store.gameOverPopup = true;
        }}
      />
    </div>
  );
});
