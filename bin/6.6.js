webpackJsonp([6],{153:function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e){return e.charAt(0).toUpperCase()+e.slice(1)}var l=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=(i(18),i(22)),r=(i(34),i(59)),s=(i(23),i(10),i(33)),c=i(154),d=(c.BeadPlate,c.BigRoad,c.BigEye,laya.net.Loader),u=laya.utils.Handler,h=function(){function e(t){n(this,e),this.opt=t}return l(e,[{key:"assignAllBtns",value:function(){for(var e=this,t=this._view._children,i=/[A-Za-z]\d+/,n=0;n<t.length;n++){var l=t[n].asButton;if(l instanceof fairygui.GButton){var a=function(){if(i.test(l.name))return"continue";var t=l.name.split("."),n=t[1]||1;t=t[0];var a=e._view.getController(t);a?(l.onClick(e,function(){a.selectedIndex=n}),a.setSelectedIndex(0)):l.onClick(e,function(){var e=o(t)+"Win";if(s[e])var i=new s[e];else var i=new s.Win(t);i.modal=!0,i.show()})}();if("continue"===a)continue}}}},{key:"active",value:function(){0==this._view.getController("isAdmin").selectedIndex&&this.enterGame()}},{key:"enterGame",value:function(){fairygui.GRoot.inst.showModalWait(),_socket.sendp({c:"alltables"}),netmsg.once("alltables",this,function(e){fairygui.GRoot.inst.closeModalWait(),console.log(e),this.tables=[];for(var t in e.tables)e.tables[t].roomid=t,this.tables.push(e.tables[t]);var i=this.tables.length;i>1&&console.log("桌子数量不唯一，请检查服务器以及数据库"),_socket.sendp({c:"join",code:this.tables[0].roomid})})}}],[{key:"create",value:function(t,n){"function"==typeof t&&(n=t,t={}),Laya.loader.load([{url:i(115),type:d.IMAGE},{url:i(116),type:d.IMAGE},{url:i(117),type:d.BUFFER}],u.create(null,function(){window.magiclink&&magiclink.reg(function(e){console.log("magiclink ret",e),_socket.sendp({c:"join",code:e})});var i=new e(t);fairygui.UIPackage.addPackage("baijiale"),fairygui.UIConfig.buttonSound=null,fairygui.UIConfig.buttonSoundVolumeScale=0;var o=i._view=fairygui.UIPackage.createObject("Package1","hall").asCom;o.getController("isAdmin").selectedIndex=a.isAdmin?1:0;var l=o.getChild("n33");l.removeChildren(),o.getChild("n34").onClick(null,function(){var e=o.getChild("n12").text,t=o.getChild("n7").text;return e||t?(_socket.sendp({c:"userInfo",id:e,nickname:t}),fairygui.GRoot.inst.showModalWait(),void netmsg.once("userInfo",null,function(e){fairygui.GRoot.inst.closeModalWait(),l.removeChildren();var t=fairygui.UIPackage.createObject("Package1","Component6");l.addChild(t),t.getChild("userInfo").getChild("n45").url=e.face,t.getChild("n4").text=e.nickname,t.getChild("n7").text=e.showId,t.getChild("n9").text=e.coins;var i=t.getChild("n10"),n=t.getChild("n11");e.block&&new Date(e.block)>new Date&&(i.selected=!0),e.nochat&&new Date(e.nochat)>new Date&&(n.selected=!0),t.getChild("n2").onClick(null,function(){var i=t.getChild("n3").text;i=Number(i),!isNaN(i)&&i&&(i<0&&!confirm("确定要减钱？？！")||(_socket.sendp({c:"admin.addcoins",userid:e.id,coins:i}),t.getChild("n3").text="",t.getChild("n9").text=Number(t.getChild("n9").text)+i))}),i.onClick(null,function(){_socket.sendp({c:"admin.block",userid:e.id,t:i.selected?315532748958:0})}),n.onClick(null,function(){_socket.sendp({c:"admin.nochat",userid:e.id,t:n.selected?315532748958:0})})})):(o.getChild("n12").displayObject.prompt="id或者昵称必须填写一个",o.getChild("n12").text="",void(o.getChild("n7").text=""))});var s=o.getChild("n49");s.setVirtual(),o.getChild("n47").onClick(null,function(){var e=o.getChild("n44").text,t=o.getChild("n40").text;if(e){if(e=new Date(e),"Invalid Date"==e)return o.getChild("n44").text="",void(o.getChild("n44").displayObject.prompt="类似2017-6-7 00:00:00")}else{var i=new Date;e=new Date(""+i.getFullYear()+"-"+(i.getMonth()+1)+"-1")}if(t){if(t=new Date(t),"Invalid Date"==t)return o.getChild("n44").text="",void(o.getChild("n44").displayObject.prompt="类似2017-6-7 12:00:00")}else t=new Date;fairygui.GRoot.inst.showModalWait(),_socket.sendp({c:"admin.addCoinsLog",start:e,end:t}),netmsg.once("admin.addCoinsLog",null,function(e){fairygui.GRoot.inst.closeModalWait(),s.itemRenderer=u.create(null,function(t,i){var n=e.logs[t];i.getChild("n1").text=r.toDateString(n.time),i.getChild("n3").text=n.targetName,i.getChild("n2").text="金豆"+n.coins,i.getChild("n4").text=n.operatorName},null,!1),s.numItems=e.logs.length;for(var t=0,i=0;i<e.logs.length;i++)e.logs[i].coins>0&&(t+=e.logs[i].coins);o.getChild("n51").text="总计 "+t})}),o.getChild("n3").onClick(i,i.enterGame),n(null,i)}))}}]),e}();e.exports=h.create},154:function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=i(60),r=function(){function e(t){n(this,e),this.view=t,this.roadBeadPlate=t.getChildAt(0).asCom,this.cols=this._orgCols=Math.max(9,Math.ceil(this.view.width/27)),this.roadBeadPlate.getChild("n90").asList.removeChildren()}return l(e,[{key:"refreshRoad",value:function(e){var t=this.roadBeadPlate.getChild("n90").asList;t.removeChildren();var i=Math.floor(e.length/6)+1,n=Math.max(i,this._orgCols);this.cols=n,i>=this._orgCols?this.view.scrollPane.setPosX(this.roadBeadPlate.width-this.view.width):this.view.scrollPane.setPosX(0);for(var o=t._children.length;o<e.length;o++){var l=fairygui.UIPackage.createObject("Package1","路格1"),a=e[o],r=l.getController("c1");if(r.selectedIndex=0,!a)return;"banker"==a.win?r.selectedIndex=1:"player"==a.win?r.selectedIndex=2:r.selectedIndex=3,a.demo?l.getTransition("t0").play():l.getTransition("t0").stop(),l.getChild("n6").visible=a.bankerPair,l.getChild("n7").visible=a.playerPair,t.addChild(l)}}},{key:"cols",get:function(){return this._cols},set:function(e){this._cols=e,this.roadBeadPlate.width=28*this._cols+1}}]),e}(),s=function(){function e(t){n(this,e),this.view=t,this.roadBig=t.getChildAt(0).asCom,this.cols=this._orgCols=Math.max(24,Math.ceil(this.view.width/13))}return l(e,[{key:"bigRoad",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=(t.columns,t.rows),n=void 0===i?6:i,o=[],l={},r=0,s=void 0,c=[],d=0;return e.forEach(function(e){if("tie"===e.win)o.push(e);else{if(s){var t=a.last(c);"tie"===s.win&&t&&(t.ties=a.cloneDeep(o),o=[],s=t.result),t&&s.win&&s.win!==e.win&&r++}for(var i=r,u=0,h=!1;!h;){var g=i+"."+u,f=i+"."+(u+1);if(a.get(l,g))u+1>=n?i++:a.get(l,f)?a.get(l,f).result.win===e.win?u++:i++:u++;else{var v=a.merge({},{row:u,column:i,logicalColumn:r,ties:a.cloneDeep(o)},{result:e});a.set(l,g,v),c.push(l[i][u]),h=!0}}o=[],d=Math.max(d,i)}s=e}),a.isEmpty(c)&&o.length>0?c.push({ties:a.cloneDeep(o),column:0,row:0,logicalColumn:0,result:{}}):!a.isEmpty(c)&&o.length&&(a.last(c).ties=a.cloneDeep(o)),c.maximumColumnReached=d,c}},{key:"logicalRoad",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=(t.columns,t.rows,[]),n=0,o=void 0;return e.forEach(function(e){"tie"!==e.win&&(o&&o.win&&o.win!==e.win&&n++,i[n]?i[n].push({result:e}):i[n]=[{result:e}],o=e)}),i}},{key:"refreshRoad",value:function(e){var t=this.roadBig,i=this.bigRoad(e),n=Math.max(i.maximumColumnReached,this._orgCols);this.cols=2*Math.floor(n/2)+2,i.maximumColumnReached>=this._orgCols?this.view.scrollPane.setPosX(this.roadBig.width-this.view.width):this.view.scrollPane.setPosX(0),t.removeChildren(2);for(var o=0;o<i.length;o++){var l=fairygui.UIPackage.createObject("Package1","路格2"),a=i[o].result,r=l.getController("c1");null==a.win?r.selectedIndex=0:"banker"==a.win?r.selectedIndex=1:"player"==a.win&&(r.selectedIndex=2),a.demo?l.getTransition("t0").play():l.getTransition("t0").stop(),l.getChild("n68").visible=a.bankerPair,l.getChild("n69").visible=a.playerPair,l.getChild("n72").visible=null!=i[o].ties&&i[o].ties.length>0,l.x=14*i[o].column+2,l.y=14*i[o].row+2,t.addChild(l)}}},{key:"cols",get:function(){return this._cols},set:function(e){this._cols=e,this.roadBig.width=14*this._cols+1}}]),e}(),c=function(){function e(t,i,o){n(this,e),this.view=t,this.road=t.getChildAt(0).asCom,this.circle=i||1,this.cols=this._orgCols=o||Math.max(24,Math.ceil(this.view.width/7))}return l(e,[{key:"makeResult",value:function(e,t){return e<=t?"red":e==t+1?"blue":"red"}},{key:"reverseResult",value:function(e){return"red"==e?"blue":"red"}},{key:"bigEye",value:function(e,t){for(var i=[],n=this.circle;n<e.length;n++){var o=e[n],l=n-this.circle,a=e[l].length-1,r=l-1;if(r>=0){var s=e[r].length-1,c=a+1;i.push(this.reverseResult(this.makeResult(c,s)))}for(var d=1;d<o.length;d++)i.push(this.makeResult(d,a))}return i[i.length-1]={color:i[i.length-1],isDemo:t},this.turn2Map(i)}},{key:"turn2Map",value:function(e){var t=6,i={},n=0,l=void 0,r=[],s=0;return e.forEach(function(e){var c;"object"==("undefined"==typeof e?"undefined":o(e))&&(c=e.isDemo,e=e.color),l&&l!=e&&n++;for(var d=n,u=0,h=!1;!h;){var g=d+"."+u,f=d+"."+(u+1);if(a.get(i,g))u+1>=t?d++:a.get(i,f)?a.get(i,f).result===e?u++:d++:u++;else{var v=a.merge({},{row:u,column:d,logicalColumn:n},{result:e,isDemo:c});a.set(i,g,v),r.push(i[d][u]),h=!0}}l=e,s=Math.max(s,d)}),r.maximumColumnReached=s,r}},{key:"refreshRoad",value:function(e,t){var i=this.road,n=this.bigEye(e,t),o=Math.max(n.maximumColumnReached,this._orgCols);this.cols=2*Math.round(o/2+1),n.maximumColumnReached>=this._orgCols?this.view.scrollPane.setPosX(i.width-this.view.width):this.view.scrollPane.setPosX(0),i.removeChildren(2);for(var l=0;l<n.length;l++){var a=fairygui.UIPackage.createObject("Package1","路格"+(2+this.circle)),r=n[l].result,s=n[l].isDemo,c=a.getController("c1");"red"==r?c.selectedIndex=0:c.selectedIndex=1,s?a.getTransition("t0").play():a.getTransition("t0").stop(),a.x=7*n[l].column+1,a.y=7*n[l].row+1,i.addChild(a)}}},{key:"cols",get:function(){return this._cols},set:function(e){this._cols=e,this.road.width=7*this._cols+1}}]),e}();e.exports={BeadPlate:r,BigRoad:s,BigEye:c}}});