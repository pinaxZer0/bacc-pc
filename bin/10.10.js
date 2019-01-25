webpackJsonp([10],{

/***/ 159:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _assert = __webpack_require__(163);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	'use strict';

	var async = __webpack_require__(18),
	    me = __webpack_require__(80),
	    printf = __webpack_require__(23),
	    etc = __webpack_require__(22),
	    fstr = etc.fstr,
	    fstr2num = etc.fstr2num,
	    EventEmitter = __webpack_require__(28),
	    clone = __webpack_require__(10);
	var wins = __webpack_require__(91);
	var ROAD = __webpack_require__(221),
	    BeadPlate = ROAD.BeadPlate,
	    BigRoad = ROAD.BigRoad,
	    BigEye = ROAD.BigEye;
	var toDateString = etc.toDateString;

	var Loader = laya.net.Loader;
	var Handler = laya.utils.Handler;

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var _mapOfDealSector = { 'xian': '闲', 'zhuang': '庄', 'he': '和', 'xianDui': '闲对', 'zhuangDui': '庄对' };
	function cardValues(cardarr) {
		var str = '';
		for (var i = 0; i < cardarr.length; i++) {
			switch (cardarr[i].sort) {
				case 11:
					str += 'J';
					break;
				case 12:
					str += 'Q';
					break;
				case 13:
					str += 'K';
					break;
				case 14:
					str += 'A';
					break;
				default:
					str += cardarr[i].sort;
			}
			str += ',';
		}
		return str.substr(0, -1);
	}
	function cardResult(cardarr) {
		var ret = 0;
		for (var i = 0; i < cardarr.length; i++) {
			var card = cardarr[i];
			if (card.description.toLowerCase() === 'ace') ret += 1;else if (card.sort >= 10) ret += 0;else ret += card.sort;
		}
		return ret % 10;
	}
	function parseR(r) {
		var str = '';
		if (r.win == 'player') str += '闲赢';else if (r.win == 'banker') str += '庄赢';else if (r.win == 'tie') str += '和赢';
		if (r.playerPair) str += ',闲对';
		if (r.bankerPair) str += ',庄对';
		return str;
	}

	var HallUI = function () {
		function HallUI(opt) {
			_classCallCheck(this, HallUI);

			this.opt = opt;
		}

		_createClass(HallUI, [{
			key: 'assignAllBtns',
			value: function assignAllBtns() {
				'use strict';

				var _this = this;

				var cl = this._view._children;
				var fairyguiNamedEle = /[A-Za-z]\d+/;
				for (var i = 0; i < cl.length; i++) {
					var btn = cl[i].asButton;
					if (btn instanceof fairygui.GButton) {
						var _ret = function () {
							if (fairyguiNamedEle.test(btn.name)) return 'continue';
							var _n = btn.name.split('.');
							var _idx = _n[1] || 1;
							_n = _n[0];
							var ctrl = _this._view.getController(_n);
							if (ctrl) {
								btn.onClick(_this, function () {
									ctrl.selectedIndex = _idx;
								});
								ctrl.setSelectedIndex(0);
							} else {
								btn.onClick(_this, function () {
									var candiName = capitalizeFirstLetter(_n) + 'Win';
									if (wins[candiName]) {
										var win = new wins[candiName]();
									} else var win = new wins.Win(_n);
									win.modal = true;
									win.show();
								});
							}
						}();

						if (_ret === 'continue') continue;
					}
				}
			}
		}, {
			key: 'active',
			value: function active() {
				var self = this;
				if (this._view.getController('isAdmin').selectedIndex == 0) this.enterGame();
			}
		}, {
			key: 'enterGame',
			value: function enterGame() {
				fairygui.GRoot.inst.showModalWait();
				_socket.sendp({ c: 'alltables' });
				netmsg.once('alltables', this, function (pack) {
					fairygui.GRoot.inst.closeModalWait();
					console.log(pack);
					this.tables = [];
					for (var id in pack.tables) {
						pack.tables[id].roomid = id;
						this.tables.push(pack.tables[id]);
					}
					var num = this.tables.length;
					if (num > 1) console.log('桌子数量不唯一，请检查服务器以及数据库');
					_socket.sendp({ c: 'join', code: this.tables[0].roomid });
				});
			}
		}], [{
			key: 'create',
			value: function create(opt, cb) {
				if (typeof opt === 'function') {
					cb = opt;opt = {};
				}
				Laya.loader.load([{ url: __webpack_require__(150), type: Loader.IMAGE }, { url: __webpack_require__(151), type: Loader.IMAGE }, { url: __webpack_require__(272), type: Loader.IMAGE }, { url: __webpack_require__(153), type: Loader.BUFFER }], Handler.create(null, function () {
					if (!!window.magiclink) {
						magiclink.reg(function (room) {
							console.log('magiclink ret', room);
							_socket.sendp({ c: 'join', code: room });
						});
					}
					var hall = new HallUI(opt);
					fairygui.UIPackage.addPackage("baijiale");
					fairygui.UIConfig.buttonSound = null;
					fairygui.UIConfig.buttonSoundVolumeScale = 0;
					var _view = hall._view = fairygui.UIPackage.createObject("Package1", "hall").asCom;

					if (!me.isAdmin) return cb(null, hall);

					_view.getController('isAdmin').selectedIndex = me.isAdmin ? 1 : 0;

					// 用户管理
					var l = _view.getChild('n33');
					l.removeChildren();
					_view.getChild('n34').onClick(null, function () {
						var uid = _view.getChild('n12').text,
						    nickname = _view.getChild('n7').text;
						if (uid || nickname) {
							_socket.sendp({ c: 'userInfo', id: uid, nickname: nickname });
						} else {
							_view.getChild('n12').displayObject.prompt = 'id或者昵称必须填写一个';
							_view.getChild('n12').text = '';
							_view.getChild('n7').text = '';
							return;
						}
						fairygui.GRoot.inst.showModalWait();
						netmsg.once('userInfo', null, function (pack) {
							fairygui.GRoot.inst.closeModalWait();
							l.removeChildren();
							var item = fairygui.UIPackage.createObject('Package1', 'Component6');
							l.addChild(item);
							item.getChild('userInfo').getChild('n45').url = pack.face;
							item.getChild('n4').text = pack.nickname;
							item.getChild('n7').text = pack.showId;
							item.getChild('n9').text = fstr(pack.coins);
							item.getChild('n19').text = fstr(pack.savedMoney || 0);
							item.getChild('n21').text = pack.regIP || '';
							item.getChild('n23').text = pack.lastIP || '';
							var typedCoins = item.getChild('n3');
							typedCoins.on('input', null, function () {
								var c = typedCoins.text.replace(/ /g, '');
								typedCoins.text = fstr(c);
							});
							var typedSaved = item.getChild('n16');
							typedSaved.on('input', null, function () {
								var c = typedSaved.text.replace(/ /g, '');
								typedSaved.text = fstr(c);
							});

							var btnBlk = item.getChild('n10'),
							    btnNcht = item.getChild('n11');
							if (pack.block && new Date(pack.block) > new Date()) btnBlk.selected = true;
							if (pack.nochat && new Date(pack.nochat) > new Date()) btnNcht.selected = true;
							//add coins
							item.getChild('n2').onClick(null, function () {
								var c = item.getChild('n3').text.replace(/ /g, '');
								c = Number(c);
								if (isNaN(c) || !c) return;
								var curcoins = fstr2num(item.getChild('n9').text);
								if (c < 0) {
									if (!confirm('确定要减钱？？！')) return;
									if (curcoins + c < 0) {
										tipon('减分过多，自动调整成' + -curcoins).popup();
										c = -curcoins;
									}
								}
								if (c == 0) {
									item.getChild('n3').text = '';
									return;
								}
								_socket.sendp({ c: 'admin.addcoins', userid: pack.id, coins: c });
								netmsg.once('admin.addcoins', null, function (pack) {
									if (pack.err) return;
									item.getChild('n3').text = '';
									// if (newcoin<0) newcoin=0;
									item.getChild('n9').text = fstr(pack.newcoin);
								});
							});
							// add saved
							item.getChild('n15').onClick(null, function () {
								var c = typedSaved.text.replace(/ /g, '');
								c = Number(c);
								if (isNaN(c) || !c) return;
								var curcoins = fstr2num(item.getChild('n19').text);
								if (c < 0) {
									if (!confirm('确定要减钱？？！')) return;
									if (curcoins + c < 0) {
										tipon('减分过多，自动调整成' + -curcoins).popup();
										c = -curcoins;
									}
								}
								if (c == 0) {
									typedSaved.text = '';
									return;
								}
								_socket.sendp({ c: 'admin.addsaved', userid: pack.id, coins: c });
								netmsg.once('admin.addsaved', null, function (pack) {
									if (pack.err) return;
									typedSaved.text = '';
									// if (newcoin<0) newcoin=0;
									item.getChild('n19').text = fstr(pack.newcoin);
								});
							});

							// block account
							btnBlk.onClick(null, function () {
								_socket.sendp({ c: 'admin.block', userid: pack.id, t: btnBlk.selected ? 315532748958 : 0 });
							});
							// forbid chat
							btnNcht.onClick(null, function () {
								_socket.sendp({ c: 'admin.nochat', userid: pack.id, t: btnNcht.selected ? 315532748958 : 0 });
							});
							item.getChild('n13').onClick(null, function () {
								_socket.sendp({ c: 'admin.resetpwd', userid: pack.id });
								netmsg.once('admin.resetpwd', null, function (pack) {
									if (pack.err) return;
									prompt('密码已修改，请复制之后发给玩家', pack.newpwd);
								});
							});
							item.getChild('n14').onClick(null, function () {
								_socket.sendp({ c: 'admin.resetsecpwd', userid: pack.id });
								netmsg.once('admin.resetsecpwd', null, function (pack) {
									if (pack.err) return;
									tipon('密保已重置').popup();
								});
							});
						});
					});

					// 加豆纪录
					var log = _view.getChild('n49');
					log.setVirtual();
					_view.getChild('n47').onClick(null, function () {
						var start = _view.getChild('n44').text,
						    end = _view.getChild('n40').text;
						if (!start) {
							var date = new Date();
							start = new Date('' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-1');
						} else {
							start = new Date(start);
							if (start == 'Invalid Date') {
								_view.getChild('n44').text = '';
								_view.getChild('n44').displayObject.prompt = '类似2017-6-7 00:00:00';
								return;
							}
						}
						if (!end) {
							end = new Date();
						} else {
							end = new Date(end);
							if (end == 'Invalid Date') {
								_view.getChild('n44').text = '';
								_view.getChild('n44').displayObject.prompt = '类似2017-6-7 12:00:00';
								return;
							}
						}

						fairygui.GRoot.inst.showModalWait();
						_socket.sendp({ c: 'admin.addCoinsLog', start: start, end: end });
						netmsg.once('admin.addCoinsLog', null, function (pack) {
							fairygui.GRoot.inst.closeModalWait();
							log.itemRenderer = Handler.create(null, function (idx, obj) {
								var item = pack.logs[idx];
								obj.getChild('n1').text = etc.toDateString(item.time);
								obj.getChild('n3').text = item.targetName;
								obj.getChild('n2').text = fstr(item.coins);
								obj.getChild('n4').text = item.operatorName;
								obj.getChild('n5').text = item.type || '';
							}, null, false);
							log.numItems = pack.logs.length;

							var total = 0;
							for (var i = 0; i < pack.logs.length; i++) {
								total += pack.logs[i].coins;
							}
							_view.getChild('n51').text = '总计 ' + fstr(total);
							_view.getChild('n56').onClick(null, function () {
								window.open(getAbsUrl('pf/bacc.hori/downxlsx') + '?token=' + pack.token + '&userid=' + me.id);
							});
						});
					});

					// 转账记录
					(function () {
						var log = _view.getChild('n75');
						log.setVirtual();
						var _data, jumpToPage, handleTranslog;
						log.itemRenderer = Handler.create(null, function (idx, obj) {
							var item = _data.d[idx];
							if (obj._clickHandler) obj.offClick(null, obj._clickHandler);
							obj._clickHandler = function () {
								// jump to 用户管理
								_view.getController('c1').selectedIndex = 0;
								_view.getChild('n12').text = item.showId;
								_view.getChild('n7').text = item.nickname;
								_view.getChild('n34').displayObject.event('click');
							};
							obj.onClick(null, obj._clickHandler);
							if (!item) {
								obj.getChild('n1').text = '--';
								obj.getChild('n3').text = '--';
								obj.getChild('n4').text = '';
								obj.getChild('n2').text = '';
								obj.getChild('n5').text = '';
							} else {
								obj.getChild('n1').text = etc.toDateString(item._t);
								obj.getChild('n3').text = item.nickname + ' ID:' + item.showId;
								obj.getChild('n4').text = fstr(item.coins);
								obj.getChild('n2').text = item.act;
								obj.getChild('n5').text = item.ip || '';
							}
						}, null, false);
						_view.getChild('n93').onClick(null, function () {
							var page = Number(_view.getChild('n98').text) - 1;
							jumpToPage && jumpToPage(page);
						});
						_view.getChild('n94').onClick(null, function () {
							var page = Number(_view.getChild('n98').text) + 1;
							jumpToPage && jumpToPage(page);
						});

						_view.getChild('n73').onClick(null, function () {
							netmsg.off('admin.translog', null, handleTranslog);
							_view.getChild('n98').off('enter', null, jumpToPage);
							_view.getChild('n98').off('blur', null, jumpToPage);

							var start = _view.getChild('n70').text,
							    end = _view.getChild('n66').text;
							if (!start) {
								var date = new Date();
								start = new Date('' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate());
							} else {
								start = new Date(start);
								if (start == 'Invalid Date') {
									_view.getChild('n70').text = '';
									_view.getChild('n70').displayObject.prompt = '类似2017-6-7 00:00:00';
									return;
								}
							}
							if (!end) {
								end = new Date();
							} else {
								end = new Date(end);
								if (end == 'Invalid Date') {
									_view.getChild('n66').text = '';
									_view.getChild('n66').displayObject.prompt = '类似2017-6-7 12:00:00';
									return;
								}
							}
							var uid = _view.getChild('n89').text,
							    nickname = _view.getChild('n85').text;

							fairygui.GRoot.inst.showModalWait();
							_socket.sendp({ c: 'admin.translog', start: start, end: end, showId: uid, nickname: nickname });
							handleTranslog = function handleTranslog(pack) {
								fairygui.GRoot.inst.closeModalWait();
								_data = pack;
								_view.getChild('n99').text = '/' + Math.ceil(pack.len / pack.ps);
								_view.getChild('n98').text = Math.floor(pack.from / pack.ps) + 1;
								log.numItems = pack.d.length;
							};
							hall._nmh = { 'admin.translog': handleTranslog };
							netmsg.on('admin.translog', null, handleTranslog);

							jumpToPage = function jumpToPage(wp) {
								var wp = wp || Number(_view.getChild('n98').text);
								if (!wp) return;
								if (!_data) return;
								if (wp > Math.ceil(_data.len / _data.ps)) {
									wp = Math.ceil(_data.len / _data.ps);
									_view.getChild('n98').text = wp.toString();
								}
								_socket.sendp({ c: 'admin.translog', start: start, end: end, showId: uid, nickname: nickname, setfrom: (wp - 1) * _data.ps });
							};
							_view.getChild('n98').on('enter', null, jumpToPage);
							_view.getChild('n98').on('blur', null, jumpToPage);
						});
					})();

					// 金豆排行/保险柜排行
					(function () {
						var handler;
						function getBoard(type, cb) {
							fairygui.GRoot.inst.showModalWait();
							netmsg.off('board', null, handler);
							_socket.sendp({ c: 'board', type: type });
							netmsg.once('board', null, cb);
							handler = cb;
						}
						function fillBoard(ele, type, data) {
							fairygui.GRoot.inst.closeModalWait();
							ele.itemRenderer = Handler.create(null, function (idx, obj) {
								if (obj._clickHandler) obj.offClick(null, obj._clickHandler);
								obj._clickHandler = function () {
									// jump to 用户管理
									_view.getController('c1').selectedIndex = 0;
									_view.getChild('n12').text = item.showId;
									_view.getChild('n7').text = item.nickname;
									_view.getChild('n34').displayObject.event('click');
								};
								obj.onClick(null, obj._clickHandler);
								var item = data.board[idx];
								obj.getChild('n3').text = item.nickname + ' ID:' + item.showId;
								obj.getChild('n2').text = item[data.type];
								obj.getChild('n4').text = item.regIP || '';
								obj.getChild('n6').text = item.lastIP || '';
								obj.getChild('n1').text = etc.toDateString(item.loginTime);
							}, null, false);
							ele.numItems = data.board.length;
						}
						var c = _view.getController('c1');
						_view.getChild('n113').setVirtual();
						_view.getChild('n135').setVirtual();
						c.on('fui_state_changed', null, function () {
							switch (c.selectedIndex) {
								case 4:
									getBoard('coins', fillBoard.bind(null, _view.getChild('n113'), 'coins'));
									break;
								case 5:
									getBoard('savedMoney', fillBoard.bind(null, _view.getChild('n135'), 'savedMoney'));
									break;
							}
						});
					})();

					// 服务器管理
					(function () {
						var list = _view.getChild('n144');
						list.removeChildren();
						var item = fairygui.UIPackage.createObject('Package1', '服务器管理item');
						item.getChild('n3').text = '';
						item.getChild('n2').text = '';
						var btnChat = item.getChild('n7'),
						    btnEnter = item.getChild('n8');
						btnChat.selected = false;
						btnEnter.selected = false;
						btnChat.onClick(null, function () {
							_socket.sendp({ c: 'admin.srv.chat', v: !btnChat.selected });
						});
						btnEnter.onClick(null, function () {
							_socket.sendp({ c: 'admin.srv.enter', v: !btnEnter.selected });
						});
						list.addChild(item);
						fairygui.GRoot.inst.showModalWait();
						_socket.sendp({ c: 'admin.srv.ls' });
						netmsg.on('admin.srv.ls', null, function (pack) {
							fairygui.GRoot.inst.closeModalWait();
							item.getChild('n3').text = '服务器1区';
							item.getChild('n2').text = '金豆' + pack.total_profit;
							btnChat.selected = !pack.canchat;
							btnEnter.selected = !pack.canenter;
						});

						// 服务器税收
						var coinslist = _view.getChild('n151');
						coinslist.removeChildren();
						fairygui.GRoot.inst.showModalWait();
						_socket.sendp({ c: 'admin.srv.coinstat' });
						netmsg.once('admin.srv.coinstat', null, function (pack) {
							fairygui.GRoot.inst.closeModalWait();
							for (var i = 0; i < pack.items.length; i++) {
								var item = fairygui.UIPackage.createObject('Package1', '金豆item');
								var data = pack.items[i];
								if (i < pack.items.length - 1) {
									var n = pack.items[i + 1],
									    wanted = n.totalcoins + n.adminAdd - n.profit;
									if (wanted < data.totalcoins) item.getChild('n2').color = 'red';else if (wanted > data.totalcoins) item.getChild('n2').color = 'green';
								}
								item.getChild('n3').text = etc.toDateString(data.time);
								item.getChild('n2').text = fstr(data.totalcoins);
								item.getChild('n9').text = fstr(-data.profit);
								item.getChild('n10').text = fstr(data.adminAdd);
								coinslist.addChild(item);
							}
						});
					}
					// admin管理

					// 玩家金豆log
					)()(function () {
						var list = _view.getChild('n169');
						_view.getChild('n165').onClick(null, function () {
							var uid = _view.getChild('n162').text,
							    nickname = _view.getChild('n158').text,
							    time = _view.getChild('n179').text;
							if (uid || nickname) {
								if (time) {
									var now = new Date();
									time = time.trim();
									var posOfSplash = time.indexOf('~');
									if (posOfSplash >= 0) {
										var endstring = time.substring(posOfSplash + 1);
										var startstring = time.substr(0, posOfSplash);
									} else {
										var startstring = time;
									}
									var start, end;
									var datestring = null;
									if (startstring) {
										var r = startstring.match(/(\d{2,4}[-\/\\]\d{1,2}[-\/\\]\d{1,2})/);
										if (r) {
											datestring = r[1];
											start = Date.parse(startstring);
										} else {
											datestring = toDateString(now, true);
											start = Date.parse(datestring + ' ' + startstring);
										}
									}
									if (endstring) {
										var r = endstring.match(/(\d{2,4}[-\/\\]\d{1,2}[-\/\\]\d{1,2})/);
										if (r) {
											datestring = r[1];
											end = Date.parse(endstring);
										} else {
											if (datestring) end = Date.parse(datestring + ' ' + endstring);else end = Date.parse(toDateString(now, true) + ' ' + endstring);
										}
									}
								}
								_socket.sendp({ c: 'usercoinlog', id: uid, nickname: nickname, start: start, end: end });
							} else {
								_view.getChild('n162').displayObject.prompt = 'id或者昵称必须填写一个';
								_view.getChild('n162').text = '';
								_view.getChild('n158').text = '';
								return;
							}
							list.removeChildren();
							fairygui.GRoot.inst.showModalWait();
							netmsg.once('usercoinlog', null, function (pack) {
								fairygui.GRoot.inst.closeModalWait();
								for (var i = 0; i < pack.data.length; i++) {
									var data = pack.data[i];
									var item = fairygui.UIPackage.createObject('Package1', 'Component2');
									item.getChild('n17').text = toDateString(data.t);
									item.getChild('n46').text = '现:' + fstr(data.snapshot.coins);
									item.getChild('n50').text = '保:' + fstr(data.snapshot.savedMoney);
									item.getChild('n44').text = '现:' + fstr(data.result.coins);
									item.getChild('n48').text = '保:' + fstr(data.result.savedMoney);
									item.getChild('n22').text = fstr(data.delta);
									var game = data.game;
									if (game) {
										item.getController('c1').selectedIndex = 0;
										var eleNo = 0;
										for (var k in game.deal) {
											var d = game.deal[k];
											if (d) {
												item.getChild('r' + eleNo).text = _mapOfDealSector[k];
												item.getChild('r' + (eleNo + 1)).text = fstr(d);
												eleNo += 2;
											}
										}
										item.getChild('n28').text = data.desc;
										item.getChild('n36').text = '庄' + cardValues(game.r.bankerCard);
										item.getChild('n38').text = '闲' + cardValues(game.r.playerCard);
										item.getChild('n40').text = '庄' + cardResult(game.r.bankerCard) + '点';
										item.getChild('n45').text = '闲' + cardResult(game.r.playerCard) + '点';
										item.getChild('n42').text = parseR(game.r);
									} else {
										item.getController('c1').selectedIndex = 1;
										item.getChild('n54').text = data.desc;
									}
									list.addChild(item);
								}
							});
						});
					})();
					// _view.getController('c1').on

					// 进入游戏
					_view.getChild('n3').onClick(hall, hall.enterGame);
					// quit
					_view.getChild('n62').onClick(null, function () {
						main({ showlogin: true });
					});
					cb(null, hall);
				}));
			}
		}]);

		return HallUI;
	}();

	module.exports = HallUI.create;

/***/ },

/***/ 163:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
	// original notice:

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	function compare(a, b) {
	  if (a === b) {
	    return 0;
	  }

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }

	  if (x < y) {
	    return -1;
	  }
	  if (y < x) {
	    return 1;
	  }
	  return 0;
	}
	function isBuffer(b) {
	  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
	    return global.Buffer.isBuffer(b);
	  }
	  return !!(b != null && b._isBuffer);
	}

	// based on node assert, original notice:

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	var util = __webpack_require__(164);
	var hasOwn = Object.prototype.hasOwnProperty;
	var pSlice = Array.prototype.slice;
	var functionsHaveNames = (function () {
	  return function foo() {}.name === 'foo';
	}());
	function pToString (obj) {
	  return Object.prototype.toString.call(obj);
	}
	function isView(arrbuf) {
	  if (isBuffer(arrbuf)) {
	    return false;
	  }
	  if (typeof global.ArrayBuffer !== 'function') {
	    return false;
	  }
	  if (typeof ArrayBuffer.isView === 'function') {
	    return ArrayBuffer.isView(arrbuf);
	  }
	  if (!arrbuf) {
	    return false;
	  }
	  if (arrbuf instanceof DataView) {
	    return true;
	  }
	  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
	    return true;
	  }
	  return false;
	}
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	var regex = /\s*function\s+([^\(\s]*)\s*/;
	// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
	function getName(func) {
	  if (!util.isFunction(func)) {
	    return;
	  }
	  if (functionsHaveNames) {
	    return func.name;
	  }
	  var str = func.toString();
	  var match = str.match(regex);
	  return match && match[1];
	}
	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  } else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      // try to strip useless frames
	      var fn_name = getName(stackStartFunction);
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }

	      this.stack = out;
	    }
	  }
	};

	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);

	function truncate(s, n) {
	  if (typeof s === 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	function inspect(something) {
	  if (functionsHaveNames || !util.isFunction(something)) {
	    return util.inspect(something);
	  }
	  var rawname = getName(something);
	  var name = rawname ? ': ' + rawname : '';
	  return '[Function' +  name + ']';
	}
	function getMessage(self) {
	  return truncate(inspect(self.actual), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(inspect(self.expected), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
	  }
	};

	function _deepEqual(actual, expected, strict, memos) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (isBuffer(actual) && isBuffer(expected)) {
	    return compare(actual, expected) === 0;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if ((actual === null || typeof actual !== 'object') &&
	             (expected === null || typeof expected !== 'object')) {
	    return strict ? actual === expected : actual == expected;

	  // If both values are instances of typed arrays, wrap their underlying
	  // ArrayBuffers in a Buffer each to increase performance
	  // This optimization requires the arrays to have the same type as checked by
	  // Object.prototype.toString (aka pToString). Never perform binary
	  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
	  // bit patterns are not identical.
	  } else if (isView(actual) && isView(expected) &&
	             pToString(actual) === pToString(expected) &&
	             !(actual instanceof Float32Array ||
	               actual instanceof Float64Array)) {
	    return compare(new Uint8Array(actual.buffer),
	                   new Uint8Array(expected.buffer)) === 0;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else if (isBuffer(actual) !== isBuffer(expected)) {
	    return false;
	  } else {
	    memos = memos || {actual: [], expected: []};

	    var actualIndex = memos.actual.indexOf(actual);
	    if (actualIndex !== -1) {
	      if (actualIndex === memos.expected.indexOf(expected)) {
	        return true;
	      }
	    }

	    memos.actual.push(actual);
	    memos.expected.push(expected);

	    return objEquiv(actual, expected, strict, memos);
	  }
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b, strict, actualVisitedObjects) {
	  if (a === null || a === undefined || b === null || b === undefined)
	    return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b))
	    return a === b;
	  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
	    return false;
	  var aIsArgs = isArguments(a);
	  var bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b, strict);
	  }
	  var ka = objectKeys(a);
	  var kb = objectKeys(b);
	  var key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length !== kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] !== kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
	      return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	assert.notDeepStrictEqual = notDeepStrictEqual;
	function notDeepStrictEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	  }
	}


	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  }

	  try {
	    if (actual instanceof expected) {
	      return true;
	    }
	  } catch (e) {
	    // Ignore.  The instanceof check doesn't work for arrow functions.
	  }

	  if (Error.isPrototypeOf(expected)) {
	    return false;
	  }

	  return expected.call({}, actual) === true;
	}

	function _tryBlock(block) {
	  var error;
	  try {
	    block();
	  } catch (e) {
	    error = e;
	  }
	  return error;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (typeof block !== 'function') {
	    throw new TypeError('"block" argument must be a function');
	  }

	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }

	  actual = _tryBlock(block);

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  var userProvidedMessage = typeof message === 'string';
	  var isUnwantedException = !shouldThrow && util.isError(actual);
	  var isUnexpectedException = !shouldThrow && actual && !expected;

	  if ((isUnwantedException &&
	      userProvidedMessage &&
	      expectedException(actual, expected)) ||
	      isUnexpectedException) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws(true, block, error, message);
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	  _throws(false, block, error, message);
	};

	assert.ifError = function(err) { if (err) throw err; };

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(165);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(166);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(9)))

/***/ },

/***/ 165:
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },

/***/ 166:
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },

/***/ 221:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _ = __webpack_require__(92);

	var BeadPlate = function () {
		/**
	  * 
	  * @param {fairygui.GObject} view 
	  */
		function BeadPlate(view) {
			_classCallCheck(this, BeadPlate);

			this.view = view; //.getChild('n2').getChild('n17').getChild('n1');
			this.roadBeadPlate = view.getChildAt(0).asCom;
			this.cols = this._orgCols = Math.max(9, Math.ceil(this.view.width / 27));
			this.roadBeadPlate.getChild('n90').asList.removeChildren();

			var self = this;
		}

		_createClass(BeadPlate, [{
			key: 'refreshRoad',
			value: function refreshRoad(his) {
				var road = this.roadBeadPlate.getChild('n90').asList;
				road.removeChildren();
				// if (his.length<road._children.length) {
				// 	road.removeChildren();
				// 	// this.cols=this._orgCols;
				// 	// return;
				// }
				var curCol = Math.floor(his.length / 6) + 1;
				var width = Math.max(curCol, this._orgCols);
				// if (width>this.cols) {
				this.cols = width;
				if (curCol >= this._orgCols) this.view.scrollPane.setPosX(this.roadBeadPlate.width - this.view.width);else this.view.scrollPane.setPosX(0);
				// }
				for (var i = road._children.length; i < his.length; i++) {
					var obj = fairygui.UIPackage.createObject('Package1', '路格1');
					var pan = his[i];
					var winCtrl = obj.getController('c1');
					winCtrl.selectedIndex = 0;
					if (!pan) return;
					if (pan.win == 'banker') winCtrl.selectedIndex = 1;else if (pan.win == 'player') winCtrl.selectedIndex = 2;else winCtrl.selectedIndex = 3;
					if (pan.demo) obj.getTransition('t0').play();else obj.getTransition('t0').stop();

					obj.getChild('n6').visible = pan.bankerPair;
					obj.getChild('n7').visible = pan.playerPair;
					road.addChild(obj);
				}
			}
		}, {
			key: 'cols',
			get: function get() {
				return this._cols;
			},
			set: function set(n) {
				this._cols = n;
				this.roadBeadPlate.width = 28 * this._cols + 1;
			}
		}]);

		return BeadPlate;
	}();

	var BigRoad = function () {
		function BigRoad(view) {
			_classCallCheck(this, BigRoad);

			this.view = view; //.getChild('n2').getChild('n19').getChild('n19');
			this.roadBig = view.getChildAt(0).asCom;
			this.cols = this._orgCols = Math.max(24, Math.ceil(this.view.width / 13));
			var self = this;
		}

		_createClass(BigRoad, [{
			key: 'bigRoad',
			value: function bigRoad() {
				var gameResults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

				var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
				    _ref$columns = _ref.columns,
				    columns = _ref$columns === undefined ? 12 : _ref$columns,
				    _ref$rows = _ref.rows,
				    rows = _ref$rows === undefined ? 6 : _ref$rows;

				var tieStack = [];
				var placementMap = {};
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;

				gameResults.forEach(function (gameResult) {
					if (!gameResult) {
						return;
					}
					if (gameResult.win === 'tie') {
						tieStack.push(gameResult);
					} else {
						if (lastItem) {
							// Add the ties that happened inbetween the last placed big road item
							// and this new big road item to the last entered big road item.
							var lastItemInResults = _.last(returnList);
							if (lastItem.win === 'tie') {
								if (lastItemInResults) {
									lastItemInResults.ties = _.cloneDeep(tieStack);
									tieStack = [];
									lastItem = lastItemInResults.result;
								}
								// else lastItem.win=null;
							}
							if (lastItemInResults) {
								// If this item is different from the outcome of the last game
								// then we must place it in another column
								if (lastItem.win && lastItem.win !== gameResult.win) {
									logicalColumnNumber++;
								}
							}
						}

						var probeColumn = logicalColumnNumber;
						var probeRow = 0;
						var done = false;

						while (!done) {
							var keySearch = probeColumn + '.' + probeRow;
							var keySearchBelow = probeColumn + '.' + (probeRow + 1);

							// Position available at current probe location
							if (!_.get(placementMap, keySearch)) {
								var newEntry = _.merge({}, {
									row: probeRow,
									column: probeColumn,
									logicalColumn: logicalColumnNumber,
									ties: _.cloneDeep(tieStack)
								}, { result: gameResult });
								_.set(placementMap, keySearch, newEntry);
								returnList.push(placementMap[probeColumn][probeRow]);

								done = true;
							}
							// The spot below would go beyond the table bounds.
							else if (probeRow + 1 >= rows) {
									probeColumn++;
								}
								// The spot below is empty.
								else if (!_.get(placementMap, keySearchBelow)) {
										probeRow++;
									}
									// The result below is the same outcome.
									else if (_.get(placementMap, keySearchBelow).result.win === gameResult.win) {
											probeRow++;
										} else {
											probeColumn++;
										}
						}
						tieStack = [];
						maximumColumnReached = Math.max(maximumColumnReached, probeColumn);
					}

					lastItem = gameResult;
				});
				// There were no outcomes added to the placement map.
				// We only have ties.
				if (_.isEmpty(returnList) && tieStack.length > 0) {
					returnList.push({
						ties: _.cloneDeep(tieStack),
						column: 0,
						row: 0,
						logicalColumn: 0,
						result: {} });
				} else if (!_.isEmpty(returnList) && tieStack.length) {
					_.last(returnList).ties = _.cloneDeep(tieStack);
				}

				returnList.maximumColumnReached = maximumColumnReached;
				return returnList;
			}
		}, {
			key: 'logicalRoad',
			value: function logicalRoad() {
				var gameResults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

				var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
				    _ref2$columns = _ref2.columns,
				    columns = _ref2$columns === undefined ? 12 : _ref2$columns,
				    _ref2$rows = _ref2.rows,
				    rows = _ref2$rows === undefined ? 6 : _ref2$rows;

				var tieStack = [];
				var placementMap = [];
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;

				// Build the logical column definitions that doesn't represent
				// the actual "drawn" roadmap.
				gameResults.forEach(function (gameResult) {
					if (gameResult.win === 'tie') return;else {
						if (lastItem) {
							// Add the ties that happened inbetween the last placed big road item
							// and this new big road item to the last entered big road item.
							// If this item is different from the outcome of the last game
							// then we must place it in another column
							if (lastItem.win && lastItem.win !== gameResult.win) {
								logicalColumnNumber++;
							}
						}

						if (!placementMap[logicalColumnNumber]) placementMap[logicalColumnNumber] = [{ result: gameResult }];else placementMap[logicalColumnNumber].push({ result: gameResult });
					}

					lastItem = gameResult;
				});
				return placementMap;
			}
		}, {
			key: 'refreshRoad',
			value: function refreshRoad(his) {
				var road = this.roadBig;
				// var data=this.bigRoad(his);
				var data = this.bigRoad(his);
				var width = Math.max(data.maximumColumnReached, this._orgCols);
				// if (width>this.cols) {
				this.cols = Math.floor(width / 2) * 2 + 2;
				if (data.maximumColumnReached >= this._orgCols) this.view.scrollPane.setPosX(this.roadBig.width - this.view.width);else this.view.scrollPane.setPosX(0);
				// }
				// if(his.length==0) 
				// if (data.maximumColumnReached>=this.cols-1) {
				// 	this.cols=Math.floor(data.maximumColumnReached/2)*2+2;
				// 	this.view.scrollPane.setPosX(this.roadBig.width-this.view.width);
				// }
				road.removeChildren(2);
				for (var i = 0; i < data.length; i++) {
					var obj = fairygui.UIPackage.createObject('Package1', '路格2');
					var pan = data[i].result;
					var winCtrl = obj.getController('c1');
					if (pan.win == null) winCtrl.selectedIndex = 0;else if (pan.win == 'banker') winCtrl.selectedIndex = 1;else if (pan.win == 'player') winCtrl.selectedIndex = 2;
					if (pan.demo) obj.getTransition('t0').play();else obj.getTransition('t0').stop();

					obj.getChild('n68').visible = pan.bankerPair;
					obj.getChild('n69').visible = pan.playerPair;
					obj.getChild('n72').visible = data[i].ties != null && data[i].ties.length > 0;
					obj.x = data[i].column * 14 + 2;
					obj.y = data[i].row * 14 + 2;
					road.addChild(obj);
				}
			}
		}, {
			key: 'cols',
			get: function get() {
				return this._cols;
			},
			set: function set(n) {
				this._cols = n;
				this.roadBig.width = 14 * this._cols + 1;
			}
		}]);

		return BigRoad;
	}();

	var cardScore = function cardScore(cards) {
		var ret = 0;
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i];
			if (card.description.toLowerCase() === 'ace') ret += 1;else if (card.sort >= 10) ret += 0;else ret += card.sort;
		}
		return (ret % 10).toString();
	};

	var OldstyleRoad = function () {
		function OldstyleRoad(view) {
			_classCallCheck(this, OldstyleRoad);

			var self = this;
			this.view = view; //.getChild('n2').getChild('n19').getChild('n19');
			this.roadOld = view.getChild('n1').asList;
			this.roadOld.setVirtual();
			this.roadOld.itemRenderer = Laya.Handler.create(null, function (i, obj) {
				obj.getChild('n98').text = '';
				obj.getChild('n99').text = '';
				obj.getController('c1').selectedIndex = obj.getController('c2').selectedIndex = obj.getController('c3').selectedIndex = 0;
				var pan = self._his[i];
				if (!pan) return;
				obj.getChild('n98').text = cardScore(pan.bankerCard);
				obj.getChild('n99').text = cardScore(pan.playerCard);
				var userZhu = 0;
				if (pan.deal) {
					if (!isNaN(pan.deal.zhuang || 0) && !isNaN(pan.deal.xian || 0)) userZhu = (pan.deal.zhuang || 0) - (pan.deal.xian || 0);
				}
				if (pan.win == 'banker') {
					if (userZhu > 0) obj.getController('c1').selectedIndex = 1;else if (userZhu == 0) obj.getController('c1').selectedIndex = 2;else obj.getController('c1').selectedIndex = 3;
				}
				if (pan.win == 'tie') {
					if (pan.deal && pan.deal.he) obj.getController('c3').selectedIndex = 1;else obj.getController('c3').selectedIndex = 2;
				}
				if (pan.win == 'player') {
					if (userZhu < 0) obj.getController('c2').selectedIndex = 1;else if (userZhu == 0) obj.getController('c2').selectedIndex = 2;else obj.getController('c2').selectedIndex = 3;
				}
				// if (pan.deal) {
				// 	if (pan.deal.zhuang) {
				// 		if (pan.win=='banker') obj.getController('c1').selectedIndex=1;
				// 		else obj.getController('c1').selectedIndex=2;
				// 	}
				// 	if (pan.deal.he) {
				// 		if (pan.win=='tie') obj.getController('c3').selectedIndex=1;
				// 		else obj.getController('c3').selectedIndex=2;
				// 	}
				// 	if (pan.deal.xian) {
				// 		if (pan.win=='player') obj.getController('c2').selectedIndex=1;
				// 		else obj.getController('c2').selectedIndex=2;
				// 	}
				// }
			}, null, false);
			this._his = [];
			this.roadOld.numItems = this._orgCols = Math.ceil(this.roadOld.width / 17);
		}

		_createClass(OldstyleRoad, [{
			key: 'refreshRoad',
			value: function refreshRoad(his) {
				this._his = his;
				var newNum = Math.max(his.length, this._orgCols);
				if (this.roadOld.numItems != newNum) {
					this.roadOld.numItems = newNum;
					his.length > 0 && this.roadOld.scrollToView(his.length - 1, true);
				} else this.roadOld.refreshVirtualList();
			}
		}]);

		return OldstyleRoad;
	}();

	var BigEye = function () {
		function BigEye(view, circle, cols) {
			_classCallCheck(this, BigEye);

			this.view = view;
			this.road = view.getChildAt(0).asCom;
			this.circle = circle || 1;
			this.cols = this._orgCols = cols || Math.max(12 * 2, Math.ceil(this.view.width / 7));
			// if (this.circle==2) this.cols*=2;
			var self = this;
		}

		_createClass(BigEye, [{
			key: 'makeResult',
			value: function makeResult(thisHigh, preHigh) {
				if (thisHigh <= preHigh) return 'red';
				if (thisHigh == preHigh + 1) return 'blue';
				return 'red';
			}
		}, {
			key: 'reverseResult',
			value: function reverseResult(r) {
				if (r == 'red') return 'blue';
				return 'red';
			}
		}, {
			key: 'bigEye',
			value: function bigEye(bigRoadPlacement, withDemo) {
				var tieStack = [];
				var placementMap = {};
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;

				for (var col = this.circle; col < bigRoadPlacement.length; col++) {
					var brCol = bigRoadPlacement[col];
					var compareCol = col - this.circle,
					    high = bigRoadPlacement[compareCol].length - 1;
					// for first cell in each col
					var preCompareCol = compareCol - 1;
					if (preCompareCol >= 0) {
						var preHigh = bigRoadPlacement[preCompareCol].length - 1;
						var firstCellHigh = high + 1;
						returnList.push(this.reverseResult(this.makeResult(firstCellHigh, preHigh)));
					}
					for (var row = 1; row < brCol.length; row++) {
						returnList.push(this.makeResult(row, high));
					}
				}
				returnList[returnList.length - 1] = { color: returnList[returnList.length - 1], isDemo: withDemo };

				return this.turn2Map(returnList);
			}
		}, {
			key: 'turn2Map',
			value: function turn2Map(results) {
				var rows = 6;
				var placementMap = {};
				var logicalColumnNumber = 0;
				var lastItem = void 0;
				var returnList = [];
				var maximumColumnReached = 0;
				results.forEach(function (gameResult) {
					var isDemo;
					if ((typeof gameResult === 'undefined' ? 'undefined' : _typeof(gameResult)) == 'object') {
						isDemo = gameResult.isDemo;
						gameResult = gameResult.color;
					}
					if (lastItem && lastItem != gameResult) logicalColumnNumber++;
					var probeColumn = logicalColumnNumber;
					var probeRow = 0;
					var done = false;

					while (!done) {
						var keySearch = probeColumn + '.' + probeRow;
						var keySearchBelow = probeColumn + '.' + (probeRow + 1);

						// Position available at current probe location
						if (!_.get(placementMap, keySearch)) {
							var newEntry = _.merge({}, {
								row: probeRow,
								column: probeColumn,
								logicalColumn: logicalColumnNumber
							}, { result: gameResult, isDemo: isDemo });
							_.set(placementMap, keySearch, newEntry);
							returnList.push(placementMap[probeColumn][probeRow]);

							done = true;
						}
						// The spot below would go beyond the table bounds.
						else if (probeRow + 1 >= rows) {
								probeColumn++;
							}
							// The spot below is empty.
							else if (!_.get(placementMap, keySearchBelow)) {
									probeRow++;
								}
								// The result below is the same outcome.
								else if (_.get(placementMap, keySearchBelow).result === gameResult) {
										probeRow++;
									} else {
										probeColumn++;
									}
					}

					lastItem = gameResult;
					maximumColumnReached = Math.max(maximumColumnReached, probeColumn);
				});

				returnList.maximumColumnReached = maximumColumnReached;
				return returnList;
			}
		}, {
			key: 'refreshRoad',
			value: function refreshRoad(bigRoadPlacement, withDemo) {
				var road = this.road;
				// var data=this.bigRoad(his);
				var data = this.bigEye(bigRoadPlacement, withDemo);
				var width = Math.max(data.maximumColumnReached, this._orgCols);
				// if (width>this.cols) {
				this.cols = Math.round(width / 2 + 1) * 2;
				if (data.maximumColumnReached >= this._orgCols) this.view.scrollPane.setPosX(road.width - this.view.width);else this.view.scrollPane.setPosX(0);
				// }
				// if (data.maximumColumnReached>=this.cols-1) {
				// 	this.cols=Math.floor(data.maximumColumnReached/2)*2+2;
				// 	this.view.scrollPane.setPosX(this.road.width-this.view.width);
				// }
				road.removeChildren(2);
				for (var i = 0; i < data.length; i++) {
					var obj = fairygui.UIPackage.createObject('Package1', '路格' + (2 + this.circle));
					var r = data[i].result,
					    isDemo = data[i].isDemo;
					var winCtrl = obj.getController('c1');
					if (r == 'red') winCtrl.selectedIndex = 0;else winCtrl.selectedIndex = 1;
					if (isDemo) obj.getTransition('t0').play();else obj.getTransition('t0').stop();

					obj.x = data[i].column * 7 + 1;
					obj.y = data[i].row * 7 + 1;
					road.addChild(obj);
				}
				// this.view.scroll
			}
		}, {
			key: 'cols',
			get: function get() {
				return this._cols;
			},
			set: function set(n) {
				this._cols = n;
				this.road.width = 7 * this._cols + 1;
			}
		}]);

		return BigEye;
	}();

	;

	module.exports = {
		BeadPlate: BeadPlate,
		BigRoad: BigRoad,
		BigEye: BigEye,
		OldstyleRoad: OldstyleRoad
	};

/***/ },

/***/ 272:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "baijiale@atlas_bri047.png?075e169265a5e4a629ae1e83cc66c691";

/***/ }

});