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
import type { Game } from "./game-logic";
import { COLOR_WHITE } from "./game-logic";
import { clone } from "./game-logic";
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
} from "./game-logic";
import Controls from "./controls";
import Footer from "./footer";

export enum Level {
  SLOW = "SLOW",
  NORMAL = "NORMAL",
  FAST = "FAST",
}

export const SPEEDS = {
  [Level.SLOW]: 1000,
  [Level.NORMAL]: 500,
  [Level.FAST]: 200,
};

export const SCORES = {
  [Level.SLOW]: 1,
  [Level.NORMAL]: 2,
  [Level.FAST]: 3,
};

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

  const svg = d3.select(svgRef.value);
  svg.selectAll("*").remove();
  svg
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
    .data(data.filter((d) => d.value !== COLOR_WHITE))
    .enter()
    .append("g")
    .append("rect")
    .attr("x", (d) => d.x)
    .attr("width", blockSize)
    .attr("y", (d) => d.y)
    .attr("height", blockSize)
    // @ts-ignore
    .attr("fill", (d) => d3.color(d.value))
    .attr("stroke", "#000000")
    .attr("stroke-width", 1);

  if (
    game.phase === Phase.MOVING ||
    game.phase === Phase.PAUSED ||
    game.phase === Phase.DROP
  ) {
    const actorData = [];
    for (let i = 0; i < game.actor.state.length; i++) {
      actorData.push({
        x: game.actor.column * blockSize,
        y: (game.actor.row + i - 1) * blockSize,
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
      .attr("fill", (d) => d3.color(d.value))
      .attr("stroke", "#000000")
      .attr("stroke-width", 1);

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
  level: Level;
  intervalId: any | null;
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
        column: Math.floor(initData[0].length / 2),
        row: -2,
      },
      phase: Phase.INACTIVE,
      savedPhase: Phase.INACTIVE,
      nextActor: randomColors(3),
      score: 0,
      scores: SCORES,
    },
    blockSize: 0,
    level: Level.NORMAL,
    intervalId: null,
    gameOverPopup: false,
  });
  const containerRef = useSignal<Element>();
  const svgRef = useSignal<Element>();

  const reRender = $((steps?: number) => {
    render(
      store.game,
      svgRef,
      store.width,
      store.height,
      store.blockSize,
      steps
    );
  });
  const doLeft = $(() => {
    if (store.game.phase === Phase.MOVING) {
      moveLeft(store.game);
      reRender();
    }
  });
  const doRight = $(() => {
    if (store.game.phase === Phase.MOVING) {
      moveRight(store.game);
      reRender();
    }
  });
  const doSwap = $(() => {
    if (store.game.phase === Phase.MOVING) {
      swapActorColors(store.game);
      reRender();
    }
  });
  const doDrop = $(() => {
    if (store.game.phase === Phase.MOVING) {
      store.game.phase = Phase.DROP;
    }
  });
  const moveTick = $(() => {
    const game = store.game;

    if (game.phase === Phase.FLYING) {
      return;
    }

    if (game.phase === Phase.MOVING) {
      if (isNextMovePossible(game)) {
        actorDown(game);
      } else {
        endActorSession(game);
        if (isFinish(game, store.level)) {
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
      reRender(steps);
      return;
    } else if (game.phase === Phase.MATCH_REQUEST) {
      const matched = matching(game, store.level, true);
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

    reRender();
  });

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
      if (keyEvent.code === "KeyA") {
        doLeft();
      } else if (keyEvent.code === "KeyD") {
        doRight();
      } else if (keyEvent.code === "KeyS" || keyEvent.code === "Space") {
        doDrop();
      } else if (keyEvent.code === "KeyW") {
        doSwap();
      }
    })
  );

  useVisibleTask$(({ cleanup }: { cleanup: Function }) => {
    setSvgDimension(containerRef, store);
    store.intervalId = setInterval(moveTick, SPEEDS[store.level]);
    cleanup(() => clearInterval(store.intervalId));
  });

  useTask$(({ track }: { track: Function }) => {
    track(() => store.gameOverPopup);

    if (store.gameOverPopup) {
      setTimeout(() => {
        store.gameOverPopup = false;
      }, 5000);
    }
  });

  return (
    <div class="flex justify-center w-screen h-screen pt-5" ref={containerRef}>
      {store.gameOverPopup && (
        <div class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-72 text-center max-w-sm p-6 bg-white text-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 z-50">
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
        level={store.level}
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
        onLeft$={doLeft}
        onRight$={doRight}
        onSwap$={doSwap}
        onDrop$={doDrop}
        onLevel$={(level: Level) => {
          store.level = level;
          if (store.intervalId !== null) {
            clearInterval(store.intervalId);
          }
          store.intervalId = setInterval(moveTick, SPEEDS[store.level]);
        }}
      />
      <Footer />
    </div>
  );
});
