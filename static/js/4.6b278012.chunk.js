(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{19:function(e,t,n){"use strict";n.r(t);var c=n(41),o=n(0),a=n.n(o),u=n(46),i=n.n(u),r=n(54);t.default=function(e){var t=Object(o.useState)(null),n=Object(c.a)(t,2),u=n[0],l=n[1],s=Object(o.useState)(0),f=Object(c.a)(s,2),b=f[0],h=f[1],m=Object(o.useState)(!1),d=Object(c.a)(m,2),j=d[0],O=d[1],v=null;Object(o.useEffect)(function(){var e="".concat("https://socketio-testing.herokuapp.com"),t=i()(e);return l(t),function(){}},[]),Object(o.useEffect)(function(){u&&(u.on("connect",function(){console.log("connected !"),u.emit("createRoom")}),u.on("updatePlayerCount",function(e){h(e)}),u.on("*",function(e){console.log(e)}))},[u]);return a.a.createElement("div",{className:"page homePage"},a.a.createElement(r.a,{onShake:function(){v&&clearTimeout(v),O(!0),v=setTimeout(function(){O(!1)},1e3)}}),"This is Home Page.",a.a.createElement("div",null,j?"shake":"nothing"),a.a.createElement("div",{onClick:function(){u.emit("test","hello")}},"playerCount: ",b),a.a.createElement("pre",null))}},53:function(e,t){},54:function(e,t,n){"use strict";var c=n(41),o=n(0),a=n.n(o);t.a=function(e){var t=Object(o.useState)(45),n=Object(c.a)(t,2),u=n[0],i=n[1],r=Object(o.useState)([null,null,null]),l=Object(c.a)(r,2),s=l[0],f=l[1],b=Object(o.useState)(0),h=Object(c.a)(b,2),m=h[0],d=h[1],j=Object(o.useCallback)(function(e){var t=e.alpha,n=e.beta,c=e.gamma;if(t&&n&&c){var o=Math.abs(t-s[0]),a=Math.abs(n-s[1]),i=Math.abs(c-s[2]);d(o+a+i>u?function(e){return e+1}:function(e){return Math.max(0,e-1)}),f([t,n,c])}},[u,s]);return Object(o.useEffect)(function(){return e.threshold&&i(e.threshold),function(){}},[e.threshold]),Object(o.useEffect)(function(){return window.addEventListener("deviceorientation",j,!1),function(){window.removeEventListener("deviceorientation",j,!1)}},[j]),Object(o.useEffect)(function(){m>2&&(console.log("SHAKE!!!"),e.onShake&&"function"===typeof e.onShake&&e.onShake(),d(0))},[m,e]),a.a.createElement("div",null)}}}]);
//# sourceMappingURL=4.6b278012.chunk.js.map