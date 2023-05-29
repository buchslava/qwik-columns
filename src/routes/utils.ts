import type { Signal } from "@builder.io/qwik";

export function setSvgDimension(
  svgRef: Signal<Element | undefined>,
  store: any
) {
  if (svgRef?.value) {
    const { width, height } = svgRef.value.getBoundingClientRect();
    store.width = width;
    store.height = height;
  }
}
