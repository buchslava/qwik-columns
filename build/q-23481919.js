import{_ as C,z as H,m as M,e as N,K as V,y as W,w as J,P as Q,C as P,Y as X,S as k,g as u,X as q,U as Y,a as U,x as K,b as F}from"./q-1f2f0220.js";import{t as E,l as O,h as I,r as $,i as B,j as G,k as Z,c as ee,C as te,d as ne,D as ae,R as oe,e as se,f as re,m as ie}from"./q-71dc7120.js";const le=":root{view-transition-name:none}";const S=[[/^\/$/,[()=>C(()=>import("./q-7334007e.js"),["build/q-7334007e.js","build/q-1f2f0220.js"])]]],b=[];const T=!0;const ce=async(a,e)=>{const[l,o,n,d]=H();a===void 0?(a=o.value,o.value=""):e&&(o.value="");const i=new URL(a,d.url);if(a=E(i),!(!e&&o.value===a))return o.value=a,O(i,M()),I(S,b,T,i.pathname),l.value=void 0,d.isNavigating=!0,new Promise(s=>{n.r=s})},ue=({track:a})=>{const[e,l,o,n,d,i,s,v,w,r]=H();async function _(){const[h,m]=a(()=>[s.value,e.value]),L=N("");let t,f,A=null,D;{t=new URL(h,location),t.pathname.endsWith("/")||(t.pathname+="/");let g=I(S,b,T,t.pathname);D=M();const R=f=await O(t,D,!0,m);if(!R){s.untrackedValue=E(t);return}const y=R.href,c=new URL(y,t.href);c.pathname!==t.pathname&&(t=c,g=I(S,b,T,t.pathname)),A=await g}if(A){const[g,R,y]=A,c=R,j=c[c.length-1];r.prevUrl=r.url,r.url=t,r.params={...g},s.untrackedValue=E(t);const p=$(f,r,c,L);l.headings=j.headings,l.menu=y,o.value=V(c),n.links=p.links,n.meta=p.meta,n.styles=p.styles,n.title=p.title,n.frontmatter=p.frontmatter;{w.viewTransition!==!1&&(document.__q_view_transition__=!0);const z=f==null?void 0:f.loaders;z&&Object.assign(i,z),B.clear(),G(window,t,s),r.isNavigating=!1,v.r&&W(D).then(v.r)}}}_()},de=a=>{J(U(()=>C(()=>Promise.resolve().then(()=>x),void 0),"s_RPDJAz33WLA"));const e=Z();if(!(e!=null&&e.params))throw new Error("Missing Qwik City Env Data");const l=Q("url");if(!l)throw new Error("Missing Qwik URL Env Data");const o=new URL(l),n=P({url:o,params:e.params,isNavigating:!1,prevUrl:void 0},{deep:!1}),d={},i=X(P(e.response.loaders,{deep:!1})),s=k(E(o)),v=P(ee),w=P({headings:void 0,menu:void 0}),r=k(),_=e.response.action,h=_?e.response.loaders[_]:void 0,m=k(h?{id:_,data:e.response.formData,output:{result:h,status:e.response.status}}:void 0),L=U(()=>C(()=>Promise.resolve().then(()=>x),void 0),"s_fX0bDjeJa0E",[m,s,d,n]);return u(te,w),u(ne,r),u(ae,v),u(oe,n),u(se,L),u(re,i),u(ie,m),q(U(()=>C(()=>Promise.resolve().then(()=>x),void 0),"s_02wMImzEAbk",[m,w,r,v,e,i,s,d,a,n])),Y(K,null,3,"qY_0")},x=Object.freeze(Object.defineProperty({__proto__:null,_hW:F,s_02wMImzEAbk:ue,s_RPDJAz33WLA:le,s_TxCFOy819ag:de,s_fX0bDjeJa0E:ce},Symbol.toStringTag,{value:"Module"}));export{F as _hW,ue as s_02wMImzEAbk,le as s_RPDJAz33WLA,de as s_TxCFOy819ag,ce as s_fX0bDjeJa0E};
