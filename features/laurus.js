/*jshint devel: true */
/*global toastr */

// extend jQuery : event trigger "outerClick"
( function ( $, elements, OUTER_CLICK ) {
	"use strict";

	function check( event ) {
		for ( var i = 0, l = elements.length, target = event.target, el; i < l; i += 1 ) {
			el = elements[ i ];
			if ( el !== target && !( el.contains ? el.contains( target ) : el.compareDocumentPosition ? el.compareDocumentPosition( target ) & 16 : 1 ) ) {
				$.event.trigger( OUTER_CLICK, event, el );
			}
		}
	}
	$.event.special[ OUTER_CLICK ] = {
		setup: function () {
			var i = elements.length;
			if ( !i ) {
				$.event.add( document, "click", check );
			}
			if ( $.inArray( this, elements ) < 0 ) {
				elements[ i ] = this;
			}
		},
		teardown: function () {
			var i = $.inArray( this, elements );
			if ( i >= 0 ) {
				elements.splice( i, 1 );
				if ( !elements.length ) {
					jQuery( this ).unbind( "click", check );
				}
			}
		}
	};
	$.fn[ OUTER_CLICK ] = function ( fn ) {
		return fn ? this.bind( OUTER_CLICK, fn ) : this.trigger( OUTER_CLICK );
	};
} )( jQuery, [], "outerClick" );

/** @type {Class} Laurus Package */
var LAURUS = {};

/** @type {Properties} 定数コレクション */
LAURUS.STATIC_ITEMS = ( function () {
	"use strict";

	var /** @type {Number} 全アイテム数 */
		_allRecords = 0,
		/** @type {Array} 属性値の対応値 */
		_valueIndex = [ "C", "B", "A", "S", "SS" ],

		/** @type {Object} アイテム分類一覧兼オーダー */
		_orderedList = {
			/** @type {Array} カテゴリー */
			CATEGORY: [
				"ヘアスタイル", "ドレス", "コート", "トップス", "ボトムス",
				"靴下", "シューズ", "ヘアアクセサリー", "耳飾り", "首飾り",
				"腕飾り", "手持品", "腰飾り", "特殊", "メイク"
			],
			/** @type {Array} スロット */
			SLOT: [
				"ヘアスタイル", "ドレス", "コート", "トップス", "ボトムス",
				"靴下", "靴下+1", "シューズ", "ヘアアクセサリー", "ヘアアクセサリー+1",
				"ヘアアクセサリー+2", "耳飾り", "首飾り", "首飾り+1", "両腕",
				"右腕", "左腕", "右手", "左手", "腰飾り",
				"顔", "肩掛け", "タトゥー", "背中", "尻尾",
				"前景", "中景", "後景", "地面", "メイク",
				"complex"
			]
		},
		/** @type {Object} 数値範囲の定義 */
		_bounds = {
			/** @type {Object} スタイルウェイト */
			STYLES: {
				initial: 1,
				floor: 0,
				ceil: 99
			},
			PRODUCT: {
				initial: 1,
				floor: 0,
				ceil: 99
			}
		},
		/** @type {Object} コラム名 */
		_column = {
			/** @type {Object} ワードロープ */
			WARDROBE: {
				// SERIAL: 0,
				// SLOTS: 1,
				// RARITY: 2,
				// NAME: 3,
				// THEME: 4,
				// COORDINATE: 5,
				// STYLES: 6,
				// ATTRIBUTES: 7,
				// TAGS: 8,
				// PROC: 9,
				// NOTES: 10,
				// TEXT: 11
				SERIAL: 0,
				SLOTS: 1,
				RARITY: 2,
				NAME: 3,
				ATTRIBUTES: 4,
				TAGS: 5,
				PROC: 6
			},
			/** @type {Object} ステージ */
			STAGE: {
				SECTION: 0,
				CHAPTER: 1,
				STAGE: 2,
				TITLE: 3,
				CRITERIA_SUBJECT: 4,
				CRITERIA_STYLE: 5,
				CRITERIA_TAGS: 6,
				SKILL: 7
			}
		},
		/** @type {Object} コード逆引き */
		_codeReverse = {
			/** @type {Object} カテゴリー */
			CATEGORY: {
				0: "すべて",
				1: "ヘアスタイル",
				2: "ドレス",
				3: "コート",
				4: "トップス",
				5: "ボトムス",
				6: "靴下",
				9: "シューズ",
				11: "アクセサリー",
				12: "ヘアアクセサリー",
				16: "耳飾り",
				17: "首飾り",
				20: "腕飾り",
				24: "手持品",
				27: "腰飾り",
				28: "特殊",
				10: "メイク",
				38: "complex"
			},
			/** @type {Object} スロット */
			SLOT: {
				1: "ヘアスタイル",
				2: "ドレス",
				3: "コート",
				4: "トップス",
				5: "ボトムス",
				7: "靴下",
				8: "靴下+1",
				9: "シューズ",
				13: "ヘアアクセサリー",
				14: "ヘアアクセサリー+1",
				15: "ヘアアクセサリー+2",
				16: "耳飾り",
				18: "首飾り",
				19: "首飾り+1",
				21: "両腕",
				22: "右腕",
				23: "左腕",
				25: "右手",
				26: "左手",
				27: "腰飾り",
				29: "顔",
				30: "肩掛け",
				31: "タトゥー",
				32: "背中",
				33: "尻尾",
				34: "前景",
				35: "中景",
				36: "後景",
				37: "地面",
				10: "メイク"
			}
		},
		/** @type {Object} スタイルの定義 */
		_styleDefs = {
			/** @type {Array} スタイルの対応値 */
			MAP: [
				"華麗", "シンプル",
				"エレガント", "アクティブ",
				"大人", "キュート",
				"セクシー", "ピュア",
				"ウォーム", "クール"
			],
			/** @type {Array} 列挙 */
			LIST: [
				"gorgeous", "simple",
				"elegance", "lively",
				"mature", "cute",
				"sexy", "pure",
				"warm", "cool"
			]
		},
		/** @type {Object} カテゴリーの定義 */
		_categoryDefs = {
			/** @type {Dictionary} アイテム分類の対応値 */
			MAP: {
				"ヘアスタイル": "hair",
				"ドレス": "dress",
				"コート": "coat",
				"トップス": "tops",
				"ボトムス": "bottoms",
				"靴下": "hosiery",
				"シューズ": "shoes",
				"ヘアアクセサリー": "headwear",
				"耳飾り": "earrings",
				"首飾り": "necklace",
				"腕飾り": "bracelet",
				"手持品": "handheld",
				"腰飾り": "waist",
				"特殊": "special",
				"メイク": "makeup"
			},
			/** @type {Dictionary} アイテムアイコンの対応ファイル名 */
			ICONS: {
				"ヘアスタイル": "hair",
				"ドレス": "dress",
				"コート": "coat",
				"トップス": "tops",
				"ボトムス": "bottoms",
				"靴下": "hosiery",
				"シューズ": "shoes",
				"ヘアアクセサリー": "accessory",
				"耳飾り": "accessory",
				"首飾り": "accessory",
				"腕飾り": "accessory",
				"手持品": "accessory",
				"腰飾り": "accessory",
				"特殊": "accessory",
				"メイク": "makeup"
			}
		},
		/** @type {Object} タグの定義 */
		_tagDefs = {
			/** @type {Array} タグの対応値 */
			MAP: [
				"タグ選択",
				"UV対策", "ダンサー", "小花柄", "冬服",
				"英国風", "水着", "バスタイム", "和風",
				"ナイトウェア", "ウェディング", "ミリタリー", "OL",
				"エプロン", "チャイナドレス", "メイド", "フォーマル",
				"ネイビー", "エスニック", "バニー", "お嬢様",
				"ロリータ", "ゴシック", "スポーティ", "原宿系",
				"学生風", "中性風", "近未来", "メルヘン",
				"ロック", "デニム", "小動物", "女神",
				"POP", "部屋着", "クラシックチャイナ", "インド風",
				"レトロチャイナ", "中世ヨーロッパ風", "ワル", "雨の日",
				"モダンチャイナ", "森ガール", "ボヘミアン", "メディカル"
			],
			/** @type {Array} タグの CSS クラス対応表 */
			CLASSES: [
				"tag-none",
				"sun-care", "dance", "floral", "winter",
				"britain", "swimsuit", "shower", "kimono",
				"pajamas", "wedding", "army", "office",
				"apron", "cheogsam", "maiden", "evening-gown",
				"navy", "traditional", "bunny", "lady",
				"lolita", "gothic", "sports", "harajuku",
				"preppy", "unisex", "future", "fairy",
				"rock", "denim", "pet", "goddess",
				"pop", "homewear", "chinese-classical", "hindu",
				"republic-of-china", "european", "swordman", "rain",
				"modern-china", "dryad", "bohemia", "paramedics"
			]
		},
		/** @type {Object} スキルの定義 */
		_skillDefs = {
			/** @type {Array} 列挙 */
			LIST: [
				"smile", "critical-eye", "pickly-immune", "charming",
				"gift", "gift-immune", "clock", "clock-immune",
				"sleeping", "true-love", "pickly-bounce", "gift-bounce",
				"cinderella"
			],
			/** @type {Objet} クラスのマスク値 */
			MASK: {
				"smile": 1,
				"critical-eye": 2,
				"pickly-immune": 4,
				"charming": 8,
				"gift": 16,
				"gift-immune": 32,
				"clock": 64,
				"clock-immune": 128,
				"sleeping": 256,
				"true-love": 512,
				"pickly-bounce": 1024,
				"gift-bounce": 2048,
				"cinderella": 4096
			},
			/** @type {Objet} シナリオクラス対応値 */
			SCENARIO_CLASS: {
				"GIRL": 0,
				"PRINCESS": 1
			}
		},
		/** @type {Object} ステージ構造情報 */
		_stageStructure = {},

		/** @type {Number} アニメーション動作時間 */
		_fadeDuration = 100,
		/** @type {Object} toastr の Laurus カスタイマイズオプション */
		_toastrLaurusOptions = {
			positionClass: "toast-top-right",
			preventDuplicates: true,
			showDuration: "100",
			hideDuration: "1000",
			timeOut: "4000",
			extendedTimeOut: "1000",
			showEasing: "swing",
			hideEasing: "linear",
			showMethod: "fadeIn",
			hideMethod: "slideUp"
		},

		/** @summary 3桁コンマ区切りの数値（文字列）を取得する
		 * @param  {Number} number 桁区切りをする数値
		 * @returns {String} 桁区切りを施した文字列
		 */
		_digitGrouping = function ( number ) {
			return number.toString().replace( /(\d)(?=(\d\d\d)+$)/g, "$1," );
		},
		/** @summary Laurus 用のデータベース取得用関数
		 * @param {String} database データベース名
		 * @param {Function} success コールバック関数
		 */
		_getDatabase = function ( database, success ) {
			$.ajax( {
				type: "GET",
				url: "resources/" + database + ".json",
				dataType: "json",
				async: false,
				success: success
			} );
		},
		/** @summary 数値が範囲内に収まっているか検査する
		 * @param {Number} value 検査値
		 * @param {Object} bounds 境界オブジェクト
		 * @returns {Boolean} true -> 検査値が境界内に収まっている
		 */
		_isCloseTo = function ( value, bounds ) {
			return bounds.floor <= value && value <= bounds.ceil;
		},
		/** @type {MethodCollection} コードから情報を復元するためのメソッド群 */
		_restore = {
			/** @summary スタイル属性のコードを復元する
			 * @param {String} attributes コード化されたスタイル属性値
			 * @returns {Array} 復元したスタイル属性値配列
			 */
			attributes: function ( attributes ) {
				var a = [];

				$.each( attributes.split( "" ), function ( index ) {
					var v = parseInt( this, 16 );
					a[ index ] = ( 0 < ( v & 8 ) ? -1 : 1 ) * ( ( v & 7 ) + 1 );
				} );

				return a;
			},
			/** @summary 特殊タグを復元する
			 * @param {Number} complex 複合化された特殊タグコード
			 * @returns {Array} タグの単独コード
			 */
			tag: function ( complex ) {
				var TAG_BASE = 45;

				return [ complex % TAG_BASE, Math.floor( complex / TAG_BASE ) ];
			},
			/** @summary アイテムのシリアルコードからカテゴリーとアイテム ID 特殊タグを復元する
			 * @param {Number} serial アイテムのシリアルコード
			 * @returns {Object} カテゴリーと ID のペア
			 */
			categoryAndId: function ( serial ) {
				var CATEGORY_BASE = 10000;

				return {
					category: _codeReverse.CATEGORY[ Math.floor( serial / CATEGORY_BASE ) ],
					id: serial % CATEGORY_BASE
				};
			}
		};

	return {
		// consts
		ALL_RECORDS: _allRecords,
		VALUE_INDEX: _valueIndex,

		ORDERED_LIST: _orderedList,
		BOUNDS: _bounds,
		COLUMN: _column,
		CODE_REVERSE: _codeReverse,
		STYLE_DEFS: _styleDefs,
		CATEGORY_DEFS: _categoryDefs,
		TAG_DEFS: _tagDefs,
		SKILL_DEFS: _skillDefs,
		STAGE_STRUCTURE: _stageStructure,

		FADE_DURATION: _fadeDuration,
		TOASTR_LAURUS_OPTIONS: _toastrLaurusOptions,

		// static methods
		digitGrouping: _digitGrouping,
		isCloseTo: _isCloseTo,
		getDatabase: _getDatabase,
		restore: _restore
	};
}() );

/** @type {ObjectDatabase} ステージ情報 */
LAURUS.STAGES = ( function () {
	"use strict";

	var STRUCTURE = LAURUS.STATIC_ITEMS.STAGE_STRUCTURE,
		_stages = {};

	LAURUS.STATIC_ITEMS.getDatabase(
		"stages",
		function ( data ) {
			$.each( data, function ( section ) {
				STRUCTURE[ section ] = [];

				$.each( this, function ( chapter ) {
					STRUCTURE[ section ].push( chapter );

					$.each( this, function ( index, stage ) {
						_stages[ this[ 0 ] ] = [ section, chapter ].concat( stage );
					} );
				} );
			} );
		}
	);

	return _stages;
}() );

/** @type {Object} スコア保持用オブジェクト */
LAURUS.SCORE = {};

/** @type {ObjectDatabase} ワードロープ */
LAURUS.WARDROBE = ( function () {
	"use strict";

	var SCORE = LAURUS.SCORE,
		_wardrobe = {};

	LAURUS.STATIC_ITEMS.getDatabase(
		"wardrobe",
		function ( data ) {
			$.each( data, function () {
				var serial = this[ 0 ];

				_wardrobe[ serial ] = this;
				SCORE[ serial ] = -1;
			} );

			LAURUS.STATIC_ITEMS.ALL_RECORDS = data.length;
		}
	);

	return _wardrobe;
}() );

/** @summary アイテムカードの生成
 * @param {Number} serial アイテムのシリアルコード
 * @returns {HTML} アイテムカードの HTML コード
 */
LAURUS.itemCard = function ( serial ) {
	"use strict";

	var // dependence
		WRODROBE = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		CATEGORY_MAP = LAURUS.STATIC_ITEMS.CATEGORY_DEFS.MAP,
		// CATEGORY_ICONS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS.ICONS,
		TAGS_CLASSES = LAURUS.STATIC_ITEMS.TAG_DEFS.CLASSES,

		digitGrouping = LAURUS.STATIC_ITEMS.digitGrouping,
		restore = LAURUS.STATIC_ITEMS.restore,

		// item
		item = LAURUS.WARDROBE[ serial ],
		itemScore = LAURUS.SCORE[ serial ],
		keys = restore.categoryAndId( serial ),
		attributes = restore.attributes( item[ WRODROBE.ATTRIBUTES ] ),
		tag = restore.tag( item[ WRODROBE.TAGS ] ),

		// concrete HTML
		icon = ( function () {
			/* Note:
			 * style="background-image: url( Filename );"
			 * ではスラッシュがHTML描画時に空白に置き換えられてしまうため、CSSで対応。
			 */
			// var ROW = 20,
			// 	SIDE = 40,
			// 	UNIT = 200,

			// 	iconFile = CATEGORY_ICONS[ keys.category ] + "-" + Math.floor( keys.id / UNIT ),
			// 	rowPos = -1 * ( keys.id % ROW ) * SIDE,
			// 	colPos = -1 * Math.floor( ( keys.id % ROW ) / ROW ) * SIDE;

			// return "<span class=\"item-icon " + iconFile + "\" style=\"background-position: " + rowPos + "px " + colPos + "px;\"></span>";
			return "<span class=\"item-icon " + CATEGORY_MAP[ keys.category ] + "\"></span>";
		}() ),
		tags = "<span class=\"item-tags-box\"><span class=\"item-tags item-tags-" + TAGS_CLASSES[ tag[ 0 ] ] + "\"></span><span class=\"item-tags item-tags-" + TAGS_CLASSES[ tag[ 1 ] ] + "\"></span></span>",
		name = "<span class=\"item-name\"><span class=\"item-id\">" + ( keys.id < 100 ? ( "000" + keys.id ).slice( -3 ) : keys.id ) + "</span>" + item[ WRODROBE.NAME ] + "</span>",
		rarity = "<span class=\"item-rarity " + ( item[ WRODROBE.RARITY ] < 0 ? " with-animate" : "" ) + "\"><span class=\"laurus-icon\">&#x2606;</span>" + Math.abs( item[ WRODROBE.RARITY ] ) + "</span>",
		attributesTable = ( function () {
			var HEADER = "<table class=\"item-attributes\"><tbody>",
				FOOTER = "</tbody></table>",
				VALUES = [ "", "C", "B", "A", "S", "SS" ],
				table = {
					t: { // top
						h: "<tr>", // header
						b: "<tr>" // body
					},
					b: { // bottom
						h: "<tr>",
						b: "<tr>"
					}
				};

			$.each( attributes, function () {
				var v = VALUES[ Math.abs( this ) ];

				if ( 0 < this ) {
					table.t.h += "<th></th>";
					table.t.b += "<td class=\"attributes-" + v + "\">●" + v + "</td>";
					table.b.h += "<th class=\"inactive\"></th>";
					table.b.b += "<td class=\"inactive\">-</td>";
				} else {
					table.t.h += "<th class=\"inactive\"></th>";
					table.t.b += "<td class=\"inactive\">-</td>";
					table.b.h += "<th></th>";
					table.b.b += "<td class=\"attributes-" + v + "\">●" + v + "</td>";
				}
			} );

			table.t.h += "</tr>";
			table.t.b += "</tr>";
			table.b.h += "</tr>";
			table.b.b += "</tr>";

			return HEADER + table.t.h + table.t.b + table.b.h + table.b.b + FOOTER;
		}() ),
		sparkline = "<span class=\"item-sparkline-box\"><span class=\"item-sparkline\">" + attributes.join( "," ) + "</span></span>",
		score = "<span class=\"item-score\">" + ( 0 < itemScore ? digitGrouping( itemScore ) : "-" ) + "</span>";

	return "<div class=\"item-card\">" +
		"<div class=\"item-icon-box\">" + icon + tags + "</div>" +
		name + rarity +
		attributesTable + sparkline + score +
		"</div>";
};

/** @type {MethodCollection} ダイアログ表示 */
LAURUS.dialogue = ( function () {
	"use strict";

	var // dependence
		FADE_DURATION = LAURUS.STATIC_ITEMS.FADE_DURATION,

		// private fields
		_dialogueContents = [],
		_$dialogue = null, // #dialogue
		_$dialoguePane = null, // #dialogue-pane, #dialogue
		_invoker = null,

		// methods
		/** @summary ダイアログにコンテンツをセット
		 * @param {HTML} content ダイアログの中に表示するコンテンツ
		 */
		_setContents = function ( content ) {
			var id = $( content ).attr( "id" );

			_dialogueContents[ id ] = $( content ).clone();
			$( content ).remove();
		},
		/** @summary 呼び出し元要素を取得する */
		_getInvoker = function () {
			return _invoker;
		},
		/** @summary ダイアログを廃棄する */
		_dispose = function () {
			_$dialoguePane
				.fadeOut( FADE_DURATION, function () {
					_$dialogue.empty();
					_invoker = null;
				} );
		},
		/** @summary ダイアログの再描画 */
		_reposition = function () {
			_$dialogue
				.animate( {
					marginTop: ( _$dialogue.outerHeight() / 2 ) * -1,
					marginLeft: ( _$dialogue.outerWidth() / 2 ) * -1
				}, 500 );
		},
		/** @summary ダイアログを表示する
		 * @param {String} id ダイアログコンテンツの ID
		 */
		_invoke = function ( id, invoker ) {
			var $content = _dialogueContents[ id ];

			_invoker = invoker;

			_$dialogue
				.append( $content );
			$content
				.show();
			_$dialogue
				.css( {
					marginTop: ( _$dialogue.outerHeight() / 2 ) * -1,
					marginLeft: ( _$dialogue.outerWidth() / 2 ) * -1
				} );
			_$dialoguePane
				.fadeIn( FADE_DURATION );
		},
		/** @summary ダイアログの初期化処理 */
		_wakeup = function () {
			// field set
			_$dialogue = $( "#dialogue" );
			_$dialoguePane = $( "#dialogue-pane, #dialogue" );

			// contents map
			$( ".dialogue-content" )
				.each( function () {
					_setContents( this );
				} );

			// basis event hook
			_$dialogue
				.empty()
				.on( "click", ".dialogue-expand-label", function () {
					var $this = $( this ),
						behave = function ( icon, effect, pre, current ) {
							$this
								.children( ".laurus-icon" )
								.html( icon );
							$this
								.next()[ effect ]( FADE_DURATION, function () {
									$this
										.removeClass( pre )
										.addClass( current );
									_reposition();
								} );
						};

					if ( $this.hasClass( "less" ) ) {
						behave( "&#x2627;", "slideDown", "less", "more" );
					} else {
						behave( "&#x2626;", "slideUp", "more", "less" );
					}
				} )
				.on( "click", ".dialogue-close", LAURUS.dialogue.dispose );

			$( "#dialogue-pane" )
				.on( "click", LAURUS.dialogue.dispose );
		};

	return {
		wakeup: _wakeup,
		setContents: _setContents,
		getInvoker: _getInvoker,
		reposition: _reposition,
		dispose: _dispose,
		invoke: _invoke
	};
}() );

/** @summary モード（ページ）チェンジ */
LAURUS.changeMode = function () {
	"use strict";

	var mode = $( this ).data( "mode" );

	$( "#general-navgation .ghost-button" ).removeClass( "current-mode" );

	$( this ).addClass( "current-mode" );
	$( "#header" ).attr( "class", mode );

	$( "#current-mode" ).text( mode.charAt( 0 ).toUpperCase() + mode.substring( 1 ) );

	$( ".tab" ).hide();
	$( "#" + mode ).show();
};

/** @type {MethodCollection} Advisor 用メソッドコレクション */
LAURUS.advisor = ( function () {
	"use strict";

	var // dependence
		STAGES = LAURUS.STAGES,

		BOUNDS = LAURUS.STATIC_ITEMS.BOUNDS,
		FADE_DURATION = LAURUS.STATIC_ITEMS.FADE_DURATION,
		SKILL_DEFS = LAURUS.STATIC_ITEMS.SKILL_DEFS,
		STAGE = LAURUS.STATIC_ITEMS.COLUMN.STAGE,
		STYLE_DEFS = LAURUS.STATIC_ITEMS.STYLE_DEFS,
		STRUCTURE = LAURUS.STATIC_ITEMS.STAGE_STRUCTURE,
		TAG_DEFS = LAURUS.STATIC_ITEMS.TAG_DEFS,
		VALUE_INDEX = LAURUS.STATIC_ITEMS.VALUE_INDEX,

		isCloseTo = LAURUS.STATIC_ITEMS.isCloseTo,

		// private static variables
		_stage = [],

		// utils
		/** @summary （主に入力された）文字列をサニタイズ処理する
		 * @param {String} text サニタイズ対象文字列
		 * @returns {String} サニタイズ処理を施した文字列
		 */
		_sanitizeHTML = function ( text ) {
			return text.replace( /[&'`"<>]/g, function ( match ) {
				return {
					"&": "&amp;",
					"\'": "&#x27;",
					"\"": "&quot;",
					"<": "&lt;",
					">": "&gt;"
				}[ match ];
			} );
		},
		/** @summary （主に入力された）サニタイズ処理した文字を復元する
		 * @param {String} text 復元対象文字列
		 * @returns {String} サニタイズ処理を復元した文字列
		 */
		_unsanitizeHTML = function ( text ) {
			return text.replace( /&amp;|&#x27;|&quot;|&lt;|&gt;/g, function ( match ) {
				return {
					"&amp;": "&",
					"&#x27;": "\'",
					"&quot;": "\"",
					"&lt;": "<",
					"&gt;": ">"
				}[ match ];
			} );
		},
		/** @summary ID 属性に適合する文字列に変換する
		 * @param {String} id 変換対象の文字列
		 * @returns {String} ID 属性に適合するように変換された文字列
		 */
		_mapForIdString = function ( id ) {
			return id.replace( / /g, "-" );
		},

		// items
		// foundation data
		/** @summary ステージの基本情報を更新する
		 * @param {String} stage ミッションタイトル
		 * @param {String} chapter キャプター
		 */
		_setFoundationData = function ( stage, chapter ) {
			$( "#request-stage-title" )
				.text( stage );
			$( "#request-chapter" )
				.text( chapter );
		},

		// criteria subject
		/** @summary ミッションの説明を更新する
		 * @param {String} subject ミッションの説明
		 */
		_setCriteriaSubject = function ( subject ) {
			var sanitizedSubject = _sanitizeHTML( subject ).replace( /[\/]/g, "<br>" );

			if ( sanitizedSubject === "" ) {
				$( "#criteria-subject" )
					.html( "[タスクヒント]" )
					.addClass( "initial" );
			} else {
				$( "#criteria-subject" )
					.html( sanitizedSubject )
					.removeClass();
			}
		},
		/** @summary ミッションの説明を消去する */
		_clearCriteriaSubject = function () {
			_setCriteriaSubject( "" );
		},

		// style weight
		/** @summary スタイルの評価ウェイトを更新する
		 * @param {String} style スタイル
		 * @param {Number} weight スタイルの評価ウェイト
		 */
		_setStyleWeight = function ( style, weight ) {
			var $criteriaStyle = $( "#criteria-" + style ),
				$criteriaStyleLabel = $criteriaStyle.parent().prev(),
				branch = 0 < weight ? {
					indicator: weight < 1 ? "reduce" : "increase",
					text: weight,
					label: "addClass"
				} : {
					indicator: "",
					text: "-",
					label: "removeClass"
				};

			$criteriaStyle
				.removeClass( "reduce increase" )
				.addClass( branch.indicator )
				.text( branch.text );
			$criteriaStyleLabel[ branch.label ]( "sparkly" );
		},
		/** @summary スタイルの評価ウェイトを消去する
		 * @param {Number} index 不使用（jQuery.each の引数用）
		 * @param {String} style 消去するスタイル
		 */
		_clearStyleWeight = function ( index, style ) {
			_setStyleWeight( style, 0 );
		},
		/** @summary すべてのスタイルの評価ウェイトを消去する */
		_clearStyleWeightAll = function () {
			$.each( STYLE_DEFS.LIST, _clearStyleWeight );
		},

		// tag bonus
		/** @summary タグボーナスの加算評価値を更新する
		 * @param {Number} channel タグチャネル
		 * @param {String} value タグの加算評価値
		 */
		_setTagAddValue = function ( channel, value ) {
			$( "#criteria-tag-box-" + channel + " .value" )
				.text( value )
				.attr( "class", "value " + value.toLowerCase() );
		},
		/** @summary タグボーナスの加算係数を更新する
		 * @param {Number} channel タグチャネル
		 * @param {Number} product 加算係数
		 */
		_setTagProduct = function ( channel, product ) {
			$( "#criteria-tag-box-" + channel + " .product" )
				.text( product );
		},
		/** @summary ダイアログから選んだタグをセットする
		 * @param {String} channel タグのチャネル
		 * @param {Number} tagId タグ ID
		 */
		_setTag = function ( channel, tagId ) {
			var $target = $( "#criteria-tag-box-" + channel + " .tag" ),
				$tag = $target.children();

			$target
				.removeClass()
				.addClass( "tag " + TAG_DEFS.CLASSES[ tagId ] );
			$tag
				.text( TAG_DEFS.MAP[ tagId ] );

			if ( tagId === 0 ) {
				_setTagAddValue( channel, "S" );
				_setTagProduct( channel, 1 );
			}
		},
		/** @summary タグボーナスの設定を消去する
		 * @param {Number} channel 消去するチャネル
		 */
		_clearTag = function ( channel ) {
			_setTag( channel, 0 );
			_setTagAddValue( channel, "S" );
			_setTagProduct( channel, 1 );
		},

		// skills
		/** @summary シナリオ難易度選択ボタンを表示する */
		_onScenarioClasses = function () {
			$( "#scenario-classes" ).show();
		},
		/** @summary シナリオ難易度選択ボタンを隠す */
		_offScenarioClasses = function () {
			$( "#scenario-classes" ).hide();
		},
		/** @summary スキルアイコンの活性化させる
		 * @param {Number} index 不使用（jQuery.each の引数用）
		 * @param {String} skill スキル名
		 */
		_onSkill = function ( index, skill ) {
			$( "#receive-skill-icons [data-skill=\"" + skill + "\"]" )
				.addClass( "sparkly" );
			$( "#receive-skill-names [data-skill=\"" + skill + "\"]" )
				.show();
		},
		/** @summary スキルアイコンの不活性化にする
		 * @param {Number} index 不使用（jQuery.each の引数用）
		 * @param {String} skill スキル名
		 */
		_offSkill = function ( index, skill ) {
			$( "#receive-skill-icons [data-skill=\"" + skill + "\"]" )
				.removeClass( "sparkly" );
			$( "#receive-skill-names [data-skill=\"" + skill + "\"]" )
				.hide();
		},
		/** @summary スキルアイコンの活性/不活性状態を切り替える
		 * @param {Number} index 不使用（jQuery.each の引数用）
		 * @param {String} skill スキル名
		 */
		_switchSkill = function ( index, skill ) {
			if ( $( "#receive-skill-icons [data-skill=\"" + skill + "\"]" ).hasClass( "sparkly" ) ) {
				_offSkill( null, skill );
			} else {
				_onSkill( null, skill );
			}
		},
		/** @summary すべてのスキルアイコンを不活性化させる */
		_clearSkill = function () {
			$.each( SKILL_DEFS.LIST, _offSkill );
		},
		/** @summary スキルアイコンをステージ情報に従って設定する
		 * @param {Number} scenarioClass ステージ識別 ID
		 */
		_setSkill = function ( scenarioClass ) {
			var skill = _stage[ STAGE.SKILL ][ scenarioClass ];

			_clearSkill();
			$.each( SKILL_DEFS.LIST, function () {
				if ( SKILL_DEFS.MASK[ this ] & skill ) {
					_onSkill( null, this );
				}
			} );

			if ( scenarioClass === SKILL_DEFS.SCENARIO_CLASS.GIRL ) {
				$( "#girl-class" )
					.addClass( "sparkly" );
				$( "#princess-class" )
					.removeClass();
			} else {
				$( "#princess-class" )
					.addClass( "sparkly" );
				$( "#girl-class" )
					.removeClass();
			}
		},

		// reset
		/** @summary UI を初期化する*/
		_resetUI = function () {
			_clearCriteriaSubject();
			_clearStyleWeightAll();
			_clearTag( 2 );
			_clearTag( 1 );
			_clearSkill();
			_offScenarioClasses();
		},

		// stages
		/** @summary ダイアログから選んだステージをセットする
		 * @param {String} key ステージキー
		 */
		_setStage = function ( key ) {
			_stage = STAGES[ key ];

			_resetUI();
			_setFoundationData(
				_stage[ STAGE.STAGE ] + " " + _stage[ STAGE.TITLE ],
				_stage[ STAGE.CHAPTER ]
			);

			_setCriteriaSubject( _stage[ STAGE.CRITERIA_SUBJECT ] );

			$.each( _stage[ STAGE.CRITERIA_STYLE ], function ( index, weight ) {
				_setStyleWeight( STYLE_DEFS.LIST[ index * 2 + ( weight < 0 ? 1 : 0 ) ], Math.abs( weight ) );
			} );

			$.each( _stage[ STAGE.CRITERIA_TAGS ], function ( channel ) {
				_setTag( channel + 1, this[ 0 ] );
				_setTagAddValue( channel + 1, VALUE_INDEX[ this[ 1 ] ] );
				_setTagProduct( channel + 1, this[ 2 ] );
			} );

			if ( _stage[ STAGE.SECTION ] === "scenario" ) {
				_onScenarioClasses();
			}
			_setSkill( SKILL_DEFS.SCENARIO_CLASS.GIRL );
		},

		/** @summary Advisor の初期化処理 */
		_wakeup = function () {
			var /** @type {Class} 編集中のオブジェクト保持及び操作に関するクラス */
				Medium = ( function () {
					var /** @type {?String} 現在編集中の項目 (ID) */
						_currentEdit = null,
						/** @type {?jQuery} 現在編集中の jQuery オブジェクト */
						_$currentEditElement = null,
						/** @type {*} 編集前の値 */
						_preventValue = null,

						/** @summary メディウムの値をリセット */
						_clearMedium = function () {
							_currentEdit = null;
							_$currentEditElement = null;
							_preventValue = null;
						},
						/** @summary 現在編集中の項目 (ID) を取得する
						 * @returns {?String} 現在編集中の項目 (ID)
						 */
						_getCurrentEdit = function () {
							return _currentEdit;
						},
						/** @summary 現在編集中の jQuery オブジェクトを取得する
						 * @returns {?jQuery} 現在編集中の jQuery オブジェクト
						 */
						_get$CurrentEditElement = function () {
							return _$currentEditElement;
						},
						/** @summary 編集前の値を取得する
						 * @returns {?any} 編集前の値
						 */
						_getPreventValue = function () {
							return _preventValue;
						},
						/** @summary 現在、いずれかの項目で編集中であるか状態を返す
						 * @returns {Boolean} true -> 編集中
						 */
						_isEditing = function () {
							return _currentEdit !== null;
						},
						/** @summary メディウムに値をセットする
						 * @param {String} edit 現在編集中の項目 (ID)
						 * @param {jQuery} $element 現在編集中の jQuery オブジェクト
						 * @param {any} value 編集前の値
						 */
						_setMedium = function ( edit, $element, value ) {
							_currentEdit = edit;
							_$currentEditElement = $element;
							_preventValue = value;
						},
						/** @summary 現在、いずれかの項目で編集中であるか状態を返す */
						_rollbackEdit = function () {
							_$currentEditElement.val( _preventValue );
							_$currentEditElement.blur();
						};

					return {
						clearMedium: _clearMedium,
						getCurrentEdit: _getCurrentEdit,
						get$currentEditElement: _get$CurrentEditElement,
						getPreventValue: _getPreventValue,
						isEditing: _isEditing,
						setMedium: _setMedium,
						rollbackEdit: _rollbackEdit
					};
				}() ),

				/** @type {Object} ステージ選択用ボタンの生成 */
				writeStages = function () {
					var buildStageButton = function ( key, stage ) {
						return "<span class=\"select-stage\" data-key=\"" + key + "\">" + stage + "</span>";
					};

					$.each( STRUCTURE, function ( section ) {
						$.each( this, function ( index, chapter ) {
							var $chapter = $( "<div class=\"chapter\"></div>" ),
								$stageArea = $( "<div class=\"chapter\"></div>" );

							$( "#stage-" + section )
								.append( $chapter );
							$( $chapter )
								.append( section === "colosseum" ? "" : "<span class=\"chapter-label\">" + chapter + "</span>" )
								.append( $stageArea );
							$stageArea
								.data( "section", section )
								.attr( "id", _mapForIdString( chapter ) )
								.addClass( section );
						} );
					} );

					$.each( STAGES, function () {
						$( "#" + _mapForIdString( this[ STAGE.CHAPTER ] ) )
							.append(
								this[ STAGE.SECTION ] === "colosseum" ?
								buildStageButton( this[ STAGE.STAGE ], this[ STAGE.TITLE ] ) :
								buildStageButton( this[ STAGE.STAGE ], this[ STAGE.STAGE ] )
							);
					} );
				},

				/** @summary ミッションの説明の編集 */
				editCriteriaSubject = function () {
					var $subject = $( "#criteria-subject" ),
						$inputContainer = $( "<span id=\"input-criteria-subject\"><input type=\"text\" placeholder=\"ミッションの説明\"></span>" ),
						$inputField = $inputContainer.children();

					// edit invoke
					$subject
						.on( "click", function () {
							var subject = "";

							if ( !Medium.isEditing() ) {
								if ( $subject.hasClass( "initial" ) ) {
									$subject.removeClass();
								} else {
									subject = _unsanitizeHTML( $subject.html().replace( /<br>/g, "/" ) );
								}

								$subject
									.hide()
									.after( $inputContainer );
								$inputField
									.val( subject )
									.focus()
									.select();

								toastr.info( "半角スラッシュ ( / ) は改行に変換されます" );

								Medium.setMedium( "criteria-subject", $inputField, subject );
							}
						} );

					// edit after
					$( "#advisor" )
						.on( "blur", "#input-criteria-subject input", function () {
							$subject
								.show();
							$inputContainer
								.remove();

							_setCriteriaSubject( $inputField.val() );
							Medium.clearMedium();
						} );
				},
				/** @summary スタイルの評価ウェイト編集（jQuery.each() にて設定する）
				 * @param {Number} index 不使用
				 * @param {String} style スタイル名
				 */
				editCriteriaStyle = function ( index, style ) {
					var $criteriaStyle = $( "#criteria-" + style ),
						$inputContainer = $( "<span id=\"input-" + style + "\"><input type=\"text\"></span>" ),
						$inputField = $inputContainer.children();

					// edit invoke
					$criteriaStyle
						.on( "click", function () {
							if ( !Medium.isEditing() ) {
								var value = $criteriaStyle.text(),
									processedValue = value === "-" ? "" : value;

								$criteriaStyle
									.hide()
									.after( $inputContainer );
								$inputField
									.val( processedValue )
									.focus()
									.select();

								Medium.setMedium( style, $inputField, value );
							}
						} );

					// edit after
					$( "#advisor" )
						.on( "blur", "#input-" + style + " input", function () {
							var value = $inputField.val(),
								weight = parseFloat( value ),
								successProcess = function () {
									$criteriaStyle
										.show();
									$inputContainer
										.remove();

									_setStyleWeight( style, weight );
									Medium.clearMedium();
								},
								errorProcess = function () {
									$inputField
										.focus()
										.select();
									toastr.error( "0 から 99 までの数値（半角）または \"-\" を入力してください" );
								};

							if ( value === "" || value === "-" ) {
								// case: 空白 または 半角ハイフン "-"
								successProcess();
							} else if ( isNaN( weight ) || !isCloseTo( weight, BOUNDS.STYLES ) ) {
								// case: 非数値 または 範囲エラー
								errorProcess();
							} else {
								// case: 正常（数値が 0 か否かでの分岐は _setStyleWeight() 内で行う）
								successProcess();
							}
						} );
				},
				/** @summary タグボーナスの加算係数の編集（jQuery.each() にて設定する）
				 * @param {Number} index 不使用
				 * @param {Number} channel チャネル
				 */
				editTagProduct = function ( index, channel ) {
					var $tagProduct = $( "#criteria-tag-box-" + channel + " .product" ),
						$inputContainer = $( "<span id=\"input-tag-product-" + channel + "\"><input type=\"text\"></span>" ),
						$inputField = $inputContainer.children();

					// edit invoke
					$tagProduct
						.on( "click", function () {
							if ( !Medium.isEditing() ) {
								var product = $tagProduct.text();

								$tagProduct
									.hide()
									.after( $inputContainer );
								$inputField
									.val( product )
									.focus()
									.select();

								Medium.setMedium( "tag" + channel, $inputField, product );
							}
						} );

					// edit after
					$( "#advisor" )
						.on( "blur", "#input-tag-product-" + channel + " input", function () {
							var value = $inputField.val(),
								product = parseFloat( value ),
								successProcess = function () {
									$tagProduct
										.show();
									$inputContainer
										.remove();

									_setTagProduct( channel, product );
									Medium.clearMedium();
								},
								errorProcess = function () {
									$inputField
										.focus()
										.select();
									toastr.error( "0 から 99 までの数値（半角）を入力してください" );
								};

							if ( value === "" ) {
								// case: 空白
								product = 1;
								successProcess();
							} else if ( isNaN( product ) || !isCloseTo( product, BOUNDS.PRODUCT ) ) {
								// case: 非数値 または 範囲エラー
								errorProcess();
							} else {
								// case: 正常
								successProcess();
							}
						} );
				},
				/** @summary タグの加算評価値を選択する */
				tagAddValueSelect = function () {
					var _channel = "";

					$( "#criteria-tags" )
						.on( "click", ".value", function ( evt ) {
							var $this = $( this ),
								offset = $this.offset();

							_channel = $this.parent().attr( "id" ).slice( -1 );

							$( "#value-list" )
								.fadeIn( FADE_DURATION )
								.offset( {
									top: offset.top + 21, // 21: $( ".tag-box .value" ) の高さ
									left: offset.left - 45 // 45: ( 140 / 2 ) - ( 50 / 2 ), 140: width, 50: $( ".tag-box .value" ) の幅
								} );

							evt.stopPropagation();

							$( "#value-list" )
								.one( "outerClick", function () {
									$( "#value-list" ).fadeOut( FADE_DURATION );
								} );
						} );

					$( "#laurus" )
						.on( "click", "#value-list .value", function () {
							_setTagAddValue( _channel, $( this ).text() );

							$( "#value-list" ).fadeOut( FADE_DURATION );
						} );
				},

				/** @summary ダイアログの呼び出し
				 * @param {String} dialogue 呼び出すダイアログの ID
				 * @param {Function} callback コールバック関数（省略可））
				 */
				invokeDialogue = function ( dialogue, callback ) {
					return function () {
						if ( Medium.isEditing() ) {
							Medium.rollbackEdit();
						}
						toastr.remove();

						LAURUS.dialogue.invoke( dialogue, this );

						if ( callback ) {
							callback();
						}
					};
				},
				/** @summary スキルアイコン一括設定のステージボタンイベント用包括関数
				 * @param {Number} scenarioClass ステージ識別 ID
				 */
				setSkillFor = function ( scenarioClass ) {
					return function () {
						_setSkill( scenarioClass );
					};
				},
				/** @summary 内容を選択する（focus イベント用） */
				thisSelect = function () {
					$( this ).select();
				};

			// constructor
			// ダイアログに表示する内容の生成
			writeStages();

			// イベントフック
			editCriteriaSubject();
			$.each( LAURUS.STATIC_ITEMS.STYLE_DEFS.LIST, editCriteriaStyle );
			$.each( [ 1, 2 ], editTagProduct );
			tagAddValueSelect();

			$( "#advisor" )
				// ダイアログの呼び出し
				.on( "click", "#request-stage", invokeDialogue( "stage-select", function () {
					$( "#custom-stage-title" ).val( $( "#request-stage-title" ).text() );
					$( "#custom-request-chapter" ).val( $( "#request-chapter" ).text() );
				} ) )
				.on( "click", "#criteria-tags .tag span", invokeDialogue( "tag-select" ) )

				// スキルセット
				.on( "click", "#girl-class", setSkillFor( SKILL_DEFS.SCENARIO_CLASS.GIRL ) )
				.on( "click", "#princess-class", setSkillFor( SKILL_DEFS.SCENARIO_CLASS.PRINCESS ) )
				.on( "click", "#receive-skill-icons span", function () {
					_switchSkill( null, $( this ).data( "skill" ) );
				} );

			$( "#dialogue" )
				// ステージ選択
				.on( "click", ".select-stage", function () {
					_setStage( $( this ).data( "key" ) );
					LAURUS.dialogue.dispose();
				} )
				.on( "click", "#custom-input-determination", function () {
					_stage = null;
					_resetUI();

					_setFoundationData(
						$( "#custom-stage-title" ).val(),
						$( "#custom-request-chapter" ).val()
					);

					LAURUS.dialogue.dispose();
				} )
				.on( "focus", "#custom-stage-title", thisSelect )
				.on( "focus", "#custom-request-chapter", thisSelect )

				// タグ選択
				.on( "click", ".tag span", function () {
					_setTag( ( $( LAURUS.dialogue.getInvoker() ).attr( "id" ) === "criteria-tag-1" ? 1 : 2 ), $( this ).data( "tag-id" ) );
					LAURUS.dialogue.dispose();
				} );

			_resetUI();
		};

	return {
		setStage: _setStage,
		wakeup: _wakeup
	};
}() );

/** @type {MethodCollection} Wardrobe 用メソッドコレクション */
LAURUS.wardrobe = ( function () {
	"use strict";

	var _wakeup = function () {
		var Medium = ( function () {
				var _currentStyle = "item",

					_changeStyle = function ( style ) {
						_currentStyle = style;

						if ( _currentStyle === "item" ) {
							$( "#list-item-style" )
								.addClass( "sparkly" );
							$( "#card-item-style" )
								.removeClass();
						} else {
							$( "#card-item-style" )
								.addClass( "sparkly" );
							$( "#list-item-style" )
								.removeClass();
						}
					};

				return {
					changStyle: _changeStyle
				};
			}() ),
			changeStyleFor = function ( style ) {
				return function () {
					Medium.changStyle( style );
				};
			},
			/** @summary ダイアログの呼び出し
			 * @param {String} dialogue 呼び出すダイアログの ID
			 * @param {Function} callback コールバック関数（省略可））
			 */
			invokeDialogue = function ( dialogue, callback ) {
				return function () {
					// if ( Medium.isEditing() ) {
					// 	Medium.rollbackEdit();
					// }
					// toastr.remove();

					LAURUS.dialogue.invoke( dialogue, this );

					if ( callback ) {
						callback();
					}
				};
			};

		$( "#wardrobe" )
			.on( "click", "#filter-category .filter-key", invokeDialogue( "category-filter" ) )
			.on( "click", "#filter-style .filter-key", invokeDialogue( "style-filter" ) )
			.on( "click", "#filter-tag .filter-key", invokeDialogue( "tag-filter" ) )
			.on( "click", "#filter-rarity .filter-key", invokeDialogue( "rarity-filter" ) )
			.on( "click", "#filter-score .filter-key", invokeDialogue( "score-filter" ) )

			.on( "click", "#list-item-style", changeStyleFor( "item" ) )
			.on( "click", "#card-item-style", changeStyleFor( "card" ) );

		// constructor
		$.each( [
			"10001", "10004", "20001", "20002", "30001", "30002", "40001", "40002", "50001", "50002",
			"60001", "60002"
		], function () {
			$( "#wardrobe-card-area" ).append( LAURUS.itemCard( this ) );
		} );

		$( ".item-sparkline" )
			.peity( "line", {
				strokeWidth: 2,
				height: 30,
				width: 60,
				delimiter: ",",
				fill: "rgba( 141, 214, 141, 0.2 )",
				max: 5,
				min: -5,
				stroke: "#8dd68d"
			} );

	};

	return {
		wakeup: _wakeup
	};
}() );

/** @type {Object} 各ページ初期化処理 */
LAURUS.wakeup = {
	laurus: function () {
		"use strict";

		// グローバルナビ
		$( "#general-navgation .ghost-button" )
			.on( "click", LAURUS.changeMode );
	},
	advisor: LAURUS.advisor.wakeup,
	wardrobe: LAURUS.wardrobe.wakeup,
	purveyor: function () {},
	credit: function () {},
	changelog: function () {},
	dialogue: LAURUS.dialogue.wakeup
};

/** @summary boot Laurus */
$( document ).ready( function () {
	"use strict";

	toastr.options = LAURUS.STATIC_ITEMS.TOASTR_LAURUS_OPTIONS;

	// initialize
	LAURUS.wakeup.laurus();
	LAURUS.wakeup.advisor();
	LAURUS.wakeup.wardrobe();
	LAURUS.wakeup.purveyor();
	LAURUS.wakeup.credit();
	LAURUS.wakeup.changelog();
	LAURUS.wakeup.dialogue();

	$( "#dialogue" ).perfectScrollbar();

	// $( "#advisor-button" ).click();
	$( "#wardrobe-button" ).click();
	// LAURUS.advisor.setStage( "8-1" );
} );
