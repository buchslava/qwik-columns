import{z as l,k as S,a as n,_ as i,C as I,S as v,l as R,n as b,r as z,X as f,N as d,O as p,U as O,o as m,b as T}from"./q-1f2f0220.js";import{P as r,m as C,a as k,s as y,i as P,b as L,r as V,c as N,p as x,d as E,e as w,f as D,g as G,h as M,j as F,k as U,l as Q}from"./q-94000052.js";import{r as u}from"./q-450c1779.js";import{C as Y}from"./q-7eea1661.js";const H=e=>{const[s,o]=l(),a=e,{phase:h}=s.game;if(h!==r.MOVING)return;let t=!1;a.code==="KeyA"?(C(s.game),t=!0):a.code==="KeyD"?(k(s.game),t=!0):a.code==="KeyS"||a.code==="Space"?s.game.phase=r.DROP:a.code==="KeyW"&&(y(s.game),t=!0),t&&window.requestAnimationFrame(()=>{u(s.game,o,s.width,s.height,s.blockSize)})},K=S(n(()=>i(()=>import("./q-1730ff2d.js"),["build/q-1730ff2d.js","build/q-1f2f0220.js"]),"s_kyzWmZz43AM")),J=()=>{const e=I({width:0,height:0,game:{board:[...P],actor:{state:[...L],column:Math.floor(P[0].length/2),row:-2},phase:r.INACTIVE,savedPhase:r.INACTIVE,nextActor:V(3),score:0},blockSize:0,gameOverPopup:!1}),s=v(),o=v();return R("resize",n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_GNeO5nO3be8",[s,e])),b("keypress",n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_G0CYh0nsyHk",[e,o])),z(n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_LzrfCwaFyLk",[s,e,o])),f(n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_IHgav91uwds",[e])),f(n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_5J1GdPz7JcQ",[e,o])),d("div",{ref:s},{class:"flex justify-center w-screen h-screen pt-5"},[e.gameOverPopup&&d("div",null,{class:"fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-72 opacity-60 text-center max-w-sm p-6 bg-white text-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"},"GAME OVER",3,"eK_0"),d("div",null,null,d("svg",{ref:o},{class:"game-area",width:p(a=>a.width,[e]),height:p(a=>a.height,[e])},null,3,null),1,null),O(Y,{get game(){return e.game},blockSize:15,onStart$:n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_xJrxY7wiGYs",[e]),onPause$:n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_ROUfROoFvZc",[e]),onStop$:n(()=>i(()=>Promise.resolve().then(()=>c),void 0),"s_kYFzhOQnm80",[e]),[m]:{game:p(a=>a.game,[e]),blockSize:m,onStart$:m,onPause$:m,onStop$:m}},3,"eK_1"),O(K,null,3,"eK_2")],1,"eK_3")},$=()=>{const[e]=l();N(e.game),e.gameOverPopup=!1,e.game.phase=r.MOVING},W=()=>{const[e]=l();x(e.game)};function A(e,s){if(e!=null&&e.value){const{height:o}=e.value.getBoundingClientRect(),a=s.game.board.length,h=s.game.board[0].length,t=o*5/6,_=t/a,g=_*h;s.width=g,s.height=t,s.blockSize=_}}const j=({cleanup:e})=>{const[s,o,a]=l();A(s,o);const h=setInterval(()=>{const t=o.game;if(t.phase!==r.FLYING){if(t.phase===r.MOVING)E(t)?w(t):(D(t),G(t)?(t.phase=r.INACTIVE,o.gameOverPopup=!0):t.phase=r.MATCH_REQUEST);else if(t.phase===r.DROP){const _=M(t);let g=0;for(;E(_);)w(_),g++;window.requestAnimationFrame(()=>{u(t,a,o.width,o.height,o.blockSize,g)});return}else t.phase===r.MATCH_REQUEST?F(t)(!0)?t.phase=r.COLLAPSE_REQUEST:(U(t),t.phase=r.MOVING):t.phase===r.COLLAPSE_REQUEST&&(Q(t),t.phase=r.MATCH_REQUEST);window.requestAnimationFrame(()=>{u(t,a,o.width,o.height,o.blockSize)})}},700);e(()=>clearInterval(h))},q=({track:e})=>{const[s,o]=l();e(()=>s.width),e(()=>s.height),e(()=>s.game),u(s.game,o,s.width,s.height,s.blockSize)},X=()=>{const[e]=l();e.game.phase=r.INACTIVE,e.gameOverPopup=!0},Z=({track:e})=>{const[s]=l();e(()=>s.gameOverPopup),s.gameOverPopup&&setTimeout(()=>{s.gameOverPopup=!1},5e3)},B=()=>{const[e,s]=l();A(e,s)},c=Object.freeze(Object.defineProperty({__proto__:null,_hW:T,s_0eJNMN0ChX4:J,s_5J1GdPz7JcQ:q,s_G0CYh0nsyHk:H,s_GNeO5nO3be8:B,s_IHgav91uwds:Z,s_LzrfCwaFyLk:j,s_ROUfROoFvZc:W,s_kYFzhOQnm80:X,s_xJrxY7wiGYs:$},Symbol.toStringTag,{value:"Module"}));export{T as _hW,J as s_0eJNMN0ChX4,q as s_5J1GdPz7JcQ,H as s_G0CYh0nsyHk,B as s_GNeO5nO3be8,Z as s_IHgav91uwds,j as s_LzrfCwaFyLk,W as s_ROUfROoFvZc,X as s_kYFzhOQnm80,$ as s_xJrxY7wiGYs};