!function(t){function n(i){if(e[i])return e[i].exports;var c=e[i]={exports:{},id:i,loaded:!1};return t[i].call(c.exports,c,c.exports,n),c.loaded=!0,c.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}({0:function(t,n,e){"use strict";var i=e(261),c=window.splash=$("<div/>");c.width($(window).width()),c.height($(window).height()),c.css("background-color","#fff"),c.css("text-align","center"),c.css("display","table-cell"),c.css("vertical-align","middle"),$("body").append(c);var o=$('<img src="'+i+'"/>');o[0].width>c[0].clientWidth?(c.css("background-image",'url("'+i+'")'),c.css("background-position","center"),c.css("background-size",o.width+"px")):(o.css("width","80%"),c.append(o));var s=window.loadScript=function(t,n){jQuery.ajax({crossDomain:!0,dataType:"script",url:t,cache:!0,success:function(){"function"==typeof n&&n()},error:function(t){"function"==typeof n&&n(t)}})};$.get("manifest.json?t="+(new Date).getTime(),function(t){s(t["entry.js"])},"json")},261:function(t,n,e){t.exports=e.p+"company.jpg?dc7343d4519459a6151e805f84d6471f"}});