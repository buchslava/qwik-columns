import{z as i,Q as u,H as l,O as r,U as m,a as d,x as p,_}from"./q-1f2f0220.js";import{u as b}from"./q-499e1d49.js";const f=async(a,e)=>{const[s]=i(),t=new FormData(e),o=new URLSearchParams;t.forEach((n,c)=>{typeof n=="string"&&o.append(c,n)}),s("?"+o.toString(),!0).then(()=>{e.getAttribute("data-spa-reset")==="true"&&e.reset(),e.dispatchEvent(new CustomEvent("submitcompleted",{bubbles:!1,cancelable:!1,composed:!1,detail:{status:200}}))})},v=a=>{const e=u(a,["action","spaReset","reloadDocument","onSubmit$"]),s=b();return l("form",{...e,children:m(p,null,3,"BC_0"),onSubmit$:d(()=>_(()=>Promise.resolve().then(()=>S),void 0),"s_p9MSze0ojs4",[s])},{action:"get","preventdefault:submit":r(t=>!t.reloadDocument,[a],"!p0.reloadDocument"),"data-spa-reset":r(t=>t.spaReset?"true":void 0,[a],'p0.spaReset?"true":undefined')},0,"BC_1")},S=Object.freeze(Object.defineProperty({__proto__:null,s_Nk9PlpjQm9Y:v,s_p9MSze0ojs4:f},Symbol.toStringTag,{value:"Module"}));export{v as s_Nk9PlpjQm9Y,f as s_p9MSze0ojs4};
