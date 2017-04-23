/*jshint devel: true */
/*global toastr */

/** @type {Class} Laurus Package */
var LAURUS = {};

/** @type {Properties} 定数コレクション */
LAURUS.STATIC_ITEMS = ( function () {
	"use strict";

	var /** @type {Number} 全アイテム数 */
		_allRecords = 0,
		/** @type {Array} 属性値の対応値 */
		_valueIndex = [ "", "C", "B", "A", "S", "SS" ],

		/** @type {Object} アイテム分類一覧兼オーダー */
		_orderedList = {
			/** @type {Array} カテゴリ */
			CATEGORY: [
				"ヘアスタイル", "ドレス", "コート", "トップス", "ボトムス",
				"靴下", "シューズ", "ヘアアクセサリー", "耳飾り", "首飾り",
				"腕飾り", "手持品", "腰飾り", "特殊", "メイク"
			],
			/** @type {Array} スロット */
			SLOT: [
				"ヘアスタイル", "ドレス", "コート", "トップス", "ボトムス",
				"靴下", "アンクレット", "シューズ", "ヘッドアクセ", "ヴェール",
				"カチューシャ", "つけ耳", "耳飾り", "マフラー", "ネックレス",
				"右手飾り", "左手飾り", "手袋", "右手持ち", "左手持ち",
				"両手持ち", "腰飾り", "フェイス", "ボディ", "タトゥー",
				"羽根", "しっぽ", "前景", "後景", "吊り",
				"床", "肌", "メイク", "complex"
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
		/** @type {Object} カテゴリの定義 */
		_categoryDefs = {
			/** @type {Number} スロットの総数 */
			SLOT_COUNT: 40,
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
			},
			/** @type {Object} サブカテゴリを所持するカテゴリ */
			HAS_SUB: {
				hosiery: [ "hosiery", "anklet" ],
				headwear: [ "head-accessory", "veil", "headband", "false-ears" ],
				necklace: [ "scarf", "necklace" ],
				bracelet: [ "right-arm", "left-arm", "glove" ],
				handheld: [ "right-hand", "left-hand", "both-hand" ],
				special: [
					"face", "body", "tatoo", "wings", "tail",
					"foreground", "background", "hanging", "ground", "skin"
				]
			},
			/** @type {Object} コード正引き */
			CODE: {
				/** @type {Object} カテゴリ */
				CATEGORY: {
					hair: 1,
					dress: 2,
					coat: 3,
					tops: 4,
					bottoms: 5,
					hosiery: 6,
					shoes: 9,
					accessory: 11,
					headwear: 12,
					earrings: 17,
					necklace: 18,
					bracelet: 21,
					handheld: 25,
					waist: 29,
					special: 30,
					makeup: 10
				},
				/** @type {Object} スロット */
				SLOT: {
					"hair": 1,
					"dress": 2,
					"coat": 3,
					"tops": 4,
					"bottoms": 5,
					"hosiery": 7,
					"anklet": 8,
					"shoes": 9,
					"head-accessory": 13,
					"veil": 14,
					"headband": 15,
					"false-ears": 16,
					"earrings": 17,
					"scarf": 19,
					"necklace": 20,
					"right-arm": 22,
					"left-arm": 23,
					"glove": 24,
					"right-hand": 26,
					"left-hand": 27,
					"both-hand": 28,
					"waist": 29,
					"face": 31,
					"body": 32,
					"tatoo": 33,
					"wings": 34,
					"tail": 35,
					"foreground": 36,
					"background": 37,
					"hanging": 38,
					"ground": 39,
					"skin": 40,
					"makeup": 10
				}
			},
			/** @type {Object} コード逆引き */
			REVERSE: [
				"すべて", "ヘアスタイル", "ドレス", "コート", "トップス",
				"ボトムス", "靴下", "靴下", "アンクレット", "シューズ",
				"メイク", "アクセサリー", "ヘアアクセサリー", "ヘッドアクセ", "ヴェール",
				"カチューシャ", "つけ耳", "耳飾り", "首飾り", "マフラー",
				"ネックレス", "腕飾り", "右手飾り", "左手飾り", "手袋",
				"手持品", "右手持ち", "左手持ち", "両手持ち", "腰飾り",
				"特殊", "フェイス", "ボディ", "タトゥー", "羽根",
				"しっぽ", "前景", "後景", "吊り", "床",
				"肌", "complex"
			]
		},
		/** @type {Object} タグの定義 */
		_tagDefs = {
			/** @type {Number} タグの総数 */
			COUNT: 44,
			/** @type {Object} タグなしオブジェクト定義 */
			NONE_TAG: {
				TAG: "タグ選択",
				CLASS: "tag-none"
			},
			/** @type {Array} タグの対応値 */
			MAP: [
				"",
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
		/** @type {Object} ソートキー対応表 */
		_sortKeys = {
			"serial": "ID [標準]",
			"name": "名前",
			"rarity": "レアリティ",
			"tag-f": "タグF",
			"tag-l": "タグL",
			"tags": "タグ総合",
			"score": "スコア",
			"gorgeous": "華麗",
			"elegance": "エレガント",
			"mature": "大人",
			"sexy": "セクシー",
			"warm": "ウォーム",
			"simple": "シンプル",
			"lively": "アクティブ",
			"cute": "キュート",
			"pure": "ピュア",
			"cool": "クール"
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
		/** @type {Object} piety の Laurus カスタマイズオプション */
		_pietyLaurusOptions = {
			list: {
				strokeWidth: 2,
				height: 15,
				width: 40,
				delimiter: ",",
				fill: "rgba( 141, 214, 141, 0.2 )",
				max: 5,
				min: -5,
				stroke: "#8dd68d"
			},
			card: {
				strokeWidth: 2,
				height: 30,
				width: 60,
				delimiter: ",",
				fill: "rgba( 141, 214, 141, 0.2 )",
				max: 5,
				min: -5,
				stroke: "#8dd68d"
			}
		},

		/** @summary 全角の数字を半角に変換する
		 * @param  {String} number 全角数字の文字列
		 * @returns {String} 半角数字に変換した数字文字列
		 */
		_digit2Half = function ( digit ) {
			return digit.replace( /[０-９．]/g, function ( d ) {
				return String.fromCharCode( d.charCodeAt( 0 ) - 0xfee0 );
			} );
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
			/** @summary アイテムのシリアルコードからカテゴリとアイテム ID 特殊タグを復元する
			 * @param {Number} serial アイテムのシリアルコード
			 * @returns {Object} カテゴリと ID のペア
			 */
			categoryAndId: function ( serial ) {
				var CATEGORY_BASE = 10000;

				return {
					category: _categoryDefs.REVERSE[ Math.floor( serial / CATEGORY_BASE ) ],
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
		STYLE_DEFS: _styleDefs,
		CATEGORY_DEFS: _categoryDefs,
		TAG_DEFS: _tagDefs,
		SKILL_DEFS: _skillDefs,
		SORT_KEYS: _sortKeys,
		STAGE_STRUCTURE: _stageStructure,

		FADE_DURATION: _fadeDuration,
		TOASTR_LAURUS_OPTIONS: _toastrLaurusOptions,
		PIETY_LAURUS_OPTIONS: _pietyLaurusOptions,

		// static methods
		digitGrouping: _digitGrouping,
		digit2Half: _digit2Half,
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

/** @summary アイテムフィルタ
 * @param {Function} request フィルタ条件
 * @returns フィルタ結果のアイテムの配列
 */
LAURUS.filter = function ( request ) {
	"use strict";

	var items = [];

	$.each( LAURUS.WARDROBE, function ( serial ) {
		if ( request( this ) ) {
			items.push( serial );
		}
	} );

	return items;
};

/** @summary アイテムカードの生成
 * @param {Number} serial アイテムのシリアルコード
 * @returns {HTML} アイテムカードの HTML コード
 */
LAURUS.itemLine = function ( serial ) {
	"use strict";

	var // dependence
		WARDROBE = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		CATEGORY_DEFS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS,
		TAG_DEFS = LAURUS.STATIC_ITEMS.TAG_DEFS,
		VALUE_INDEX = LAURUS.STATIC_ITEMS.VALUE_INDEX,

		digitGrouping = LAURUS.STATIC_ITEMS.digitGrouping,
		restore = LAURUS.STATIC_ITEMS.restore,

		// item
		item = LAURUS.WARDROBE[ serial ],
		itemScore = LAURUS.SCORE[ serial ],
		keys = restore.categoryAndId( serial ),
		restoreAttributes = restore.attributes( item[ WARDROBE.ATTRIBUTES ] ),
		tag = restore.tag( item[ WARDROBE.TAGS ] ),

		// concrete HTML
		category = "<td><span class=\"" + CATEGORY_DEFS.MAP[ keys.category ] + "\"></span></td>",
		id = "<td>" + ( keys.id < 100 ? ( "000" + keys.id ).slice( -3 ) : keys.id ) + "</td>",
		name = "<td title=\"" + item[ WARDROBE.NAME ] + "\">" + item[ WARDROBE.NAME ] + "</span>",
		slot = ( function () {
			var
				slots = ( function () {
					var s = [];

					$.each( item[ WARDROBE.SLOTS ], function () {
						s.push( CATEGORY_DEFS.REVERSE[ this ] );
					} );

					return s;
				}() ),
				title = "",
				text = "";

			if ( 1 < item[ WARDROBE.SLOTS ].length ) {
				title = slots.join( ", " );
				text = "複合スロット";
			} else {
				title = "";
				text = slots[ 0 ];
			}

			return "<td title=\"" + title + "\">" + text + "</td>";
		}() ),
		rarity = "<td><span class=\"" + ( item[ WARDROBE.RARITY ] < 0 ? "with-animate" : "" ) + "\"><span class=\"laurus-icon\">&#x2606;</span>" + Math.abs( item[ WARDROBE.RARITY ] ) + "</span></td>",
		attributes = ( function () {
			var a = "";

			$.each( restore.attributes( item[ WARDROBE.ATTRIBUTES ] ), function () {
				var v = VALUE_INDEX[ Math.abs( this ) ];

				if ( 0 < this ) {
					a += "<td class=\"attributes-" + v + "\">" + v + "</td><td class=\"insparkly\">-</td>";
				} else {
					a += "<td class=\"insparkly\">-</td><td class=\"attributes-" + v + "\">" + v + "</td>";
				}
			} );

			return a;
		}() ),
		sparkline = "<td><span class=\"sparkline\">" + restoreAttributes.join( "," ) + "</span></td>",
		tags = "<td><span class=\"tag-" + TAG_DEFS.CLASSES[ tag[ 0 ] ] + "\"></span></td><td><span class=\"tag-" + TAG_DEFS.CLASSES[ tag[ 1 ] ] + "\"></span></td>",
		score = "<td>" + ( 0 < itemScore ? digitGrouping( itemScore ) : "-" ) + "</td>";

	return "<tr data-serial=\"" + serial + "\">" + category + id + name + slot + rarity + attributes + sparkline + tags + score + "</tr>";
};

/** @summary アイテムカードの生成
 * @param {Number} serial アイテムのシリアルコード
 * @returns {HTML} アイテムカードの HTML コード
 */
LAURUS.itemCard = function ( serial ) {
	"use strict";

	var // dependence
		WARDROBE = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		CATEGORY_MAP = LAURUS.STATIC_ITEMS.CATEGORY_DEFS.MAP,
		// CATEGORY_ICONS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS.ICONS,
		TAGS_CLASSES = LAURUS.STATIC_ITEMS.TAG_DEFS.CLASSES,
		VALUE_INDEX = LAURUS.STATIC_ITEMS.VALUE_INDEX,

		digitGrouping = LAURUS.STATIC_ITEMS.digitGrouping,
		restore = LAURUS.STATIC_ITEMS.restore,

		// item
		item = LAURUS.WARDROBE[ serial ],
		itemScore = LAURUS.SCORE[ serial ],
		keys = restore.categoryAndId( serial ),
		attributes = restore.attributes( item[ WARDROBE.ATTRIBUTES ] ),
		tag = restore.tag( item[ WARDROBE.TAGS ] ),

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
		name = "<span class=\"item-name\" title=\"" + item[ WARDROBE.NAME ] + "\"><span class=\"item-id\">" + ( keys.id < 100 ? ( "000" + keys.id ).slice( -3 ) : keys.id ) + "</span>" + item[ WARDROBE.NAME ] + "</span>",
		rarity = "<span class=\"item-rarity " + ( item[ WARDROBE.RARITY ] < 0 ? " with-animate" : "" ) + "\"><span class=\"laurus-icon\">&#x2606;</span>" + Math.abs( item[ WARDROBE.RARITY ] ) + "</span>",
		attributesTable = ( function () {
			var HEADER = "<table class=\"item-attributes\"><tbody>",
				FOOTER = "</tbody></table>",
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
				var v = VALUE_INDEX[ Math.abs( this ) ];

				if ( 0 < this ) {
					table.t.h += "<th></th>";
					table.t.b += "<td class=\"attributes-" + v + "\">●" + v + "</td>";
					table.b.h += "<th class=\"insparkly\"></th>";
					table.b.b += "<td class=\"insparkly\">-</td>";
				} else {
					table.t.h += "<th class=\"insparkly\"></th>";
					table.t.b += "<td class=\"insparkly\">-</td>";
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
		sparkline = "<span class=\"item-sparkline-box\"><span class=\"sparkline\">" + attributes.join( "," ) + "</span></span>",
		score = "<span class=\"item-score\">" + ( 0 < itemScore ? digitGrouping( itemScore ) : "-" ) + "</span>";

	return "<div class=\"item-card\" data-serial=\"" + serial + "\">" +
		"<div class=\"item-icon-box\">" + icon + tags + "</div>" +
		name + rarity +
		attributesTable + sparkline + score +
		"</div>";
};

/** @type {Class} ダイアログ */
LAURUS.dialogue = ( function () {
	"use strict";

	var // dependence
		FADE_DURATION = LAURUS.STATIC_ITEMS.FADE_DURATION,

		// private fields
		_dialogueContents = [],
		_$dialogue = null, // #dialogue
		_$dialoguePane = null, // #dialogue-pane, #dialogue
		_invoker = null,
		_disposeEvent = null,

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

			if ( _disposeEvent ) {
				_disposeEvent();
			}
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
		_invoke = function ( id, invoker, disposeEvent ) {
			var $content = _dialogueContents[ id ];

			_disposeEvent = disposeEvent || null;

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
				.on( "click", ".dialogue-close span", LAURUS.dialogue.dispose );

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

		digit2Half = LAURUS.STATIC_ITEMS.digit2Half,
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
				.text( tagId === 0 ? "タグ選択" : TAG_DEFS.MAP[ tagId ] );

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
						return "<span class=\"select-stage\" data-key=\"" + key + "\"><span>" + stage + "</span></span>";
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
							var value = digit2Half( $inputField.val() ),
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
									toastr.error( "0 から 99 までの数値または \"-\" を入力してください" );
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
							var value = digit2Half( $inputField.val() ),
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
									toastr.error( "0 から 99 までの数値を入力してください" );
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
				.on( "click", ".select-stage span", function () {
					_setStage( $( this ).parent().data( "key" ) );
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
				.on( "click", "#tag-select .tag span", function () {
					_setTag(( $( LAURUS.dialogue.getInvoker() ).attr( "id" ) === "criteria-tag-1" ? 1 : 2 ), $( this ).data( "tag-id" ) );
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

	var // dependence
		ALL_RECORDS = LAURUS.STATIC_ITEMS.ALL_RECORDS,
		WARDROBE = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		CATEGORY_DEFS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS,
		TAG_DEFS = LAURUS.STATIC_ITEMS.TAG_DEFS,
		SORT_KEYS = LAURUS.STATIC_ITEMS.SORT_KEYS,
		PIETY_LAURUS_OPTIONS = LAURUS.STATIC_ITEMS.PIETY_LAURUS_OPTIONS,
		CATEGORY = CATEGORY_DEFS.CODE.CATEGORY,
		SLOT = CATEGORY_DEFS.CODE.SLOT,

		digitGrouping = LAURUS.STATIC_ITEMS.digitGrouping,
		restore = LAURUS.STATIC_ITEMS.restore,

		/** @type {Class} フィルタ条件の管理・編集操作に関するクラス */
		Medium = ( function () {
			var /** @type {Array} レアリティマスク */
				_RARITY_MASK = [ 1, 2, 4, 8, 16, 32 ],
				/** @type {String} 現在のアイテム描写スタイル */
				_currentStyle = "list",
				/** @type {Object} フィルタ条件 */
				_condition = {
					slots: [],
					tags: [],
					word: "",
					rarity: 0
				},
				/** @type {Object} ソート条件 */
				_sortConfig = {
					key: "",
					order: ""
				},
				/** @type {Array} フィルタ結果 */
				_myWardrobe = [],

				/** @summary メディウムに設定されているフィルタ内容からカスタムフィルタを生成する
				 * @returns {Function} 設定項目に対応したカスタムフィルタ
				 */
				_makeFilterRequest = function () {
					var
						/** @type {MethodCollection} 各種フィルタの定義 */
						Filter = {
							category: ( function () {
								var slots = [];

								$.each( SLOT, function () {
									if ( _condition.slots[ this ] ) {
										slots.push( this );
									}
								} );

								if ( slots.length !== 0 && slots.length !== CATEGORY_DEFS.SLOT_COUNT ) {
									return function ( record ) {
										var isContain = true;

										$.each( record[ WARDROBE.SLOTS ], function () {
											isContain = isContain && ( 0 <= $.inArray( this, slots ) );
										} );

										return isContain;
									};
								} else {
									return function () {
										return true;
									};
								}
							}() ),
							tag: ( function () {
								var tags = [];

								$.each( _condition.tags, function ( id ) {
									if ( this ) {
										tags.push( id );
									}
								} );

								if ( tags.length === 0 ) {
									return function () {
										return true;
									};
								} else if ( tags.length === TAG_DEFS.COUNT ) {
									return function ( record ) {
										return 0 < record[ WARDROBE.TAGS ];
									};
								} else {
									return function ( record ) {
										var hasTag = restore.tag( record[ WARDROBE.TAGS ] );

										switch ( hasTag ) {
											case 0:
												return false;
											case 1:
												return 0 <= $.inArray( hasTag[ 0 ], tags );
											default:
												return ( 0 <= $.inArray( hasTag[ 0 ], tags ) ) || ( 0 <= $.inArray( hasTag[ 1 ], tags ) );
										}
									};
								}
							}() ),
							word: ( function () {
								if ( _condition.word === "" ) {
									return function () {
										return true;
									};
								} else {
									return function ( record ) {
										return record[ WARDROBE.NAME ].match( _condition.word ) !== null;
									};
								}
							}() ),
							rarity: ( function () {
								if ( _condition.rarity === 0 || _condition.rarity === 63 ) {
									return function () {
										return true;
									};
								} else {
									return function ( record ) {
										return 0 < ( _condition.rarity & _RARITY_MASK[ Math.abs( record[ WARDROBE.RARITY ] ) - 1 ] );
									};
								}
							}() )
						};

					return function ( record ) {
						return Filter.word( record ) &&
							Filter.category( record ) &&
							Filter.tag( record ) &&
							Filter.rarity( record );
					};
				},
				/** @summary メディウムに設定されているソート設定から Array.sort() 用の比較関数を生成する
				 * @returns {Function} 設定項目に対応した比較関数
				 */
				_makeSortCompareFunction = function () {
					var order = _sortConfig.order === "asc" ? 1 : -1,
						tag = function ( position ) {
							return function ( a, b ) {
								return ( restore.tag( LAURUS.WARDROBE[ a ][ WARDROBE.TAGS ] )[ position ] - restore.tag( LAURUS.WARDROBE[ b ][ WARDROBE.TAGS ] )[ position ] ) * order;
							};
						},
						attributes = function ( style, inv ) {
							return function ( a, b ) {
								var attrA = restore.attributes( LAURUS.WARDROBE[ a ][ WARDROBE.ATTRIBUTES ] )[ style ] * inv,
									attrB = restore.attributes( LAURUS.WARDROBE[ b ][ WARDROBE.ATTRIBUTES ] )[ style ] * inv;

								attrA = attrA < 0 ? 0 : attrA;
								attrB = attrB < 0 ? 0 : attrB;

								return ( attrA - attrB ) * order;
							};
						},
						compare = {
							"serial": function ( a, b ) {
								return ( LAURUS.WARDROBE[ a ][ WARDROBE.SERIAL ] - LAURUS.WARDROBE[ b ][ WARDROBE.SERIAL ] ) * order;
							},
							"name": function ( a, b ) {
								var nameA = LAURUS.WARDROBE[ a ][ WARDROBE.NAME ],
									nameB = LAURUS.WARDROBE[ b ][ WARDROBE.NAME ];

								return ( nameA < nameB ? -1 : nameA > nameB ? 1 : 0 ) * order;
							},
							"rarity": function ( a, b ) {
								return ( Math.abs( LAURUS.WARDROBE[ a ][ WARDROBE.RARITY ] ) - Math.abs( LAURUS.WARDROBE[ b ][ WARDROBE.RARITY ] ) ) * order;
							},
							"tag-f": tag( 0 ),
							"tag-l": tag( 1 ),
							"tags": function ( a, b ) {
								var tagsA = restore.tag( LAURUS.WARDROBE[ a ][ WARDROBE.TAGS ] ),
									tagsB = restore.tag( LAURUS.WARDROBE[ b ][ WARDROBE.TAGS ] );

								return ( ( !LAURUS.WARDROBE[ a ] ? 0 : ( tagsA[ 0 ] && tagsA[ 1 ] ) ? Math[ order === 1 ? "min" : "max" ]( tagsA[ 0 ], tagsA[ 1 ] ) : ( tagsA[ 0 ] || tagsA[ 1 ] ) ) -
									( !LAURUS.WARDROBE[ a ] ? 0 : ( tagsB[ 0 ] && tagsB[ 1 ] ) ? Math[ order === 1 ? "min" : "max" ]( tagsB[ 0 ], tagsB[ 1 ] ) : ( tagsB[ 0 ] || tagsB[ 1 ] ) ) ) * order;
							},
							"score": function ( a, b ) {
								console.log( "未実装" );
								return ( LAURUS.WARDROBE[ a ][ WARDROBE.SERIAL ] - LAURUS.WARDROBE[ b ][ WARDROBE.SERIAL ] ) * order;
							},
							"gorgeous": attributes( 0, 1 ),
							"elegance": attributes( 0, -1 ),
							"mature": attributes( 1, 1 ),
							"sexy": attributes( 1, -1 ),
							"warm": attributes( 2, 1 ),
							"simple": attributes( 2, -1 ),
							"lively": attributes( 3, 1 ),
							"cute": attributes( 3, -1 ),
							"pure": attributes( 4, 1 ),
							"cool": attributes( 4, -1 )
						};

					return compare[ _sortConfig.key ];
				},
				/** @summary フィルタリングされたアイテムを表示する */
				_display = ( function () {
					var _current = 0,
						_ITEMS = {
							list: function () {
								return 50;
							},
							card: function () {
								if ( _current === 0 ) {
									return 47;
								} else {
									return 48;
								}
							}
						},

						_isTerminate = function () {
							return _current === _myWardrobe.length;
						},
						_getToRecords = function () {
							var items = _ITEMS[ _currentStyle ]();

							return ( _current + items ) < _myWardrobe.length ? ( _current + items ) : _myWardrobe.length;
						},
						_write = function ( from, to ) {
							var html = "",
								proc = _currentStyle === "list" ? "itemLine" : "itemCard",
								more = {
									list: function () {
										var toRecords = _getToRecords();

										if ( toRecords === _myWardrobe.length ) {
											return "残りすべて表示する（全 " + digitGrouping( _myWardrobe.length ) + " 件うち " + digitGrouping( _current ) + " 件表示中）";
										} else {
											return "さらに " + ( toRecords - _current ) + " 件表示する（全 " + digitGrouping( _myWardrobe.length ) + " 件うち " + digitGrouping( _current ) + " 件表示中）";
										}
									},
									card: function () {
										var toRecords = _getToRecords();

										if ( toRecords === _myWardrobe.length ) {
											return "<span class=\"item-card-more\">残りすべて表示する</span>" +
												"<span class=\"item-card-current\">表示中：" + digitGrouping( _current ) + " 件</span>" +
												"<span class=\"item-card-all\">ヒット数：" + digitGrouping( _myWardrobe.length ) + " 件</span>";
										} else {
											return "<span class=\"item-card-more\">さらに " + ( _getToRecords() - _current ) + " 件表示する</span>" +
												"<span class=\"item-card-current\">表示中：" + digitGrouping( _current ) + " 件</span>" +
												"<span class=\"item-card-all\">ヒット数：" + digitGrouping( _myWardrobe.length ) + " 件</span>";
										}
									}
								};

							for ( var i = from; i < to; i += 1 ) {
								html += LAURUS[ proc ]( _myWardrobe[ i ] );
							}

							$( "#wardrobe-" + _currentStyle + "-area" )
								.append( html );
							$( "#wardrobe-" + _currentStyle + "-area .sparkline" )
								.peity( "line", PIETY_LAURUS_OPTIONS[ _currentStyle ] );

							_current = to;

							if ( !_isTerminate() ) {
								$( "#" + _currentStyle + "-more" )
									.html( more[ _currentStyle ]() )
									.show();
							}
						},
						_reset = function () {
							$( "#wardrobe-list-area, #wardrobe-card-area" )
								.empty();
							$( "#zero-records, #wardrobe-list-area-box, #wardrobe-card-area-box, #list-more, #card-more" )
								.hide();

							_current = 0;

							if ( _myWardrobe.length === 0 ) {
								$( "#zero-records" ).show();
							} else {
								$( "#wardrobe-" + _currentStyle + "-area-box" )
									.show();
								_write( _current, _getToRecords() );
							}
						},
						_init = function () {
							_myWardrobe.sort( _makeSortCompareFunction() );
							_reset();
						},
						_more = function () {
							$( "#list-more, #card-more" )
								.hide();

							_write( _current, _getToRecords() );
						};

					return {
						init: _init,
						more: _more,
						reset: _reset,
						isTerminate: _isTerminate
					};
				}() ),
				/** @summary フィルタリングでヒットしたレコード数を描写する
				 * @param {Number} records フィルタリングでヒットしたレコード
				 */
				_writeRecords = function ( records ) {
					var mode = records === 0 ? "no" : records === ALL_RECORDS ? "all" : "ord";

					$( "#hit-records-box" )
						.removeClass()
						.addClass( {
							no: "no-records",
							all: "all-records",
							ord: ""
						}[ mode ] );
					$( "#hit-records" )
						.text( {
							no: "no",
							all: ALL_RECORDS + " (all)",
							ord: records
						}[ mode ] );
				},
				/** @summary メディウムに記録されているフィルタ項目からフィルタリングして結果を描写する */
				_execFilter = function () {
					_myWardrobe = LAURUS.filter( _makeFilterRequest() );
					_writeRecords( _myWardrobe.length );
					_display.init();
				},
				/** @type {MethodCollection} カテゴリフィルタの操作 */
				_category = ( function () {
					var
						/** @summary 該当するカテゴリボタンを活性化させる
						 * @param {Number} slot スロット ID
						 */
						_on = function ( slot ) {
							$( "#category-filter [data-slot=\"" + slot + "\"]" )
								.addClass( "sparkly" );
						},
						/** @summary 該当するカテゴリボタンを不活性化させる
						 * @param {Number} slot スロット ID
						 */
						_off = function ( slot ) {
							$( "#category-filter [data-slot=\"" + slot + "\"]" )
								.removeClass( "sparkly" );
						},
						/** @summary 該当するカテゴリボタンの活性 / 不活性化状態を切り替え、メディウムのカテゴリフィルタ条件に登録する
						 * @param {Number} slot スロット ID
						 */
						_change = function ( slot ) {
							var $sub = $( "#category-filter [data-slot=\"" + slot + "\"]" ).parent().parent(),
								toOn = function ( s ) {
									_condition.slots[ s ] = true;
									_on( s );
								},
								toOff = function ( s ) {
									_condition.slots[ s ] = false;
									_off( s );
								},
								changeBase = function ( proc, supplementary, isAccessorySlot ) {
									proc( slot );

									$( "#category-filter .fake-hover" ).each( function () {
										proc( $( this ).data( "slot" ) );
									} );

									if ( $sub.hasClass( "sub-category" ) && supplementary() ) {
										proc( $sub.data( "parent" ) );
									}

									if ( isAccessorySlot() ) {
										proc( CATEGORY.accessory );
									}
								};

							if ( !_condition.slots[ slot ] ) {
								changeBase( toOn, function () {
									return $sub.find( "[data-slot]" ).length === $sub.find( ".sparkly" ).length;
								}, function () {
									return $( "#category-filter [data-accessory] [data-slot]" ).length === $( "#category-filter [data-accessory] .sparkly" ).length;
								} );
							} else {
								changeBase( toOff, function () {
									return true;
								}, function () {
									return $( "#category-filter [data-slot=\"" + slot + "\"]" ).parents( ".category-line" ).data( "accessory" );
								} );
							}
						},
						/** @summary すべてのカテゴリを活性化または不活性化させる */
						_all = function () {
							var i = 0,
								count = 0,
								parameter = false,
								proc = null;

							for ( i = 1; i <= CATEGORY_DEFS.SLOT_COUNT; i += 1 ) {
								count += _condition.slots[ i ] ? 1 : 0;
							}

							if ( count === CATEGORY_DEFS.SLOT_COUNT ) { // すべて解除
								parameter = false;
								proc = _off;
							} else { // すべて選択
								parameter = true;
								proc = _on;
							}

							for ( i = 1; i <= CATEGORY_DEFS.SLOT_COUNT; i += 1 ) {
								_condition.slots[ i ] = parameter;
								proc( i );
							}
						},
						/** @summary メディウムのカテゴリフィルタ条件および UI の活性状態をリセットする */
						_clear = function () {
							for ( var i = 0; i <= CATEGORY_DEFS.SLOT_COUNT; i += 1 ) {
								_condition.slots[ i ] = false;
							}
							$( "#category-filter [data-slot]" )
								.removeClass( "sparkly" );
						},
						/** @summary メディウムのカテゴリフィルタ条件から UI 表示用ラベルを生成する */
						_setLabel = function () {
							var count = 0,
								$label = $( "#filter-category .filter-key" ),
								/** @summary スロットラベルのファクトリ
								 * @param {Object} dic スロット参照ディクショナリ
								 * @param {String} cat カテゴリクラス（ "major" or "minor"）
								 * @param {Function} childProc 子スロットに対する処理定義
								 */
								labelFactory = function ( dic, cat, childProc ) {
									return function ( nonuse, slot ) {
										var code = dic[ slot ];

										if ( _condition.slots[ code ] ) {
											$label.append( "<span class=\"" + cat + "\">" + CATEGORY_DEFS.REVERSE[ code ] + "</span>" );
										} else if ( childProc ) {
											childProc( slot );
										}
									};
								},
								/** @summary 独身スロット処理
								 * @param {null} nonuse 不使用（ jQuery.each 処理の引数用）
								 * @param {String} slot スロット名
								 */
								singleSlot = labelFactory( CATEGORY, "major" ),
								/** @summary 子持ちスロット処理生成ファクトリ
								 * @param {Function} children 子スロットに対する処理定義
								 */
								familySlotFactory = function ( children ) {
									return labelFactory( CATEGORY, "major", function ( slot ) {
										children( slot );
									} );
								},
								/** @summary 子持ちスロット処理
								 * @param {null} nonuse 不使用（ jQuery.each 処理の引数用）
								 * @param {String} slot スロット名
								 */
								familySlot = familySlotFactory( function ( family ) {
									$.each( CATEGORY_DEFS.HAS_SUB[ family ], labelFactory( SLOT, "minor" ) );
								} ),
								/** @summary ラベルを生成する
								 * @param {Object} 各スロット処理定義オブジェクト
								 */
								colony = function ( slots ) {
									$.each( slots, function ( slot, proc ) {
										proc( null, slot );
									} );
								};

							for ( var i = 1; i <= CATEGORY_DEFS.SLOT_COUNT; i += 1 ) {
								count += _condition.slots[ i ] ? 1 : 0;
							}

							if ( count === 0 || count === CATEGORY_DEFS.SLOT_COUNT ) {
								$label.text( "すべて" );
							} else {
								$label.empty();

								colony( {
									hair: singleSlot,
									dress: singleSlot,
									coat: singleSlot,
									tops: singleSlot,
									bottoms: singleSlot,
									hosiery: familySlot,
									shoes: singleSlot,
									accessory: familySlotFactory( function () {
										colony( {
											headwear: familySlot,
											earrings: singleSlot,
											necklace: familySlot,
											bracelet: familySlot,
											handheld: familySlot,
											waist: singleSlot,
											special: familySlot
										} );
									} ),
									makeup: singleSlot
								} );
							}

						},
						/** @summary サブカテゴリを持つスロット伝搬用疑似 hover（開始）イベントファクトリ
						 * @param {Number} slot スロット
						 * @returns {Function} スロット伝搬用イベント
						 */
						_fakeMouseenter = function ( slot ) {
							return function () {
								$( "#category-filter .sub-category[data-" + slot + "] [data-slot]" )
									.addClass( "fake-hover" );
							};
						},
						/** @summary サブカテゴリを持つスロット伝搬用疑似 hover（終了）イベントファクトリ
						 * @param {Number} slot スロット
						 * @returns {function} スロット伝搬用イベント
						 */
						_fakeMouseleave = function ( slot ) {
							return function () {
								$( "#category-filter .sub-category[data-" + slot + "] [data-slot]" )
									.removeClass( "fake-hover" );
							};
						},
						/** @summary メディウムに保持されているカテゴリフィルタの条件から UI をセットする */
						_setUIs = function () {
							for ( var i = 1; i <= CATEGORY_DEFS.SLOT_COUNT; i += 1 ) {
								if ( _condition.slots[ i ] ) {
									_on( i );
								} else {
									_off( i );
								}
							}
						},
						/** @summary カテゴリフィルタダイアログの初期化 */
						_initialize = function () {
							var slots = [],
								i = 0;

							_setUIs();

							for ( i = 0; i <= CATEGORY_DEFS.SLOT_COUNT; i += 1 ) {
								slots[ i ] = 0;
							}

							$.each( LAURUS.WARDROBE, function () {
								$.each( this[ WARDROBE.SLOTS ], function () {
									slots[ this ] += 1;
								} );
							} );

							$.each( CATEGORY_DEFS.HAS_SUB, function ( category ) {
								$.each( this, function () {
									slots[ CATEGORY[ category ] ] += slots[ SLOT[ this ] ];
								} );
							} );

							slots[ CATEGORY.accessory ] = slots[ CATEGORY.headwear ] + slots[ CATEGORY.earrings ] + slots[ CATEGORY.necklace ] + slots[ CATEGORY.bracelet ] + slots[ CATEGORY.handheld ] + slots[ CATEGORY.waist ] + slots[ CATEGORY.special ];

							for ( i = 1; i <= CATEGORY_DEFS.SLOT_COUNT; i += 1 ) {
								$( "#category-filter [data-slot=\"" + i + "\"] .has" ).text( slots[ i ] );
							}
						};

					return {
						initialize: _initialize,
						change: _change,
						clear: _clear,
						all: _all,
						setLabel: _setLabel,
						fakeMouseenter: _fakeMouseenter,
						fakeMouseleave: _fakeMouseleave
					};
				}() ),
				/** @type {MethodCollection} タグフィルタの操作 */
				_tag = ( function () {
					var
						/** @summary 該当するタグボタンを活性化させる
						 * @param {Number} tagId タグ ID
						 */
						_on = function ( tagId ) {
							$( "#tag-filter [data-tag-id=\"" + tagId + "\"]" )
								.addClass( "sparkly" );
						},
						/** @summary 該当するタグボタンを不活性化させる
						 * @param {Number} tagId タグ ID
						 */
						_off = function ( tagId ) {
							$( "#tag-filter [data-tag-id=\"" + tagId + "\"]" )
								.removeClass( "sparkly" );
						},
						/** @summary 該当するタグボタンの活性 / 不活性化状態を切り替え、メディウムのタグフィルタ条件に登録する
						 * @param {Number} tagId タグ ID
						 */
						_change = function ( tagId ) {
							if ( !_condition.tags[ tagId ] ) {
								_condition.tags[ tagId ] = true;
								_on( tagId );
							} else {
								_condition.tags[ tagId ] = false;
								_off( tagId );
							}
						},
						/** @summary メディウムに保持されているタグフィルタの条件から UI をセットする */
						_setUIs = function () {
							for ( var i = 1; i <= TAG_DEFS.COUNT; i += 1 ) {
								if ( _condition.tags[ i ] ) {
									_on( i );
								} else {
									_off( i );
								}
							}
						},
						/** @summary すべてのタグを活性化または不活性化させる */
						_all = function () {
							var i = 0,
								count = 0,
								parameter = false,
								proc = null;

							for ( i = 1; i <= TAG_DEFS.COUNT; i += 1 ) {
								count += _condition.tags[ i ] ? 1 : 0;
							}

							if ( count === TAG_DEFS.COUNT ) { // すべて解除
								parameter = false;
								proc = _off;
							} else { // すべて選択
								parameter = true;
								proc = _on;
							}

							for ( i = 1; i <= TAG_DEFS.COUNT; i += 1 ) {
								_condition.tags[ i ] = parameter;
								proc( i );
							}
						},
						/** @summary メディウムのタグフィルタ条件および UI の活性状態をリセットする */
						_clear = function () {
							for ( var i = 0; i <= TAG_DEFS.COUNT; i += 1 ) {
								_condition.tags[ i ] = false;
							}
							$( "#tag-filter [data-tag-id]" )
								.removeClass( "sparkly" );
						},
						/** @summary メディウムのタグフィルタ条件から UI 表示用ラベルを生成する */
						_setLabel = function () {
							var i = 0,
								count = 0,
								$label = $( "#filter-tag .filter-key" );

							for ( i = 1; i <= TAG_DEFS.COUNT; i += 1 ) {
								count += _condition.tags[ i ] ? 1 : 0;
							}

							if ( count === 0 ) {
								$label.text( "指定なし" );
							} else if ( count === TAG_DEFS.COUNT ) {
								$label.text( "タグを持っているもの" );
							} else {
								$label.empty();

								for ( i = 1; i <= TAG_DEFS.COUNT; i += 1 ) {
									if ( _condition.tags[ i ] ) {
										$label.append( "<span class=\"" + TAG_DEFS.CLASSES[ i ] + "\">" + TAG_DEFS.MAP[ i ] + "</span>" );
									}
								}
							}
						},
						/** @summary タグフィルタダイアログの初期化 */
						_initialize = function () {
							var tags = [],
								id = 0;

							_setUIs();

							for ( id = 0; id <= TAG_DEFS.COUNT; id += 1 ) {
								tags[ id ] = 0;
							}

							$.each( LAURUS.WARDROBE, function () {
								var t = restore.tag( this[ WARDROBE.TAGS ] );

								tags[ t[ 0 ] ] += 1;
								tags[ t[ 1 ] ] += 1;
							} );

							for ( id = 1; id <= TAG_DEFS.COUNT; id += 1 ) {
								$( "#tag-filter [data-tag-id=\"" + id + "\"] .has" ).text( tags[ id ] );
							}
						};

					return {
						initialize: _initialize,
						change: _change,
						clear: _clear,
						all: _all,
						setLabel: _setLabel
					};
				}() ),
				/** @type {MethodCollection} ワードフィルタの操作 */
				_word = ( function () {
					var
						/** @summary 初期動作 */
						_initialize = function () {
							$( "#filter-word" ).select();
						},
						/** @summary ワードフィルタの内容をメディウムに登録する */
						_change = function () {
							_condition.word = $( "#filter-word" ).val();
							_execFilter();
						},
						/** @summary 空メソッド。resetUI で呼び出されるため */
						_setLabel = function () { },
						/** @summary メディウムのワードフィルタ条件および UI の入力内容をリセットする */
						_clear = function () {
							_condition.word = "";
							$( "#filter-word" ).val( "" );
						};

					return {
						initialize: _initialize,
						change: _change,
						clear: _clear,
						setLabel: _setLabel
					};
				}() ),
				/** @type {MethodCollection} レアリティフィルタの操作 */
				_rarity = ( function () {
					var
						/** @summary 該当するレアリティボタンを活性化させる
						 * @param {Number} rarity レアリティ
						 */
						_on = function ( rarity ) {
							$( "#rarity-filter [data-rarity=\"" + rarity + "\"]" )
								.addClass( "sparkly" );
						},
						/** @summary 該当するレアリティボタンを不活性化させる
						 * @param {Number} rarity レアリティ
						 */
						_off = function ( rarity ) {
							$( "#rarity-filter [data-rarity=\"" + rarity + "\"]" )
								.removeClass( "sparkly" );
						},
						/** @summary 該当するレアリティボタンの活性 / 不活性化状態を切り替え、メディウムのレアリティフィルタ条件に登録する
						 * @param {Number} rarity レアリティ
						 */
						_change = function ( rarity ) {
							var mask = _RARITY_MASK[ rarity - 1 ];

							if ( !( _condition.rarity & mask ) ) {
								_condition.rarity += mask;
								_on( rarity );
							} else {
								_condition.rarity -= mask;
								_off( rarity );
							}
						},
						/** @summary メディウムに保持されているレアリティフィルタの条件から UI をセットする */
						_setUIs = function () {
							$.each( _RARITY_MASK, function ( index ) {
								if ( _condition.rarity & this ) {
									_on( index + 1 );
								} else {
									_off( index + 1 );
								}
							} );
						},
						/** @summary メディウムのレアリティフィルタ条件および UI の活性状態をリセットする */
						_clear = function () {
							_condition.rarity = 0;
							$( "#rarity-filter [data-rarity]" )
								.removeClass( "sparkly" );
						},
						/** @summary メディウムのレアリティフィルタ条件から UI 表示用ラベルを生成する */
						_setLabel = function () {
							var rarity = _condition.rarity,
								$label = $( "#filter-rarity .filter-key" );

							if ( rarity === 0 || rarity === 63 ) {
								$( "#filter-rarity .filter-key" ).text( "すべて" );
							} else {
								$label.empty();

								$.each( _RARITY_MASK, function ( index ) {
									if ( _condition.rarity & this ) {
										$label.append( "<span class=\"rarity\"><span class=\"laurus-icon\">&#x2606;</span>" + ( index + 1 ) + "</span>" );
									}
								} );
							}
						},
						/** @summary レアリティフィルタダイアログの初期化 */
						_initialize = function () {
							var count = [ 0, 0, 0, 0, 0, 0 ];

							_setUIs();

							$.each( LAURUS.WARDROBE, function () {
								count[ Math.abs( this[ WARDROBE.RARITY ] ) - 1 ] += 1;
							} );

							$.each( count, function ( rarity ) {
								$( "#rarity-filter [data-rarity=\"" + ( rarity + 1 ) + "\"] .has" ).text( this );
							} );
						};

					return {
						initialize: _initialize,
						change: _change,
						clear: _clear,
						setLabel: _setLabel
					};
				}() ),
				_sort = ( function () {
					var
						/** @summary ソートオーダー / ソートキーを選択してメディウムに登録する
						 * @param {String} key ソートオーダー / ソートキー
						 */
						_change = function ( key ) {
							var target = /asc|desc/.test( key ) ? "order" : "key";

							_sortConfig[ target ] = key;
							$( "#sort-config-" + target + " [data-key]" )
								.removeClass();
							$( "#sort-config-" + target + " [data-key=\"" + key + "\"]" )
								.addClass( "sparkly" );
						},
						/** @summary メディウムのソート条件から UI 表示用ラベルを生成する */
						_setLabel = function () {
							var
								NUMERIC = {
									asc: "1 → 9",
									desc: "9 → 1"
								},
								LEXICOGRAPHIC = {
									asc: "A → Z",
									desc: "Z → A"
								},
								RARITY = {
									asc: "<span class=\"rarity\"><span class=\"laurus-icon\">&#x2606;</span>1</span> → <span class=\"rarity\"><span class=\"laurus-icon\">&#x2606;</span>6</span>",
									desc: "<span class=\"rarity\"><span class=\"laurus-icon\">&#x2606;</span>6</span> → <span class=\"rarity\"><span class=\"laurus-icon\">&#x2606;</span>1</span>"
								},
								TAG = {
									asc: "<span class=\"sun-care\"></span> → <span class=\"paramedics\"></span>",
									desc: "<span class=\"paramedics\"></span> → <span class=\"sun-care\"></span>"
								},
								STYLE = {
									asc: "<span class=\"value none\">-</span> → <span class=\"value s\">SS</span>",
									desc: "<span class=\"value s\">SS</span> → <span class=\"value none\">-</span>"
								},
								orderText = {
									"serial": NUMERIC,
									"name": LEXICOGRAPHIC,
									"rarity": RARITY,
									"tag-f": TAG,
									"tag-l": TAG,
									"tags": TAG,
									"score": NUMERIC,
									"gorgeous": STYLE,
									"elegance": STYLE,
									"mature": STYLE,
									"sexy": STYLE,
									"warm": STYLE,
									"simple": STYLE,
									"lively": STYLE,
									"cute": STYLE,
									"pure": STYLE,
									"cool": STYLE
								};

							$( "#sort-key .filter-key" )
								.html( SORT_KEYS[ _sortConfig.key ] + " ( " + orderText[ _sortConfig.key ][ _sortConfig.order ] + " )" );
						},
						/** @summary メディウムのソート条件をリセットする */
						_clear = function () {
							_sortConfig.key = "serial";
							_sortConfig.order = "asc";
						},
						/** @summary メディウムに保持されているソート条件から UI をセットする */
						_setUIs = function () {
							_change( _sortConfig.order );
							_change( _sortConfig.key );
						},
						/** @summary 並び替え設定ダイアログの初期化 */
						_initialize = _setUIs;

					return {
						change: _change,
						setLabel: _setLabel,
						clear: _clear,
						initialize: _initialize
					};
				}() ),
				/** @summary アイテムデータ描写スタイルの変更する
				 * @param {String} 描写スタイル識別子
				 */
				_changeStyle = function ( style ) {
					_currentStyle = style;

					if ( _currentStyle === "list" ) {
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

					_display.reset();
				},
				/** @summary フィルタ条件編集 UI の初期化 */
				_initialize = function () {
					$.each( [ _category, _tag, _word, _rarity, _sort ], function () {
						this.clear();
						this.setLabel();
					} );
				},
				/** @summary フィルタ条件編集 UI の初期化とフィルタ実行 */
				_resetUI = function () {
					_initialize();
					_execFilter();
				};

			return {
				category: _category,
				tag: _tag,
				word: _word,
				rarity: _rarity,
				sort: _sort,

				initialize: _initialize,
				resetUI: _resetUI,
				changStyle: _changeStyle,
				execFilter: _execFilter,
				display: _display
			};
		}() ),
		/** @summary Wardrobe の初期化処理 */
		_wakeup = function () {
			var /** @summary 描写スタイルの選択ボタンイベント用包括関数
				 * @param {String} style 描写スタイル識別子
				 */
				changeStyleFor = function ( style ) {
					return function () {
						Medium.changStyle( style );
					};
				},
				/** @summary メディウム変更イベント関数を生成する（ダイアログイベント用）
				 * @param {String} 対象メディウム
				 * @param {String} 参照するデータ属性値
				 * @returns {Function} メディウム変更イベント
				 */
				mediumChangeEventFactory = function ( medium, dataAttribute ) {
					return function () {
						Medium[ medium ].change( $( this ).data( dataAttribute ) );
					};
				},
				/** @summary ダイアログの呼び出し
				 * @param {String} filter フィルター名
				 * @returns {Function} ダイアログ呼び出しイベント関数
				 */
				invokeDialogue = function ( filter ) {
					return function () {
						LAURUS.dialogue.invoke( filter + "-filter", this, function () {
							Medium[ filter ].setLabel();
							Medium.execFilter();
						} );
						Medium[ filter ].initialize();
					};
				};

			$( "#wardrobe" )
				.on( "click", "#filter-reset", Medium.resetUI )
				.on( "click", "#filter-category .filter-key", invokeDialogue( "category" ) )
				.on( "click", "#filter-tag .filter-key", invokeDialogue( "tag" ) )
				.on( "focus", "#filter-word", Medium.word.initialize )
				.on( "blur", "#filter-word", Medium.word.change )
				.on( "click", "#filter-rarity .filter-key", invokeDialogue( "rarity" ) )
				.on( "click", "#sort-key .filter-key", invokeDialogue( "sort" ) )
				.on( "click", "#list-item-style", changeStyleFor( "list" ) )
				.on( "click", "#card-item-style", changeStyleFor( "card" ) )
				.on( "click", "#list-more, #card-more", Medium.display.more );

			$( "#dialogue" )
				// カテゴリフィルタ
				.on( "click", "[data-slot]", mediumChangeEventFactory( "category", "slot" ) )
				.on( "mouseenter", "[data-slot=\"" + CATEGORY.accessory + "\"]", function () {
					$( "#category-filter [data-accessory] [data-slot]" ).addClass( "fake-hover" );
				} )
				.on( "mouseleave", "[data-slot=\"" + CATEGORY.accessory + "\"]", function () {
					$( "#category-filter [data-accessory] [data-slot]" ).removeClass( "fake-hover" );
				} )
				.on( "click", "#category-filter-all span", Medium.category.all )
				// タグフィルタ
				.on( "click", "[data-tag-id]", mediumChangeEventFactory( "tag", "tag-id" ) )
				.on( "click", "#tag-filter-all span", Medium.tag.all )
				// レアリティフィルタ
				.on( "click", ".rarity", mediumChangeEventFactory( "rarity", "rarity" ) )
				.on( "click", "#rarity-filter-reset span", Medium.rarity.clear )
				// ソートフィルタ
				.on( "click", "[data-key]", mediumChangeEventFactory( "sort", "key" ) );

			$( "#laurus" )
				.on( "click", "[data-serial]", function () {
					console.log( $( this ).data( "serial" ) );
				} );

			$.each( CATEGORY_DEFS.HAS_SUB, function ( category ) {
				$( "#dialogue" )
					.on( "mouseenter", "[data-slot=\"" + CATEGORY[ category ] + "\"]", Medium.category.fakeMouseenter( category ) )
					.on( "mouseleave", "[data-slot=\"" + CATEGORY[ category ] + "\"]", Medium.category.fakeMouseleave( category ) );
			} );

			// constructor
			Medium.initialize();
		},

		/** @summary Wardrobe のモード切替時処理 */
		_changeMode = Medium.execFilter;

	return {
		wakeup: _wakeup,
		changeMode: _changeMode
	};
}() );

/** @summary モード（ページ）チェンジ */
LAURUS.changeMode = function () {
	"use strict";

	var mode = $( this ).data( "mode" );

	toastr.remove();

	$( "#general-navgation .ghost-button" ).removeClass( "current-mode" );

	$( this ).addClass( "current-mode" );
	$( "#header" ).attr( "class", mode );

	$( "#current-mode" ).text( mode.charAt( 0 ).toUpperCase() + mode.substring( 1 ) );

	$( ".tab" ).hide();
	$( "#" + mode ).show();

	if ( LAURUS[ mode ].changeMode ) {
		LAURUS[ mode ].changeMode();
	}
};

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
	purveyor: function () { },
	credit: function () { },
	changelog: function () { },
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
	// LAURUS.advisor.setStage( "8-1" );

	$( "#wardrobe-button" ).click();
} );
