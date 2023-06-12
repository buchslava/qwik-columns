import type { Signal } from "@builder.io/qwik";
import type { MainStore } from "./game";

export function setSvgDimension(
  svgRef: Signal<Element | undefined>,
  store: MainStore
) {
  if (svgRef?.value) {
    const { width, height } = svgRef.value.getBoundingClientRect();

    store.width = width;
    store.height = height;
  }
}
