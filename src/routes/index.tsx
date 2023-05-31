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
  init,
  pause,
} from "./game";
import Controls from "./controls";

export function render(
  game: Game,
  svgRef: Signal<Element | undefined>,
  width: number,
  height: number,
  blockSize: number
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
      if (game.phase == Phase.MOVING || game.phase === Phase.PAUSED) {
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
}

export default component$(() => {
  const store = useStore({
    width: 0,
    height: 0,
    game: {
      board: [...initData],
      actor: {
        state: [...initActor],
        x: 3,
        y: -2,
      },
      phase: Phase.INACTIVE,
      savedPhase: Phase.INACTIVE,
      nextActor: randomColors(3),
      score: 0,
    },
    blockSize: 0,
    gameOver: false,
  });
  const containerRef = useSignal<Element>();
  const svgRef = useSignal<Element>();

  useOnWindow(
    "resize",
    $(() => {
      setSvgDimension(
        containerRef,
        // todo
        store,
        store.game.board.length,
        store.game.board[0].length
      );
    })
  );

  useOnDocument(
    "keypress",
    $((event) => {
      const keyEvent = event as KeyboardEvent;
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
    setSvgDimension(
      containerRef,
      store,
      store.game.board.length,
      store.game.board[0].length
    );
    const id = setInterval(() => {
      const game = store.game;

      if (game.phase === Phase.MOVING) {
        if (isNextMovePossible(game)) {
          actorDown(game);
        } else {
          endActorSession(game);
          if (isFinish(game)) {
            game.phase = Phase.INACTIVE;
            store.gameOver = true;
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
        render(game, svgRef, store.width, store.height, store.blockSize);
      });
    }, 700);
    cleanup(() => clearInterval(id));
  });

  useTask$(({ track }: { track: Function }) => {
    track(() => store.width);
    track(() => store.height);
    track(() => store.blockSize);
    track(() => store.game);

    render(store.game, svgRef, store.width, store.height, store.blockSize);
  });

  return (
    <div class="flex justify-center w-screen h-screen pt-5" ref={containerRef}>
      {store.gameOver && (
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
        phase={store.game.phase}
        score={store.game.score}
        nextActor={store.game.nextActor}
        blockSize={15}
        onStart$={() => {
          init(store.game);
          store.gameOver = false;
          store.game.phase = Phase.MOVING;
        }}
        onPause$={() => {
          pause(store.game);
        }}
        onStop$={() => {
          store.game.phase = Phase.INACTIVE;
          store.gameOver = true;
        }}
      />
    </div>
  );
});
