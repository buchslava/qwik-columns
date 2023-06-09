import{z as _,k as T,a as n,_ as a,C as w,S as E,l as C,n as V,r as D,X as O,N as g,O as p,U as P,o as c,b}from"./q-1f2f0220.js";import{P as t,m as k,s as N,i as f,a as R,e as z,b as y,c as x,d as G,f as M,g as $,h as U,r as S,j as I,k as F,l as Q,S as Y,L as J,n as Z,o as L,p as H}from"./q-bf883d7e.js";import{C as K}from"./q-7008557b.js";const B=()=>{const[e]=_();e.game.phase===t.MOVING&&(e.game.phase=t.DROP)},W=()=>{const[e,s]=_();s.game.phase===t.MOVING&&(k(s.game),e())},X=()=>{const[e,s]=_();s.game.phase===t.MOVING&&(N(s.game),e())},j=()=>{const[e,s]=_(),o=s.game;if(o.phase!==t.FLYING){if(o.phase===t.MOVING)f(o)?R(o):(z(o),y(o,s.level)?(o.phase=t.INACTIVE,s.gameOverPopup=!0):o.phase=t.MATCH_REQUEST);else if(o.phase===t.DROP){const r=x(o);let h=0;for(;f(r);)R(r),h++;e(h);return}else o.phase===t.MATCH_REQUEST?G(o,s.level)(!0)?o.phase=t.COLLAPSE_REQUEST:(M(o),o.phase=t.MOVING):o.phase===t.COLLAPSE_REQUEST&&($(o),o.phase=t.MATCH_REQUEST);e()}},q=()=>{const[e,s]=_();s.game.phase===t.MOVING&&(U(s.game),e())},ee=e=>{const[s,o]=_();window.requestAnimationFrame(()=>{S(s.game,o,s.width,s.height,s.blockSize,e)})},se=e=>{const[s,o,r,h,m]=_(),l=e,{phase:d}=m.game;d===t.MOVING&&(l.code==="KeyA"?o():l.code==="KeyD"?r():l.code==="KeyS"||l.code==="Space"?s():l.code==="KeyW"&&h())},oe=T(n(()=>a(()=>import("./q-1730ff2d.js"),["build/q-1730ff2d.js","build/q-1f2f0220.js"]),"s_kyzWmZz43AM")),te=()=>{const e=w({width:0,height:0,game:{board:[...I],actor:{state:[...F],column:Math.floor(I[0].length/2),row:-2},phase:t.INACTIVE,savedPhase:t.INACTIVE,nextActor:Q(3),score:0,scores:Y},blockSize:0,level:J.NORMAL,intervalId:null,gameOverPopup:!1}),s=E(),o=E(),r=n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_xBCRT11r6XA",[e,o]),h=n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_nEfr0b8SZhk",[r,e]),m=n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_BeyZ0Sw0SmU",[r,e]),l=n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_pQCiFx0OfCc",[r,e]),d=n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_ceGxLRrlmgU",[e]),u=n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_TkVYsNeLfzg",[r,e]);return C("resize",n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_GNeO5nO3be8",[s,e])),V("keypress",n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_G0CYh0nsyHk",[d,h,m,l,e])),D(n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_LzrfCwaFyLk",[s,u,e])),O(n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_IHgav91uwds",[e])),O(n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_5J1GdPz7JcQ",[e,o])),g("div",{ref:s},{class:"flex justify-center w-screen h-screen pt-5"},[e.gameOverPopup&&g("div",null,{class:"fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-72 opacity-60 text-center max-w-sm p-6 bg-white text-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"},"GAME OVER",3,"eK_0"),g("div",null,null,g("svg",{ref:o},{class:"game-area",width:p(v=>v.width,[e]),height:p(v=>v.height,[e])},null,3,null),1,null),P(K,{get game(){return e.game},blockSize:15,get level(){return e.level},onStart$:n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_xJrxY7wiGYs",[e]),onPause$:n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_ROUfROoFvZc",[e]),onStop$:n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_kYFzhOQnm80",[e]),onLeft$:h,onRight$:m,onSwap$:l,onDrop$:d,onLevel$:n(()=>a(()=>Promise.resolve().then(()=>i),void 0),"s_5C257LwJSZA",[u,e]),[c]:{game:p(v=>v.game,[e]),blockSize:c,level:p(v=>v.level,[e]),onStart$:c,onPause$:c,onStop$:c,onLeft$:c,onRight$:c,onSwap$:c,onDrop$:c,onLevel$:c}},3,"eK_1"),P(oe,null,3,"eK_2")],1,"eK_3")},re=()=>{const[e]=_();Z(e.game),e.gameOverPopup=!1,e.game.phase=t.MOVING},ne=e=>{const[s,o]=_();o.level=e,o.intervalId!==null&&clearInterval(o.intervalId),o.intervalId=setInterval(s,L[o.level])},ae=()=>{const[e]=_();H(e.game)};function A(e,s){if(e!=null&&e.value){const{height:o}=e.value.getBoundingClientRect(),r=s.game.board.length,h=s.game.board[0].length,m=o*5/6,l=m/r,d=l*h;s.width=d,s.height=m,s.blockSize=l}}const ie=({cleanup:e})=>{const[s,o,r]=_();A(s,r),r.intervalId=setInterval(o,L[r.level]),e(()=>clearInterval(r.intervalId))},_e=({track:e})=>{const[s,o]=_();e(()=>s.width),e(()=>s.height),e(()=>s.game),S(s.game,o,s.width,s.height,s.blockSize)},le=()=>{const[e]=_();e.game.phase=t.INACTIVE,e.gameOverPopup=!0},ce=({track:e})=>{const[s]=_();e(()=>s.gameOverPopup),s.gameOverPopup&&setTimeout(()=>{s.gameOverPopup=!1},5e3)},he=()=>{const[e,s]=_();A(e,s)},i=Object.freeze(Object.defineProperty({__proto__:null,_hW:b,s_0eJNMN0ChX4:te,s_5C257LwJSZA:ne,s_5J1GdPz7JcQ:_e,s_BeyZ0Sw0SmU:q,s_G0CYh0nsyHk:se,s_GNeO5nO3be8:he,s_IHgav91uwds:ce,s_LzrfCwaFyLk:ie,s_ROUfROoFvZc:ae,s_TkVYsNeLfzg:j,s_ceGxLRrlmgU:B,s_kYFzhOQnm80:le,s_nEfr0b8SZhk:W,s_pQCiFx0OfCc:X,s_xBCRT11r6XA:ee,s_xJrxY7wiGYs:re},Symbol.toStringTag,{value:"Module"}));export{b as _hW,te as s_0eJNMN0ChX4,ne as s_5C257LwJSZA,_e as s_5J1GdPz7JcQ,q as s_BeyZ0Sw0SmU,se as s_G0CYh0nsyHk,he as s_GNeO5nO3be8,ce as s_IHgav91uwds,ie as s_LzrfCwaFyLk,ae as s_ROUfROoFvZc,j as s_TkVYsNeLfzg,B as s_ceGxLRrlmgU,le as s_kYFzhOQnm80,W as s_nEfr0b8SZhk,X as s_pQCiFx0OfCc,ee as s_xBCRT11r6XA,re as s_xJrxY7wiGYs};
