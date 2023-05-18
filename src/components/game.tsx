import {
  useStore,
  component$,
  useOnDocument,
  useSignal,
  useClientEffect$,
  $,
} from "@builder.io/qwik";
import * as d3 from "d3";
import { Gameplay, hCount, vCount } from "./gameplay";
import { Global, Phase } from "./global";

export const _shouldBeActorVisible = () => {
  return (
    Global.phase == Phase.moving ||
    (Global.phase == Phase.inactive && Gameplay.actorPosRow >= 0)
  );
};

export const render = (svgRef: any) => {
  const svg = d3
  .select(svgRef.value)
  .append("svg")
  .attr("width", 1500)
  .attr("height", 1700)
  .append("g")
  .attr("transform", "translate(0,0)");

  const rows: any[] = [];

  for (let col = 0; col < Gameplay.board.length; col++) {
    const colData: any[] = [];
    for (let row = 0; row < Gameplay.board[col].length; row++) {
      let color;
      if (
        Gameplay.actorPosCol == col &&
        Gameplay.actorPosRow == row &&
        _shouldBeActorVisible()
      ) {
        //color = Gameplay.shape[0];
      } else if (
        Gameplay.actorPosCol == col &&
        Gameplay.actorPosRow == row - 1 &&
        _shouldBeActorVisible()
      ) {
        //color = Gameplay.shape[1];
      } else if (
        Gameplay.actorPosCol == col &&
        Gameplay.actorPosRow == row - 2 &&
        _shouldBeActorVisible()
      ) {
        //color = Gameplay.shape[2];
      } else {
        color = Gameplay.board[col][row];
      }
      colData.push({ color: color, position: { col, row } });

      svg
      .append("g")
      .append("rect")
      .attr("x", col*30)
      .attr("width", 30)
      .attr("y", row*30)
      .attr("height", 30)
      .attr("fill", color);

      // console.log(col, row, color);
  
    }

    rows.push(colData);
  }

  console.log(rows);


};

export default component$(() => {
  const store = useStore<any>({ tick: 0 });
  const svgRef: any = useSignal<Element>();

  useClientEffect$(() => {
    if (Global.phase == Phase.inactive) {
      Gameplay.init();
    }

    store.playTimer = setTimeout(() => {
      render(svgRef);
       store.tick++;
    }, 1000);
  });

  useOnDocument(
    "keydown",
    $((event: Event) => {
      const key = (event as KeyboardEvent).key;

      if (key === "ArrowLeft") {
        Gameplay.moveLeft();
      }
      if (key === "ArrowRight") {
        Gameplay.moveRight();
      }
      if (key === "ArrowUp") {
        Gameplay.swapActorColors();
      }
      if (key === "ArrowDown") {
      }

      // console.log((event as KeyboardEvent).key, store.tick);
    })
  );

  return <svg class="chart" ref={svgRef} />;
});
