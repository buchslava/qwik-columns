import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const year = new Date().getFullYear();

  return (
    <div class="fixed bottom-0 left-0 w-full h-8 text-center text-white bg-gray-600">
      <span class="hidden lg:inline">
        <span class="text-red-500 font-bold font-mono text-xl pr-2">C</span>
        <span class="text-yellow-500 font-bold font-mono text-xl pr-2">O</span>
        <span class="text-green-500 font-bold font-mono text-xl pr-2">L</span>
        <span class="text-blue-500 font-bold font-mono text-xl pr-2">U</span>
        <span class="text-teal-500 font-bold font-mono text-xl pr-2">M</span>
        <span class="text-fuchsia-500 font-bold font-mono text-xl pr-2">N</span>
        <span class="text-lime-500 font-bold font-mono text-xl pr-7">S</span>
      </span>
      <span class="text-sm text-white">
        <a
          href="https://valor-software.com/"
          class="no-underline hover:underline"
          target="_blank"
        >
          Valor Software
        </a>{" "}
        edition. (C) {year},{" "}
        <a
          href="https://dev.to/buchslava"
          class="no-underline hover:underline"
          target="_blank"
        >
          Vyacheslav Chub
        </a>
      </span>
    </div>
  );
});
