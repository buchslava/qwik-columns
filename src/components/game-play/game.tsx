import type { Signal } from "@builder.io/qwik";
import { useVisibleTask$ } from "@builder.io/qwik";
import {
  component$,
  useStore,
  useSignal,
  useOnDocument,
  useOnWindow,
  $,
} from "@builder.io/qwik";
import * as d3 from "d3";
import { setSvgDimension } from "./utils";

export function render(
  svgRef: Signal<Element | undefined>,
  width: number,
  height: number,
  x: number,
  y: number
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
    .attr("fill", () => d3.color("#ffffff"));

  const data = [{ x, y }];

  svg
    .selectAll()
    .data(data)
    .enter()
    .append("g")
    .append("rect")
    .attr("x", (d) => d.x)
    .attr("width", 15)
    .attr("y", (d) => d.y)
    .attr("height", 15)
    // @ts-ignore
    .attr("fill", () => d3.color("#ff0000"));
}

export interface MainStore {
  width: number;
  height: number;
  horPos: number;
  vertPos: number;
}

export default component$(() => {
  const store = useStore<MainStore>({
    width: 0,
    height: 0,
    horPos: 200,
    vertPos: 0,
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
      if (keyEvent.code === "KeyA") {
        store.horPos -= 10;
      } else if (keyEvent.code === "KeyD") {
        store.horPos += 10;
      }
    })
  );

  useVisibleTask$(({ cleanup }: { cleanup: Function }) => {
    setSvgDimension(containerRef, store);
    const intervalId = setInterval(() => {
      store.vertPos += 10;
      render(svgRef, store.width, store.height, store.horPos, store.vertPos);
    }, 700);
    cleanup(() => clearInterval(intervalId));
  });

  return (
    <div class="flex justify-center w-screen h-screen pt-5" ref={containerRef}>
      <svg
        class="game-area"
        width={store.width}
        height={store.height}
        ref={svgRef}
      />
    </div>
  );
});
