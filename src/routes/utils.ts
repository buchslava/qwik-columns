import type { Signal } from "@builder.io/qwik";

export function setSvgDimension(
  svgRef: Signal<Element | undefined>,
  store: any,
  rows: number,
  columns: number
) {
  if (svgRef?.value) {
    const { height } = svgRef.value.getBoundingClientRect();

    const newHeight = (height * 5) / 6;
    const blockSize = newHeight / rows;
    const newWidth = blockSize * columns;

    store.width = newWidth;
    store.height = newHeight;
    store.blockSize = blockSize;
  }
}
