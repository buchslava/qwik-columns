import type { Signal } from "@builder.io/qwik";
import type { MainStore } from ".";

export function setSvgDimension(
  svgRef: Signal<Element | undefined>,
  store: MainStore
) {
  if (svgRef?.value) {
    const { height } = svgRef.value.getBoundingClientRect();
    const rows = store.game.board.length;
    const columns = store.game.board[0].length;

    const newHeight = (height * 5) / 6;
    const blockSize = newHeight / rows;
    const newWidth = blockSize * columns;

    store.width = newWidth;
    store.height = newHeight;
    store.blockSize = blockSize;
  }
}
