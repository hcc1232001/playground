(window.webpackJsonp=window.webpackJsonp||[]).push([[2,8],{20:function(e,t,n){"use strict";n.r(t);var c=n(119),o=n(42),a=n(0),r=n.n(a),u=n(47),i=n.n(u),l=n(98),f=n.n(l);n(36);t.default=function(e){var t=Object(a.useState)(null),n=Object(o.a)(t,2),u=n[0],l=n[1],s=Object(a.useState)([]),p=Object(o.a)(s,2),m=p[0],g=p[1];return Object(a.useEffect)(function(){var e="".concat("https://socketio-testing.herokuapp.com",":").concat(443),t=i()(e);return l(t),function(){}},[]),Object(a.useEffect)(function(){u&&(u.on("connect",function(){console.log("connected !"),u.emit("createRoom")}),u.on("playersInfo",function(e){console.log(e);for(var t=function(t){var n=t,o=e[n];f.a.toDataURL("http://10.0.1.111:3001/#/"+o.playerId,{width:300,color:{dark:"#000000FF",light:"#FFFFFFFF"}}).then(function(e){g(function(t){var a=Object(c.a)(t);return a[n]={url:"http://10.0.1.111:3001/#/"+o.playerId,img:e},a})})},n=0;n<e.length;n++)t(n)}),u.on("*",function(e){console.log(e)}))},[u]),r.a.createElement("div",{className:"page homePage"},m.map(function(e){if(!e.joined)return r.a.createElement("div",{key:e.url,className:"player-block"},r.a.createElement("a",{href:e.url,target:"_blank"},r.a.createElement("img",{src:e.img})))}))}},36:function(e,t,n){},54:function(e,t){}}]);
//# sourceMappingURL=2.eef77da4.chunk.js.map