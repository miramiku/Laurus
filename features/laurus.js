/*global toastr, JSON */

/** @type {Class} Laurus Package */
var LAURUS = {};

/** @type {Properties} 定数コレクション */
LAURUS.STATIC_ITEMS = ( function () {
	"use strict";

	var /** @type {Number} 全アイテム数 */
		_allRecords = 0,
		/** @type {Object} スタイル評価値の定義 */
		_values = {
			/** @type {Array} 属性値の対応値 */
			INDEX: [ "", "C", "B", "A", "S", "SS", "SSS" ],
			/** @type {Array} 属性係数 */
			FACTOR: [ 0, 817.5, 1309.8, 1690.65, 2089.35, 2612.7, 3200.0 ],
			/** @type {Object} 属性コードからインデックス逆引き */
			CODE: {
				"-": 0,
				C: 1,
				B: 2,
				A: 3,
				S: 4,
				SS: 5,
				SSS: 6
			}
		},
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
			/** @type {Object} スタイルウェイトの範囲 */
			STYLES: {
				initial: 1,
				floor: 0,
				ceil: 99
			},
			/** @type {Array} タグボーナス係数の範囲 */
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
				SKILL: 7,
				BLACKLIST: 8,
				WHITELIST: 9
			},
			STYLE: {
				GORGEOUS: 0,
				SIMPLE: 1,
				ELEGANCE: 2,
				LIVELY: 3,
				MATURE: 4,
				CUTE: 5,
				SEXY: 6,
				PURE: 7,
				WARM: 8,
				COOL: 9
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
			/** @type {Array} スロットリスト */
			SLOT_LIST: [
				"hair", "dress", "coat", "tops", "bottoms",
				"hosiery", "anklet", "shoes", "makeup", "hair-ornaments",
				"veil", "hairpin", "ear", "earrings", "scarf",
				"necklace", "right-hand-ornaments", "left-hand-ornaments", "glove", "right-hand-holding",
				"left-hand-holding", "both-hand-holding", "waist", "face", "brooch",
				"tatoo", "wing", "tail", "foreground", "background",
				"head-ornaments", "ground", "skin", "complex"
			],
			/** @type {Array} スロットコード対応表 */
			SLOT: [
				"all", "hair", "dress", "coat", "tops",
				"bottoms", "hosiery", "hosiery", "anklet", "shoes",
				"makeup", "accessory", "headwear", "hair-ornaments", "veil",
				"hairpin", "ear", "earrings", "necklace", "scarf",
				"necklace", "bracelet", "right-hand-ornaments", "left-hand-ornaments", "glove",
				"handheld", "right-hand-holding", "left-hand-holding", "both-hand-holding", "waist",
				"special", "face", "brooch", "tatoo", "wing",
				"tail", "foreground", "background", "head-ornaments", "ground",
				"skin", "complex"
			],
			/** @type {Array} アクセサリリスト */
			ACCESSORY_LIST: [
				/* headwear */ "hair-ornaments", "veil", "hairpin", "ear",
				/* earrings */ "earrings",
				/* necklace */ "scarf", "necklace",
				/* bracelet */ "right-hand-ornaments", "left-hand-ornaments", "glove",
				/* handheld */ "right-hand-holding", "left-hand-holding", "both-hand-holding",
				/* waist    */ "waist",
				/* special  */ "face", "brooch", "tatoo", "wing", "tail", "foreground", "background", "head-ornaments", "ground", "skin"
			],
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
				headwear: [ "hair-ornaments", "veil", "hairpin", "ear" ],
				necklace: [ "scarf", "necklace" ],
				bracelet: [ "right-hand-ornaments", "left-hand-ornaments", "glove" ],
				handheld: [ "right-hand-holding", "left-hand-holding", "both-hand-holding" ],
				special: [
					"face", "brooch", "tatoo", "wing", "tail",
					"foreground", "background", "head-ornaments", "ground", "skin"
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
					"hair-ornaments": 13,
					"veil": 14,
					"hairpin": 15,
					"ear": 16,
					"earrings": 17,
					"scarf": 19,
					"necklace": 20,
					"right-hand-ornaments": 22,
					"left-hand-ornaments": 23,
					"glove": 24,
					"right-hand-holding": 26,
					"left-hand-holding": 27,
					"both-hand-holding": 28,
					"waist": 29,
					"face": 31,
					"brooch": 32,
					"tatoo": 33,
					"wing": 34,
					"tail": 35,
					"foreground": 36,
					"background": 37,
					"head-ornaments": 38,
					"ground": 39,
					"skin": 40,
					"makeup": 10
				}
			},
			/** @type {Array} コード逆引き */
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
			],
			/** @type {Array} スロットにおけるスコア倍率 */
			SCALE: [
				0,
				0.5, 2, 0.2, 1, 1,
				0, 0.3, 0.3, 0.4, 0.1,
				0, 0, 0.2, 0.2, 0.2,
				0.2, 0.2, 0, 0.2, 0.2,
				0, 0.2, 0.2, 0.2, 0,
				0.2, 0.2, 0.2, 0.2, 0,
				0.2, 0.2, 0.2, 0.2, 0.2,
				0.2, 0.2, 0.2, 0.2, 0.2
			],
			/** @type {Array} アクセサリの装着数による減衰率 */
			DAMPING: [
				1, 1, 1, 0.95, 0.9,
				0.825, 0.75, 0.7, 0.65, 0.6,
				0.55, 0.51, 0.475, 0.45, 0.425,
				0.4, 0.4, 0.4, 0.4, 0.4,
				0.4, 0.4, 0.4
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
			],
			/** @type {Object} タグ名→コードの逆引き */
			REVERSE: {
				"tag-none": 0,
				"sun-care": 1,
				"dance": 2,
				"floral": 3,
				"winter": 4,
				"britain": 5,
				"swimsuit": 6,
				"shower": 7,
				"kimono": 8,
				"pajamas": 9,
				"wedding": 10,
				"army": 11,
				"office": 12,
				"apron": 13,
				"cheogsam": 14,
				"maiden": 15,
				"evening-gown": 16,
				"navy": 17,
				"traditional": 18,
				"bunny": 19,
				"lady": 20,
				"lolita": 21,
				"gothic": 22,
				"sports": 23,
				"harajuku": 24,
				"preppy": 25,
				"unisex": 26,
				"future": 27,
				"fairy": 28,
				"rock": 29,
				"denim": 30,
				"pet": 31,
				"goddess": 32,
				"pop": 33,
				"homewear": 34,
				"chinese-classical": 35,
				"hindu": 36,
				"republic-of-china": 37,
				"european": 38,
				"swordman": 39,
				"rain": 40,
				"modern-china": 41,
				"dryad": 42,
				"bohemia": 43,
				"paramedics": 44
			}
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
			/** @type {Objet} スキル名対応表 */
			MAP: {
				"smile": "ニキ・スマイル",
				"critical-eye": "厳しい視線",
				"pickly-immune": "視線無効",
				"charming": "投げキッス",
				"gift": "Xmasプレゼント",
				"gift-immune": "プレゼント無効",
				"clock": "シンデレラ",
				"clock-immune": "シンデレラ無効",
				"sleeping": "眠りの呪い",
				"true-love": "愛の口づけ",
				"pickly-bounce": "視線反射",
				"gift-bounce": "プレゼントはじき",
				"cinderella": "シンデレラ反射"
			},
			/** @type {Objet} シナリオクラス対応値 */
			SCENARIO_CLASS: {
				"GIRL": 0,
				"PRINCESS": 1
			}
		},
		/** @type {Object} ソートキー対応表 */
		_sortKeys = {
			"serial": "シリアル",
			"category": "カテゴリ",
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
			positionClass: "toast-bottom-right",
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
		/** @type {@Object} アイテムのシリアル値におけるバイアス */
		_bias = ( function () {
			var category = 10000;

			return {
				CATEGORY: category,
				MAKEUP: 10 * category, // @todo: magic number
				ACCESSORY: 11 * category, // @todo: magic number
				ALT_MAKEUP: 41 * category // @todo: magic number
			};
		}() ),
		/** @type {MethodCollection} 全体的に共通して利用される普遍的な処理 */
		_utils = {
			/** @summary 全角の数字を半角に変換する
			 * @param  {String} number 全角数字の文字列
			 * @returns {String} 半角数字に変換した数字文字列
			 */
			digit2Half: function ( digit ) {
				return digit.replace( /[０-９．]/g, function ( d ) {
					return String.fromCharCode( d.charCodeAt( 0 ) - 0xfee0 );
				} );
			},
			/** @summary 3桁コンマ区切りの数値（文字列）を取得する
			 * @param  {Number} number 桁区切りをする数値
			 * @returns {String} 桁区切りを施した文字列
			 */
			digitGrouping: function ( number ) {
				return number.toString().replace( /(\d)(?=(\d\d\d)+$)/g, "$1," );
			},
			/** @summary 数値が範囲内に収まっているか検査する
			 * @param {Number} value 検査値
			 * @param {Object} bounds 境界オブジェクト
			 * @returns {Boolean} true -> 検査値が境界内に収まっている
			 */
			isCloseTo: function ( value, bounds ) {
				return bounds.floor <= value && value <= bounds.ceil;
			},
			/** @summary （主に入力された）文字列をサニタイズ処理する
			 * @param {String} text サニタイズ対象文字列
			 * @returns {String} サニタイズ処理を施した文字列
			 */
			sanitizeHTML: function ( text ) {
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
			unsanitizeHTML: function ( text ) {
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
			map4IdString: function ( id ) {
				return id.replace( / /g, "-" );
			},
			/** @summary カテゴリー判定 */
			categoryOf: {
				/** @summary アクセサリー判定
				 * @param {Number} シリアル値
				 * @returns {Booelan} true -> アクセサリー
				 */
				accessory: function ( serial ) {
					return _bias.ACCESSORY <= serial;
				},
				/** @summary メイク判定
				 * @param {Number} シリアル値
				 * @returns {Booelan} true -> メイク
				 */
				makeup: function ( serial ) {
					return _bias.MAKEUP <= serial && serial < _bias.ACCESSORY;
				}
			}
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
		/** @summary 不所持アイテムのリストを生成する */
		_getImposes = function () {
			var data = [];

			$.each( LAURUS.WARDROBE, function ( serial ) {
				if ( !this.possession ) {
					data.push( serial );
				}
			} );

			return data;
		},
		/** @summary 不所持アイテムリストから所持情況を登録する
		 * @param {Array} 不所持アイテムリスト
		 */
		_setImposes = function ( imPoses ) {
			var WARDROBE = LAURUS.WARDROBE;

			$.each( LAURUS.WARDROBE, function () {
				this.possession = true;
			} );

			$.each( imPoses, function () {
				WARDROBE[ this ].possession = false;
			} );
		},
		/** @type {MethodCollection} コードから情報を復元するためのメソッド群 */
		_restore = ( function () {
			var /** @summary スタイル属性のコードを復元する
				 * @param {String} attributes コード化されたスタイル属性値
				 * @returns {Array} 復元したスタイル属性値配列
				 */
				_attributes = function ( attributes ) {
					var a = [];

					$.each( attributes.split( "" ), function ( index ) {
						var v = parseInt( this, 16 );
						a[ index ] = ( 0 < ( v & 8 ) ? -1 : 1 ) * ( ( v & 7 ) + 1 );
					} );

					return a;
				},
				_attributes2serial = function ( attributes ) {
					var a = [];

					$.each( _attributes( attributes ), function ( index ) {
						if ( 0 < this ) {
							a[ index * 2 ] = this;
							a[ index * 2 + 1 ] = 0;
						} else {
							a[ index * 2 ] = 0;
							a[ index * 2 + 1 ] = this * -1;
						}
					} );

					return a;
				},
				/** @summary 特殊タグを復元する
				 * @param {Number} complex 複合化された特殊タグコード
				 * @returns {Array} タグの単独コード
				 */
				_tag = function ( complex ) {
					var TAG_BASE = 45;

					return [ complex % TAG_BASE, Math.floor( complex / TAG_BASE ) ];
				},
				/** @summary アイテムのシリアルコードからカテゴリとアイテム ID 特殊タグを復元する
				 * @param {Number} serial アイテムのシリアルコード
				 * @returns {Object} カテゴリと ID のペア
				 */
				_categoryAndId = function ( serial ) {
					var CATEGORY_BASE = 10000;

					return {
						category: _categoryDefs.REVERSE[ Math.floor( serial / CATEGORY_BASE ) ],
						id: serial % CATEGORY_BASE
					};
				};

			return {
				attributes: _attributes,
				attributes2serial: _attributes2serial,
				tag: _tag,
				categoryAndId: _categoryAndId
			};
		}() );

	return {
		// consts
		ALL_RECORDS: _allRecords,

		VALUES: _values,
		ORDERED_LIST: _orderedList,
		BIAS: _bias,
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
		utils: _utils,
		getDatabase: _getDatabase,
		getImposes: _getImposes,
		setImposes: _setImposes,
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

/** @type {ObjectDatabase} ワードロープ */
LAURUS.WARDROBE = ( function () {
	"use strict";

	var _wardrobe = {};

	LAURUS.STATIC_ITEMS.getDatabase(
		"wardrobe",
		function ( data ) {
			$.each( data, function () {
				var serial = this[ 0 ];

				_wardrobe[ serial ] = {
					item: this,
					score: -1,
					possession: true,
					fail: false
				};
			} );

			LAURUS.STATIC_ITEMS.ALL_RECORDS = data.length;
		}
	);

	return _wardrobe;
}() );

/** @type {Object} スコアリングのスロット別集計 */
LAURUS.SCORING_BY_SLOT = {};

/** @summary スコアリングを行い結果を格納する
 * @param {Object} objective スコアリング条件
 */
LAURUS.scoring = function ( objective ) {
	"use strict";

	var COLUMN = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		VALUES = LAURUS.STATIC_ITEMS.VALUES,
		SCALE = LAURUS.STATIC_ITEMS.CATEGORY_DEFS.SCALE,

		categoryOf = LAURUS.STATIC_ITEMS.utils.categoryOf,

		restore = LAURUS.STATIC_ITEMS.restore,
		OBJECTIVE = {
			FORMER: 0,
			LATTER: 1,
			TAG_ID: 0,
			TAG_VALUE: 1,
			TAG_PRODUCT: 2
		};

	$.each( LAURUS.WARDROBE, function ( serial, record ) {
		var item = record.item,
			attributes = restore.attributes2serial( item[ COLUMN.ATTRIBUTES ] ),
			score = 0,
			itemTags = restore.tag( item[ COLUMN.TAGS ] ),
			bonusTags = objective.tags,
			addTagBonus = function ( channel ) {
				return itemTags[ channel ] ?
					( itemTags[ channel ] === bonusTags[ OBJECTIVE.FORMER ][ OBJECTIVE.TAG_ID ] ) ? VALUES.FACTOR[ bonusTags[ OBJECTIVE.FORMER ][ OBJECTIVE.TAG_VALUE ] ] * bonusTags[ OBJECTIVE.FORMER ][ OBJECTIVE.TAG_PRODUCT ] :
						( itemTags[ channel ] === bonusTags[ OBJECTIVE.LATTER ][ OBJECTIVE.TAG_ID ] ) ? VALUES.FACTOR[ bonusTags[ OBJECTIVE.LATTER ][ OBJECTIVE.TAG_VALUE ] ] * bonusTags[ OBJECTIVE.LATTER ][ OBJECTIVE.TAG_PRODUCT ] : 0 :
					0;
			},
			tagBonus = ( addTagBonus( OBJECTIVE.FORMER ) + addTagBonus( OBJECTIVE.LATTER ) );

		$.each( item[ COLUMN.SLOTS ], function () {
			var scale = SCALE[ this ],
				damping = categoryOf.accessory( serial ) ? 0.4 : 1; // @todo: magic number

			$.each( objective.style, function ( index ) {
				score += ( VALUES.FACTOR[ attributes[ index ] ] * damping + tagBonus ) * scale * this;
			} );
		} );

		record.score = Math.round( score / ( record.fail ? 10 : 1 ) );
	} );
};

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
		COLUMN = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		CATEGORY_DEFS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS,
		TAG_CLASS = LAURUS.STATIC_ITEMS.TAG_DEFS.CLASSES,
		VALUES = LAURUS.STATIC_ITEMS.VALUES,

		restore = LAURUS.STATIC_ITEMS.restore,

		digitGrouping = LAURUS.STATIC_ITEMS.utils.digitGrouping,

		// item
		record = LAURUS.WARDROBE[ serial ],
		item = record.item,
		keys = restore.categoryAndId( serial ),
		restoreAttributes = restore.attributes( item[ COLUMN.ATTRIBUTES ] ),
		tag = restore.tag( item[ COLUMN.TAGS ] ),

		// concrete HTML
		category = "<td><span class=\"" + CATEGORY_DEFS.SLOT[ item[ COLUMN.SLOTS ][ 0 ] ] + "\"></span></td>",
		id = "<td>" + ( keys.id < 100 ? ( "000" + keys.id ).slice( -3 ) : keys.id ) + "</td>",
		name = record.fail ? "<td title=\"" + item[ COLUMN.NAME ] + "\" class=\"fails\"><span>" + item[ COLUMN.NAME ] + "</span></td>" : "<td title=\"" + item[ COLUMN.NAME ] + "\">" + item[ COLUMN.NAME ] + "</td>",
		slot = ( function () {
			var
				slots = ( function () {
					var s = [];

					$.each( item[ COLUMN.SLOTS ], function () {
						s.push( CATEGORY_DEFS.REVERSE[ this ] );
					} );

					return s;
				}() ),
				title = "",
				text = "";

			if ( 1 < item[ COLUMN.SLOTS ].length ) {
				title = slots.join( ", " );
				text = "複合スロット";
			} else {
				title = "";
				text = slots[ 0 ];
			}

			return "<td title=\"" + title + "\">" + text + "</td>";
		}() ),
		rarity = "<td><span class=\"" + ( item[ COLUMN.RARITY ] < 0 ? "with-animate" : "" ) + "\"><span class=\"laurus-icon\">&#x2606;</span>" + Math.abs( item[ COLUMN.RARITY ] ) + "</span></td>",
		attributes = ( function () {
			var a = "";

			$.each( restore.attributes( item[ COLUMN.ATTRIBUTES ] ), function () {
				var v = VALUES.INDEX[ Math.abs( this ) ];

				if ( 0 < this ) {
					a += "<td class=\"attributes-" + v + "\">" + v + "</td><td class=\"insparkly\">-</td>";
				} else {
					a += "<td class=\"insparkly\">-</td><td class=\"attributes-" + v + "\">" + v + "</td>";
				}
			} );

			return a;
		}() ),
		sparkline = "<td><span class=\"sparkline\">" + restoreAttributes.join( "," ) + "</span></td>",
		tags = "<td><span class=\"tag-" + TAG_CLASS[ tag[ 0 ] ] + "\"></span></td><td><span class=\"tag-" + TAG_CLASS[ tag[ 1 ] ] + "\"></span></td>",
		score = "<td>" + ( 0 < record.score ? digitGrouping( record.score ) : "-" ) + "</td>";

	return "<tr " + ( record.possession ? "" : "class=\"impos\" " ) + "data-serial=\"" + serial + "\">" + category + id + name + slot + rarity + attributes + sparkline + tags + score + "</tr>";
};

/** @summary アイテムカードの生成
 * @param {Number} serial アイテムのシリアルコード
 * @returns {HTML} アイテムカードの HTML コード
 */
LAURUS.itemCard = function ( serial ) {
	"use strict";

	var // dependence
		COLUMN = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		CATEGORY_DEFS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS,
		TAG_CLASS = LAURUS.STATIC_ITEMS.TAG_DEFS.CLASSES,
		VALUES = LAURUS.STATIC_ITEMS.VALUES,

		digitGrouping = LAURUS.STATIC_ITEMS.utils.digitGrouping,

		restore = LAURUS.STATIC_ITEMS.restore,

		// item
		record = LAURUS.WARDROBE[ serial ],
		item = record.item,
		keys = restore.categoryAndId( serial ),
		attributes = restore.attributes( item[ COLUMN.ATTRIBUTES ] ),
		tag = restore.tag( item[ COLUMN.TAGS ] ),

		// concrete HTML
		icon = ( function () {
			return "<span class=\"item-icon " + CATEGORY_DEFS.SLOT[ item[ COLUMN.SLOTS ][ 0 ] ] + "\"></span>";
		}() ),
		tags = "<span class=\"item-tags-box\"><span class=\"item-tags item-tags-" + TAG_CLASS[ tag[ 0 ] ] + "\"></span><span class=\"item-tags item-tags-" + TAG_CLASS[ tag[ 1 ] ] + "\"></span></span>",
		name = "<span class=\"item-name\" title=\"" + item[ COLUMN.NAME ] + "\"><span class=\"item-id\">" + ( keys.id < 100 ? ( "000" + keys.id ).slice( -3 ) : keys.id ) + "</span>" + ( record.fail ? "<span class=\"fails\"><span>" + item[ COLUMN.NAME ] + "</span></span>" : item[ COLUMN.NAME ] ) + "</span>",
		rarity = "<span class=\"item-rarity " + ( item[ COLUMN.RARITY ] < 0 ? " with-animate" : "" ) + "\"><span class=\"laurus-icon\">&#x2606;</span>" + Math.abs( item[ COLUMN.RARITY ] ) + "</span>",
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
				var v = VALUES.INDEX[ Math.abs( this ) ];

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
		score = "<span class=\"item-score\">" + ( 0 < record.score ? digitGrouping( record.score ) : "-" ) + "</span>";

	return "<div class=\"item-card" + ( record.possession ? "" : " impos" ) + "\" data-serial=\"" + serial + "\">" +
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
		dispose: _dispose,
		invoke: _invoke
	};
}() );

/** @type {MethodCollection} Advisor 用メソッドコレクション */
LAURUS.advisor = ( function () {
	"use strict";

	var // dependence
		WARDROBE = LAURUS.WARDROBE,
		STAGES = LAURUS.STAGES,
		SCORING_BY_SLOT = LAURUS.SCORING_BY_SLOT,

		COLUMN = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		STYLE = LAURUS.STATIC_ITEMS.COLUMN.STYLE,
		STAGE = LAURUS.STATIC_ITEMS.COLUMN.STAGE,

		BOUNDS = LAURUS.STATIC_ITEMS.BOUNDS,
		FADE_DURATION = LAURUS.STATIC_ITEMS.FADE_DURATION,
		CATEGORY_DEFS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS,
		SKILL_DEFS = LAURUS.STATIC_ITEMS.SKILL_DEFS,
		STYLE_DEFS = LAURUS.STATIC_ITEMS.STYLE_DEFS,
		STRUCTURE = LAURUS.STATIC_ITEMS.STAGE_STRUCTURE,
		TAG_DEFS = LAURUS.STATIC_ITEMS.TAG_DEFS,
		VALUES = LAURUS.STATIC_ITEMS.VALUES,
		PIETY_LAURUS_OPTIONS = LAURUS.STATIC_ITEMS.PIETY_LAURUS_OPTIONS,

		digit2Half = LAURUS.STATIC_ITEMS.utils.digit2Half,
		isCloseTo = LAURUS.STATIC_ITEMS.utils.isCloseTo,
		sanitizeHTML = LAURUS.STATIC_ITEMS.utils.sanitizeHTML,
		unsanitizeHTML = LAURUS.STATIC_ITEMS.utils.unsanitizeHTML,
		map4IdString = LAURUS.STATIC_ITEMS.utils.map4IdString,
		digitGrouping = LAURUS.STATIC_ITEMS.utils.digitGrouping,
		restore = LAURUS.STATIC_ITEMS.restore,

		scoring = LAURUS.scoring,
		dialogue = LAURUS.dialogue,

		/** @type {Array} 現在 UI に表示しているステージ情報 */
		_stage = [],
		/** @type {Array} スコアによるソート済みワードロープ */
		_sortedWardrobe = [],

		/** @summary 章ラベルの生成
		 * @param {String} 章生ラベル
		 * @returns {String} 章ラベル
		 */
		_makeChapterLabel = function ( chapter ) {
			var
				getTerm = function ( term ) {
					return term.replace( /(\d\d\d\d)(\d\d)(\d\d)(\d\d\d\d)(\d\d)(\d\d)/, "<span class=\"term\">$1.$2.$3 - $4.$5.$6</span>" );
				},
				title = chapter.split( "｜" );

			switch ( title.length ) {
				case 1:
					return title[ 0 ];
				case 2:
					return title[ 0 ] + " " + getTerm( title[ 1 ] );
				case 3: // 未利用
					return title[ 0 ];
				case 4:
					return title[ 0 ] + "<sup>" + title[ 1 ] + "</sup>" + "&lt;" + title[ 2 ] + "&gt;" + getTerm( title[ 3 ] );
			}
		},
		/** @type {Class} 編集中のオブジェクト保持及び操作に関するクラス */
		Medium = ( function () {
			var /** @type {?String} 現在編集中の項目 (ID) */
				_currentEdit = null,
				/** @type {?jQuery} 現在編集中の jQuery オブジェクト */
				_$currentEditElement = null,
				/** @type {*} 編集前の値 */
				_preventValue = null,

				/** @type {MethodCollection} 基礎データに関する操作 */
				_fundamentals = ( function () {
					var　/** @summary ステージの基本情報を更新する
						 * @param {String} stage ミッションタイトル
						 * @param {String} chapter キャプター
						 */
						_set = function ( stage, chapter ) {
							$( "#request-stage-title" )
								.text( stage );
							$( "#request-chapter" )
								.html( _makeChapterLabel( chapter ) );
							$( "#current-stage" )
								.text( stage );
						},
						/** @summary 空関数 */
						_empty = function () { };

					return {
						set: _set,
						clear: _empty,
						reset: _empty
					};
				}() ),
				/** @type {MethodCollection} ステージ課題に関する操作 */
				_subject = ( function () {
					var　/** @summary ミッションの説明を更新する
						 * @param {String} subject ミッションの説明
						 */
						_set = function ( subject ) {
							var sanitizedSubject = sanitizeHTML( subject ).replace( /[\/]/g, "<br>" );

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
						_clear = function () {
							_set( "" );
						};

					return {
						set: _set,
						clear: _clear,
						reset: _clear
					};
				}() ),
				/** @type {MethodCollection} スタイルの重みに関する操作 */
				_weight = ( function () {
					var　/** @summary スタイルの評価ウェイトを更新する
						 * @param {String} style スタイル
						 * @param {Number} weight スタイルの評価ウェイト
						 */
						_set = function ( style, weight ) {
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
						_clear = function ( index, style ) {
							_set( style, 0 );
						},
						/** @summary すべてのスタイルの評価ウェイトを消去する */
						_reset = function () {
							$.each( STYLE_DEFS.LIST, _clear );
						};

					return {
						set: _set,
						clear: _clear,
						reset: _reset
					};
				}() ),
				/** @type {MethodCollection} タグボーナスに関する操作 */
				_tag = ( function () {
					var　/** @summary タグボーナスの加算評価値を更新する
						 * @param {Number} channel タグチャネル
						 * @param {String} value タグの加算評価値
						 */
						_setValue = function ( channel, value ) {
							$( "#criteria-tag-box-" + channel + " .value" )
								.text( value )
								.attr( "class", "value " + value.toLowerCase() );
						},
						/** @summary タグボーナスの加算係数を更新する
						 * @param {Number} channel タグチャネル
						 * @param {Number} product 加算係数
						 */
						_setProduct = function ( channel, product ) {
							$( "#criteria-tag-box-" + channel + " .product" )
								.text( product );
						},
						/** @summary ダイアログから選んだタグをセットする
						 * @param {String} channel タグのチャネル
						 * @param {Number} tagId タグ ID
						 */
						_set = function ( channel, tagId ) {
							var $target = $( "#criteria-tag-box-" + channel + " .tag" ),
								$tag = $target.children();

							$target
								.removeClass()
								.addClass( "tag " + TAG_DEFS.CLASSES[ tagId ] );
							$tag
								.data( "id", tagId )
								.text( tagId === 0 ? "タグ選択" : TAG_DEFS.MAP[ tagId ] );

							if ( tagId === 0 ) {
								_setValue( channel, "S" );
								_setProduct( channel, 1 );
							}
						},
						/** @summary タグボーナスの設定を消去する
						 * @param {Number} channel 消去するチャネル
						 */
						_clear = function ( channel ) {
							_set( channel, 0 );
							_setValue( channel, "S" );
							_setProduct( channel, 1 );
						},
						/** @summary すべてのタグボーナスの設定を消去する */
						_reset = function () {
							_clear( 2 );
							_clear( 1 );
						};

					return {
						set: _set,
						setValue: _setValue,
						setProduct: _setProduct,
						clear: _clear,
						reset: _reset
					};
				}() ),
				/** @type {MethodCollection} スキル情報に関する操作 */
				_skill = ( function () {
					var　/** @summary スキルアイコンの活性化させる
						 * @param {Number} index 不使用（jQuery.each の引数用）
						 * @param {String} skill スキル名
						 */
						_on = function ( index, skill ) {
							$( "#receive-skill-icons [data-skill=\"" + skill + "\"]" )
								.addClass( "sparkly" );
							$( "#receive-skill-names [data-skill=\"" + skill + "\"]" )
								.show();
						},
						/** @summary スキルアイコンの不活性化にする
						 * @param {Number} index 不使用（jQuery.each の引数用）
						 * @param {String} skill スキル名
						 */
						_off = function ( index, skill ) {
							$( "#receive-skill-icons [data-skill=\"" + skill + "\"]" )
								.removeClass( "sparkly" );
							$( "#receive-skill-names [data-skill=\"" + skill + "\"]" )
								.hide();
						},
						/** @summary スキルアイコンの活性/不活性状態を切り替える
						 * @param {Number} index 不使用（jQuery.each の引数用）
						 * @param {String} skill スキル名
						 */
						_change = function ( index, skill ) {
							if ( $( "#receive-skill-icons [data-skill=\"" + skill + "\"]" ).hasClass( "sparkly" ) ) {
								_off( null, skill );
							} else {
								_on( null, skill );
							}
						},
						/** @summary すべてのスキルアイコンを不活性化させる */
						_clear = function () {
							$.each( SKILL_DEFS.LIST, _off );
						},
						/** @summary スキルアイコンをステージ情報に従って設定する
						 * @param {Number} scenarioClass ステージ識別 ID
						 */
						_set = function ( scenarioClass ) {
							var skill = _stage[ STAGE.SKILL ][ scenarioClass ];

							_clear();
							$.each( SKILL_DEFS.LIST, function () {
								if ( SKILL_DEFS.MASK[ this ] & skill ) {
									_on( null, this );
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
						};

					return {
						set: _set,
						change: _change,
						clear: _clear,
						reset: _clear
					};
				}() ),
				/** @type {MethodCollection} シナリオクラス選択ボタンに関する操作 */
				_senarioClasses = {
					/** @summary シナリオ難易度選択ボタンを表示する */
					on: function () {
						$( "#scenario-classes" )
							.show()
							.data( "scenario", "on" );
					},
					/** @summary シナリオ難易度選択ボタンを隠す */
					off: function () {
						$( "#scenario-classes" )
							.hide()
							.data( "scenario", "off" );
					}
				},
				/** @type {Function} ステージデータをリセットする */
				_resetUI = function () {
					$.each( [ _subject, _weight, _tag, _skill ], function () {
						this.reset();
					} );
					_senarioClasses.off();

					$.each( WARDROBE, function ( serial ) {
						WARDROBE[ serial ].fail = false;
					} );

					$( "#blacklist-heading, #whitelist-heading" )
						.hide();
					$( "#blacklist-items, #whitelist-items" )
						.empty();
				},
				/** @type {MethodCollection} 推奨コーディネートに関する操作 */
				_recommend = ( function () {
					var /** @summary {Object} 現在表示中のアイテム */
						_pos = {},
						/** @summary {Array} タグボーナスを保持 */
						_criteriaTags = [],
						/** @summary スロットから現在表示中候補のスコアを得る
						 * @param {String} スロット
						 * @returns {Number} 現在表示中候補のスコア
						 */
						getScoreBySlot = function ( slot ) {
							var serial = SCORING_BY_SLOT[ slot ][ _pos[ slot ] ];
							return serial === -1 ? 0 : WARDROBE[ serial ].score;
						},
						/** @summary 排他的スロットの推奨判断を行う */
						_isnpection4ExclusiveSlot = function () {
							var /** @summary 排他的スロット同士のスコア合計を求め比較する
								 * @param {Array} a 排他的スロット集合 A
								 * @param {Array} b 排他的スロット集合 B
								 * @returns {Array} 比較結果
								 */
								compareExclusive = function ( a, b ) {
									var /** @summary スロットを総合してスコアの合計を求める
										 * @param {Array} スロット
										 * @returns {Number} 総合スコア
										 */
										scoreTotal = function ( slots ) {
											var total = 0;

											$.each( slots, function () {
												total += getScoreBySlot( this );
											} );

											return total;
										},
										compareResult = [],
										recommend = scoreTotal( b ) <= scoreTotal( a );

									$.each( a, function () {
										compareResult.push( {
											slot: this,
											recommend: recommend
										} );
									} );

									recommend = !recommend;

									$.each( b, function () {
										compareResult.push( {
											slot: this,
											recommend: recommend
										} );
									} );

									return compareResult;
								},
								/** @summary 排他的スロット同士の比較結果からページに情報を書き込む
								 * @param {Array} 排他的スロット同士の比較結果
								 */
								setRecommendSlot = function ( compareResult ) {
									$.each( compareResult, function () {
										$( "#slot-" + this.slot )
											.removeClass( "recommend deprecated" )
											.addClass( this.recommend ? "recommend" : "deprecated" );
									} );
								};

							setRecommendSlot( compareExclusive( [ "dress" ], [ "tops", "bottoms" ] ) );
							setRecommendSlot( compareExclusive( [ "right-hand-holding", "left-hand-holding" ], [ "both-hand-holding" ] ) );
						},
						/** @summary 複合スロットの推奨判断（未実装） */
						_inspection4ComplexSlot = function () {
							// みじっそー
							// 複合スロットの検査
						},
						/** @summary アクセサリのスコアランクの計算 */
						_accessoryRank = function () {
							var accessories = [],
								rank = 1;

							$.each( CATEGORY_DEFS.ACCESSORY_LIST, function () {
								accessories.push( {
									slot: this,
									score: getScoreBySlot( this )
								} );
							} );
							accessories.sort( function ( a, b ) {
								return b.score - a.score;
							} );

							$.each( accessories, function () {
								$( "#slot-" + this.slot + " .rcm-acs-rank" )
									.text( rank )
									.attr( "data-rcm-rank", rank );
								rank += 1;
							} );
						},
						/** @summary 内容変更時のオブザーバ */
						_observe = function () {
							_isnpection4ExclusiveSlot();
							_inspection4ComplexSlot();
							_accessoryRank();
						},
						/** @summary 推奨アイテムを書き込む
						 * @param {String} slot スロットキー
						 */
						_write = function ( slot, initFlag ) {
							var orderedItems = SCORING_BY_SLOT[ slot ],
								initPos = function () {
									var length = 0;

									if ( !initFlag ) {
										return _pos[ slot ];
									}

									length = orderedItems.length;
									for ( var i = _pos[ slot ]; i <= length; i += 1 ) {
										if ( WARDROBE[ orderedItems[ i ] ] && WARDROBE[ orderedItems[ i ] ].possession ) {
											_pos[ slot ] = i;
											return i;
										}
									}

									_pos[ slot ] = orderedItems.length - 1;

									return _pos[ slot ];
								},
								pos = initPos(),
								prevCard = function () {
									var PREV_ITEM_MAX = 2,
										itemCards = "";

									for ( var i = pos - PREV_ITEM_MAX; i < pos; i += 1 ) {
										if ( i < 0 ) {
											continue;
										}
										itemCards += LAURUS.itemCard( orderedItems[ i ] );
									}
									return itemCards;
								},
								serial = orderedItems[ pos ],
								$slot = $( "#slot-" + slot ),
								terminusBranch = ( serial === -1 ) ?
									{
										prevCard: prevCard(),
										card: "<div class=\"terminus-item\"><span>推奨アイテムなし...</span> <span>( &gt;﹏&lt;。)</span></div>",
										next: "addClass",
										page: "terminus!"
									} : {
										prevCard: prevCard(),
										card: LAURUS.itemCard( orderedItems[ pos ] ),
										next: "removeClass",
										page: ( pos + 1 ) + " of " + ( orderedItems.length - 1 )
									},
								score = {
									current: 0 <= serial ? WARDROBE[ serial ].score : 0,                                // serial === -1 is terminus.
									prev: 0 <= pos - 1 ? WARDROBE[ orderedItems[ pos - 1 ] ].score : 0,                 // pos === -1 is before first.
									next: 0 <= orderedItems[ pos + 1 ] ? WARDROBE[ orderedItems[ pos + 1 ] ].score : 0  // orderedItems[ pos + 1 ] === -1 is terminus.
								},
								isTagsMatch = ( function () {
									var tags = [],
										matcher = function ( tag ) {
											if ( tag ) {
												return ( tag === _criteriaTags[ 0 ] || tag === _criteriaTags[ 1 ] );
											} else {
												return false;
											}
										};

									if ( serial === -1 ) {
										return false;
									}

									tags = restore.tag( WARDROBE[ serial ].item[ COLUMN.TAGS ] );

									return matcher( tags[ 0 ] ) || matcher( tags[ 1 ] );
								}() );

							$.each( [ "prev", "next" ], function () {
								var dif = score[ this ] - score.current,
									$dif = $slot.find( "." + this + " .dif" ),
									cls = dif === 0 ? "same" : dif < 0 ? "minus" : "plus";

								$dif
									.removeClass( "same minus plus" )
									.text( {
										same: "same!",
										plus: "+" + digitGrouping( dif ),
										minus: digitGrouping( dif )
									}[ cls ] )
									.addClass( cls );
							} );

							$slot
								.find( ".prev-item-card-area" )
								.html( terminusBranch.prevCard );
							if ( $( "#advisor" ).hasClass( "multiRecommendMode" ) ) {
								$slot.find( ".prev-item-card-area" ).show();
							} else {
								$slot.find( ".prev-item-card-area" ).hide();
							}
							$slot
								.find( ".item-card-area" )
								.html( terminusBranch.card );
							$slot
								.find( ".rcm-page" )
								.text( terminusBranch.page );
							$slot
								.find( ".next" )[ terminusBranch.next ]( "disabled" );
							$slot
								.find( ".prev" )[ pos === 0 ? "addClass" : "removeClass" ]( "disabled" );
							$slot
								.find( ".sparkline" )
								.peity( "line", PIETY_LAURUS_OPTIONS.card );

							$slot[ isTagsMatch ? "addClass" : "removeClass" ]( "tags-match" );
						},
						/** @summary アイテム名プレビュー */
						_preview = function () {
							var TOP_BIAS = 63,
								LEFT_BIAS = 11,
								$this = $( this ),
								$preview = $( "#rcm-preview" ),
								offset = $this.offset(),
								slot = $this.parents( ".rcm-item" ).data( "rcm-slot" ),
								orderedItems = SCORING_BY_SLOT[ slot ],
								serial = orderedItems[ _pos[ slot ] + ( $this.hasClass( "next" ) ? 1 : -1 ) ];

							$preview
								.text( 0 <= serial ? WARDROBE[ serial ].item[ COLUMN.NAME ] : "terminus!" )
								.addClass( "sparkly" )
								.offset( {
									top: offset.top + TOP_BIAS,
									left: offset.left - $preview.width() / 2 + LEFT_BIAS
								} );
						},
						/** @summary アイテム名プレビュー（終了） */
						_previewFinish = function () {
							$( "#rcm-preview" )
								.removeClass( "sparkly" );
						},
						/** @summary 推奨アイテムを移動する */
						_traversal = function () {
							var $this = $( this ),
								slot = $this.parents( ".rcm-item" ).data( "rcm-slot" );

							_pos[ slot ] += ( $this.hasClass( "next" ) ? 1 : -1 );
							_write( slot, false );
							_observe();

							$this.mouseenter();
							if ( $this.hasClass( "disabled" ) ) {
								_previewFinish();
							}
						},
						/** @summary 推奨アイテムの UI を初期化する */
						_init = function () {
							_sortedWardrobe = [];

							$.each( WARDROBE, function ( serial ) {
								_sortedWardrobe.push( serial );
							} );

							_sortedWardrobe.sort( function ( a, b ) {
								return WARDROBE[ b ].score - WARDROBE[ a ].score;
							} );

							SCORING_BY_SLOT = {};
							$.each( CATEGORY_DEFS.SLOT_LIST, function () {
								SCORING_BY_SLOT[ this ] = [];
								_pos[ this ] = 0;
							} );

							var isMultiRecommendMode = $( "#advisor" ).hasClass( "multiRecommendMode" );
							$.each( _sortedWardrobe, function () {
								var record = WARDROBE[ this ],
									slots = record.item[ COLUMN.SLOTS ],
									slot = slots.length === 1 ? CATEGORY_DEFS.SLOT[ slots[ 0 ] ] : "complex";

								if ( isMultiRecommendMode || record.possession ) {
									if ( !record.fail && record.score ) {
										SCORING_BY_SLOT[ slot ].push( this );
									}
								}
							} );

							_criteriaTags = [
								$( "#criteria-tag-1" ).data( "id" ),
								$( "#criteria-tag-2" ).data( "id" )
							];

							$.each( SCORING_BY_SLOT, function ( slot ) {
								this.push( -1 );
								_write( slot, true );
							} );

							_observe();
						},
						/** @summary 推奨アイテムの操作をリセットする */
						_reset = function () {
							$.each( SCORING_BY_SLOT, function ( slot ) {
								_pos[ slot ] = 0;
								_write( slot, true );
							} );

							_observe();
						};

					return {
						init: _init,
						reset: _reset,
						preview: _preview,
						previewFinish: _previewFinish,
						traversal: _traversal
					};
				}() ),
				/** @type {Function} UI からスコアリングを行う上で利用する目的オブジェクトを生成する */
				_makeScoringObjective = function () {
					return {
						style: ( function () {
							var a = [];

							$.each( STYLE_DEFS.LIST, function () {
								var val = $( "#criteria-" + this ).text();

								a[ STYLE[ this.toUpperCase() ] ] = val === "-" ? 0 : parseFloat( val );
							} );

							return a;
						}() ),
						tags: [
							[
								$( "#criteria-tag-1" ).data( "id" ),
								VALUES.CODE[ $( "#criteria-tag-box-1 .value" ).text() ],
								parseFloat( $( "#criteria-tag-box-1 .product" ).text() )
							],
							[
								$( "#criteria-tag-2" ).data( "id" ),
								VALUES.CODE[ $( "#criteria-tag-box-2 .value" ).text() ],
								parseFloat( $( "#criteria-tag-box-2 .product" ).text() )
							]
						],
						blacklist: _stage[ STAGE.BLACKLIST ],
						whitelist: _stage[ STAGE.WHITELIST ]
					};
				},
				/** @summary UIに設定された目的条件からスコアリングして結果を描写する */
				_execScoring = function () {
					scoring( _makeScoringObjective() );
					_recommend.init();
				},
				/** @summary ステージデータを UI に書き込む
				 * @param {String} stage ステージキー
				 */
				_writeStage = function ( stage ) {
					_stage = STAGES[ stage ];

					_resetUI();
					_fundamentals.set(
						_stage[ STAGE.STAGE ] + " " + _stage[ STAGE.TITLE ],
						_stage[ STAGE.CHAPTER ]
					);

					_subject.set( _stage[ STAGE.CRITERIA_SUBJECT ] );

					$.each( _stage[ STAGE.CRITERIA_STYLE ], function ( index, weight ) {
						_weight.set( STYLE_DEFS.LIST[ index * 2 + ( weight < 0 ? 1 : 0 ) ], Math.abs( weight ) );
					} );

					$.each( _stage[ STAGE.CRITERIA_TAGS ], function ( channel ) {
						_tag.set( channel + 1, this[ 0 ] );
						_tag.setValue( channel + 1, VALUES.INDEX[ this[ 1 ] ] );
						_tag.setProduct( channel + 1, this[ 2 ] );
					} );

					if ( _stage[ STAGE.SECTION ] === "scenario" ) {
						_senarioClasses.on();
					}
					_skill.set( SKILL_DEFS.SCENARIO_CLASS.GIRL );

					$( "#blacklist-heading, #whitelist-heading" )
						.show();
					$.each( [ "blacklist", "whitelist" ], function () {
						var $list = $( "#" + this + "-items" ),
							list = _stage[ STAGE[ this.toUpperCase() ] ],
							size = list.length,
							item = function ( serial ) {
								var item = WARDROBE[ serial ].item,
									name = item[ COLUMN.NAME ];

								$list
									.append( "<span class=\"bw-item\"><span class=\"slot-icon " + CATEGORY_DEFS.SLOT[ item[ COLUMN.SLOTS ][ 0 ] ] + "\"></span><span class=\"bw-item-name\" title=\"" + name + "\">" + name + "</span></span>" );
							},
							branch = {
								blacklist: {
									nan: function ( bundle ) {
										$.each( bundle.type, function () {
											var code = CATEGORY_DEFS.CODE.CATEGORY[ this ];

											$list
												.append( "<span class=\"bw-category\"><span class=\"slot-icon " + this + "\"></span><span class=\"bw-item-category\">" + CATEGORY_DEFS.REVERSE[ code ] + "</span></span>" );

											$.each( WARDROBE, function ( serial ) {
												if ( Math.round( serial / 10000 ) === code ) {
													this.fail = true;
												}
											} );
										} );
									},
									serial: function ( serial ) {
										item( serial );
										WARDROBE[ serial ].fail = true;
									}
								},
								whitelist: {
									nan: function ( bundle ) {
										$.each( bundle.tag, function () {
											var tag = TAG_DEFS.REVERSE[ this ];

											$list
												.append( "<span class=\"bw-tag " + this + "\"><span>" + TAG_DEFS.MAP[ tag ] + "</span></span>" );

											$.each( WARDROBE, function () {
												if ( 0 <= $.inArray( tag, restore.tag( this.item[ COLUMN.TAGS ] ) ) ) {
													this.fail = false;
												}
											} );
										} );
									},
									serial: function ( serial ) {
										item( serial );
										WARDROBE[ serial ].fail = false;
									}
								}
							};

						if ( size === 0 ) {
							$list
								.html( "<span class=\"unseen\"><span>未発見</span></span>" );
						} else {
							branch[ this ][ isNaN( list[ 0 ] ) ? "nan" : "serial" ]( list[ 0 ] );

							for ( var i = 1; i < size; i += 1 ) {
								branch[ this ].serial( list[ i ] );
							}
						}
					} );
				},
				/** @summary ダイアログから選んだステージをセットする
				 * @param {String} stage ステージキー
				 */
				_setStage = function ( stage ) {
					_writeStage( stage );

					localStorage.setItem( "stage", stage );
					_execScoring();
				},
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
				fundamentals: _fundamentals,
				subject: _subject,
				weight: _weight,
				tag: _tag,
				skill: _skill,
				senarioClasses: _senarioClasses,
				recommend: _recommend,

				resetUI: _resetUI,
				execScoring: _execScoring,
				writeStage: _writeStage,
				setStage: _setStage,

				clearMedium: _clearMedium,
				getCurrentEdit: _getCurrentEdit,
				get$currentEditElement: _get$CurrentEditElement,
				getPreventValue: _getPreventValue,
				isEditing: _isEditing,
				setMedium: _setMedium,
				rollbackEdit: _rollbackEdit
			};
		}() ),
		/** @summary Wardrobe の初期化処理 */
		_wakeup = function () {
			var loadStage = localStorage.getItem( "stage" ),
				/** @summary ステージ選択用ボタンの生成 */
				writeStages = function () {
					var buildStageButton = function ( key, stage ) {
						return "<span class=\"select-stage\" data-stage=\"" + key + "\"><span>" + stage + "</span></span>";
					};

					$.each( STRUCTURE, function ( section ) {
						$.each( this, function ( index, chapter ) {
							var $chapter = $( "<div class=\"chapter\"></div>" ),
								$stageArea = $( "<div class=\"chapter\"></div>" );

							$( "#stage-" + section )
								.append( $chapter );
							$( $chapter )
								.append( section === "colosseum" ? "" : "<span class=\"chapter-label\">" + _makeChapterLabel( chapter ) + "</span>" )
								.append( $stageArea );
							$stageArea
								.data( "section", section )
								.attr( "id", map4IdString( chapter ) )
								.addClass( section );
						} );
					} );

					$.each( STAGES, function () {
						$( "#" + map4IdString( this[ STAGE.CHAPTER ] ) )
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
									subject = unsanitizeHTML( $subject.html().replace( /<br>/g, "/" ) );
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

							Medium.subject.set( $inputField.val() );
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

									Medium.weight.set( style, weight );
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

									Medium.tag.setProduct( channel, product );
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
							Medium.tag.setValue( _channel, $( this ).text() );

							$( "#value-list" ).fadeOut( FADE_DURATION );
						} );
				},
				/** @summary ダイアログの呼び出し
				 * @param {String} item 呼び出すダイアログの ID
				 * @param {Function} callback コールバック関数（省略可））
				 */
				invokeDialogue = function ( item, callback ) {
					return function () {
						if ( Medium.isEditing() ) {
							Medium.rollbackEdit();
						}
						toastr.remove();

						dialogue.invoke( item, this );

						if ( callback ) {
							callback();
						}
					};
				},
				/** @summary スキルアイコン一括設定のステージボタンイベント用包括関数
				 * @param {Number} scenarioClass ステージ識別 ID
				 */
				setSkillForScenarioFactory = function ( scenarioClass ) {
					return function () {
						Medium.skill.set( scenarioClass );
					};
				},
				/** @type {MethodCollection} イベントハンドラ用イベントのコレクション */
				event = {
					/** @summary 現在のステージタイトルをダイアログ側のカスタムステージ入力用のフィールドへ入力する */
					setStageText: function () {
						$( "#custom-stage-title" ).val( $( "#request-stage-title" ).text() );
						$( "#custom-request-chapter" ).val( $( "#request-chapter" ).text() );
					},
					/** @summary ステージプレビュー */
					stagePreview: function () {
						var TOP_BIAS = 25,
							LEFT_BIAS = 20,
							$this = $( this ),
							offset = $this.offset(),
							stage = STAGES[ $this.parent().data( "stage" ) ];

						if ( stage[ STAGE.SECTION ] !== "colosseum" ) {
							$( "#stage-preview" )
								.text( stage[ STAGE.TITLE ] )
								.addClass( "sparkly" )
								.offset( {
									top: offset.top + TOP_BIAS,
									left: offset.left + $this.width() / 2 + LEFT_BIAS
								} );
						}
					},
					/** @summary ステージプレビュー（終了） */
					stagePreviewFinish: function () {
						$( "#stage-preview" )
							.removeClass( "sparkly" );
					},
					/** 選択したステージをセットする */
					stageSelect: function () {
						Medium.setStage( $( this ).parent().data( "stage" ) );
						dialogue.dispose();
						toastr.info( "推奨コーディネートを更新しました" );
					},
					/** カスタム入力したステージをセットする */
					customStageInput: function () {
						_stage = [ "", "", "", [ 0, 0, 0, 0, 0 ], [], [ 0 ], [], [] ];
						Medium.resetUI();

						Medium.fundamentals.set(
							$( "#custom-stage-title" ).val(),
							$( "#custom-request-chapter" ).val()
						);

						dialogue.dispose();
					},
					/** 選択したタグをセットする */
					tagSelect: function () {
						Medium.tag.set(( $( dialogue.getInvoker() ).attr( "id" ) === "criteria-tag-1" ? 1 : 2 ), $( this ).data( "criteria-tag" ) );
						dialogue.dispose();
					},
					/** @summary スキルの活性 / 不活性化状態を入れ替える */
					changeSkill: function () {
						Medium.skill.change( null, $( this ).data( "skill" ) );
					},
					/** @summary 目的条件を確定する */
					conditionDetermination: function () {
						Medium.execScoring();
						toastr.info( "推奨コーディネートを更新しました" );
					},
					/** @summary 内容を選択する（focus イベント用） */
					thisSelect: function () {
						$( this ).select();
					},
					/** @summary 所持情況編集のロック・解除 */
					changeEditable: function () {
						var $advisor = $( "#advisor" ),
							proc = $advisor.hasClass( "editable" ) ?
								{
									cls: "removeClass",
									html: "<span class=\"laurus-icon\">&#x2613;</span> 編集ロック"
								} :
								{
									cls: "addClass",
									html: "<span class=\"laurus-icon\">&#x2612;</span> 編集可能"
								};

						$advisor[ proc.cls ]( "editable" );
						$( this ).html( proc.html );
					},
					/** @summary 推奨コーデの表示を単一/複数で切り替える */
					changeMultiRecommendMode: function () {
						var $advisor = $( "#advisor" ),
							html = "";
						if ( $advisor.hasClass( "multiRecommendMode" ) ) {
							$advisor.removeClass( "multiRecommendMode" );
							html = "<span class=\"laurus-icon\">&#x2634;</span> 単一表示";
							$( ".prev-item-card-area" ).hide();
							localStorage.removeItem( "multiRecommendMode" );
						} else {
							$advisor.addClass( "multiRecommendMode" );
							html = "<span class=\"laurus-icon\">&#x2635;</span> 複数表示";
							$( ".prev-item-card-area" ).show();
							localStorage.setItem( "multiRecommendMode", true );
						}
						Medium.recommend.init();
						$( this ).html( html );
					}
				};

			// constructor
			writeStages();

			editCriteriaSubject();
			$.each( LAURUS.STATIC_ITEMS.STYLE_DEFS.LIST, editCriteriaStyle );
			$.each( [ 1, 2 ], editTagProduct );
			tagAddValueSelect();

			$( "#advisor" )
				// ダイアログの呼び出し
				.on( "click", "#request-stage", invokeDialogue( "stage-select", event.setStageText ) )
				.on( "click", "#criteria-tags .tag span", invokeDialogue( "tag-select" ) )
				// スキルセット
				.on( "click", "#girl-class", setSkillForScenarioFactory( SKILL_DEFS.SCENARIO_CLASS.GIRL ) )
				.on( "click", "#princess-class", setSkillForScenarioFactory( SKILL_DEFS.SCENARIO_CLASS.PRINCESS ) )
				.on( "click", "#receive-skill-icons span", event.changeSkill )
				.on( "click", "#condition-determination", event.conditionDetermination )
				// コントロール
				.on( "click", "#rcm-reset", Medium.recommend.reset )
				.on( "click", "#rcm-edit-lock", event.changeEditable )
				.on( "click", "#rcm-recommend-mode", event.changeMultiRecommendMode )
				// 推奨コーディネート
				.on( {
					"mouseenter": Medium.recommend.preview,
					"mouseleave": Medium.recommend.previewFinish,
					"click": Medium.recommend.traversal
				}, "#recommends .rcm-controle-wrapper:not( .disabled )" );

			$( "#dialogue" )
				// ステージ選択
				.on( {
					"mouseenter": event.stagePreview,
					"mouseleave": event.stagePreviewFinish,
					"click": event.stageSelect
				}, ".select-stage span" )
				.on( "click", "#custom-input-determination", event.customStageInput )
				.on( "focus", "#custom-stage-title", event.thisSelect )
				.on( "focus", "#custom-request-chapter", event.thisSelect )
				// タグ選択
				.on( "click", "#tag-select .tag span", event.tagSelect );

			if ( loadStage ) {
				Medium.writeStage( loadStage );
			} else {
				Medium.writeStage( "1-1" );
			}

			// 推奨コーデ複数表示設定読み込み
			if ( localStorage.getItem( "multiRecommendMode" ) ) {
				// デフォルトが単一表示なので、クリックイベント発火して切り替え
				$( "#rcm-recommend-mode" ).click();
			}
		},
		/** @summary 現在のステージ情報を返す
		 * @returns {Object} 現在のステージ情報
		 */
		_getCurrentStage = function () {
			return _stage;
		},
		/** @summary スコアによるソート済ワードロープを取得する */
		_getSortedWardrobe = function () {
			return _sortedWardrobe;
		},
		/** @summary Wardrobe のモード切替時処理 */
		_changeMode = Medium.execScoring;

	return {
		wakeup: _wakeup,
		changeMode: _changeMode,
		getCurrentStage: _getCurrentStage,
		getSortedWardrobe: _getSortedWardrobe
	};
}() );

/** @type {MethodCollection} Wardrobe 用メソッドコレクション */
LAURUS.wardrobe = ( function () {
	"use strict";

	var // dependence
		WARDROBE = LAURUS.WARDROBE,

		ALL_RECORDS = LAURUS.STATIC_ITEMS.ALL_RECORDS,
		BIAS = LAURUS.STATIC_ITEMS.BIAS,
		COLUMN = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		CATEGORY_DEFS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS,
		TAG_DEFS = LAURUS.STATIC_ITEMS.TAG_DEFS,
		SORT_KEYS = LAURUS.STATIC_ITEMS.SORT_KEYS,
		PIETY_LAURUS_OPTIONS = LAURUS.STATIC_ITEMS.PIETY_LAURUS_OPTIONS,

		CATEGORY = CATEGORY_DEFS.CODE.CATEGORY,
		SLOT = CATEGORY_DEFS.CODE.SLOT,

		categoryOf = LAURUS.STATIC_ITEMS.utils.categoryOf,
		digitGrouping = LAURUS.STATIC_ITEMS.utils.digitGrouping,

		getImposes = LAURUS.STATIC_ITEMS.getImposes,
		setImposes = LAURUS.STATIC_ITEMS.setImposes,
		restore = LAURUS.STATIC_ITEMS.restore,
		dialogue = LAURUS.dialogue,

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
				/** @type {Boolean} 不所持アイテムの表示 */
				_displayImpossession = false,
				/** @type {Boolean} 不所持アイテム"のみ"の表示 */
				_displayImpossessionOnly = false,

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

								if ( ( slots.length !== 0 ) && ( slots.length !== CATEGORY_DEFS.SLOT_COUNT ) ) {
									return function ( record ) {
										var isContain = false;

										$.each( record[ COLUMN.SLOTS ], function () {
											isContain = isContain || ( 0 <= $.inArray( this, slots ) );
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
									return function ( item ) {
										return 0 < item[ COLUMN.TAGS ];
									};
								} else {
									return function ( item ) {
										var hasTag = restore.tag( item[ COLUMN.TAGS ] );
										return ( 0 <= $.inArray( hasTag[ 0 ], tags ) ) || ( 0 <= $.inArray( hasTag[ 1 ], tags ) );
									};
								}
							}() ),
							word: ( function () {
								if ( _condition.word === "" ) {
									return function () {
										return true;
									};
								} else {
									return function ( item ) {
										return item[ COLUMN.NAME ].toLowerCase().match( _condition.word.toLowerCase() ) !== null;
									};
								}
							}() ),
							rarity: ( function () {
								if ( _condition.rarity === 0 || _condition.rarity === 63 ) {
									return function () {
										return true;
									};
								} else {
									return function ( item ) {
										return 0 < ( _condition.rarity & _RARITY_MASK[ Math.abs( item[ COLUMN.RARITY ] ) - 1 ] );
									};
								}
							}() )
						};

					return function ( record ) {
						return Filter.word( record.item ) &&
							Filter.category( record.item ) &&
							Filter.tag( record.item ) &&
							Filter.rarity( record.item );
					};
				},
				/** @summary メディウムに設定されているソート設定から Array.sort() 用の比較関数を生成する
				 * @returns {Function} 設定項目に対応した比較関数
				 */
				_makeSortCompareFunction = function () {
					var order = _sortConfig.order === "asc" ? 1 : -1,
						tag = function ( position ) {
							return function ( a, b ) {
								return ( restore.tag( WARDROBE[ a ].item[ COLUMN.TAGS ] )[ position ] - restore.tag( WARDROBE[ b ].item[ COLUMN.TAGS ] )[ position ] ) * order;
							};
						},
						attributes = function ( style, inv ) {
							return function ( a, b ) {
								var attrA = restore.attributes( WARDROBE[ a ].item[ COLUMN.ATTRIBUTES ] )[ style ] * inv,
									attrB = restore.attributes( WARDROBE[ b ].item[ COLUMN.ATTRIBUTES ] )[ style ] * inv;

								attrA = attrA < 0 ? 0 : attrA;
								attrB = attrB < 0 ? 0 : attrB;

								return ( attrA - attrB ) * order;
							};
						},
						compare = {
							"serial": function ( a, b ) {
								return ( WARDROBE[ a ].item[ COLUMN.SERIAL ] - WARDROBE[ b ].item[ COLUMN.SERIAL ] ) * order;
							},
							"category": function ( a, b ) {
								var serialA = WARDROBE[ a ].item[ COLUMN.SERIAL ],
									serialB = WARDROBE[ b ].item[ COLUMN.SERIAL ];

								serialA = categoryOf.accessory( serialA ) ? ( BIAS.ACCESSORY + serialA % BIAS.CATEGORY ) : categoryOf.makeup( serialA ) ? ( BIAS.ALT_MAKEUP + serialA % BIAS.CATEGORY ) : serialA;
								serialB = categoryOf.accessory( serialB ) ? ( BIAS.ACCESSORY + serialB % BIAS.CATEGORY ) : categoryOf.makeup( serialB ) ? ( BIAS.ALT_MAKEUP + serialB % BIAS.CATEGORY ) : serialB;

								return ( serialA - serialB ) * order;
							},
							"name": function ( a, b ) {
								var nameA = WARDROBE[ a ].item[ COLUMN.NAME ],
									nameB = WARDROBE[ b ].item[ COLUMN.NAME ];

								return ( nameA < nameB ? -1 : nameA > nameB ? 1 : 0 ) * order;
							},
							"rarity": function ( a, b ) {
								return ( Math.abs( WARDROBE[ a ].item[ COLUMN.RARITY ] ) - Math.abs( WARDROBE[ b ].item[ COLUMN.RARITY ] ) ) * order;
							},
							"tag-f": tag( 0 ),
							"tag-l": tag( 1 ),
							"tags": function ( a, b ) {
								var tagsA = restore.tag( WARDROBE[ a ].item[ COLUMN.TAGS ] ),
									tagsB = restore.tag( WARDROBE[ b ].item[ COLUMN.TAGS ] );

								return ( ( !WARDROBE[ a ] ? 0 : ( tagsA[ 0 ] && tagsA[ 1 ] ) ? Math[ order === 1 ? "min" : "max" ]( tagsA[ 0 ], tagsA[ 1 ] ) : ( tagsA[ 0 ] || tagsA[ 1 ] ) ) -
									( !WARDROBE[ a ] ? 0 : ( tagsB[ 0 ] && tagsB[ 1 ] ) ? Math[ order === 1 ? "min" : "max" ]( tagsB[ 0 ], tagsB[ 1 ] ) : ( tagsB[ 0 ] || tagsB[ 1 ] ) ) ) * order;
							},
							"score": function ( a, b ) {
								return ( WARDROBE[ a ].score - WARDROBE[ b ].score ) * order;
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
				/** @type {MethodCollection} フィルタリングされたアイテムに関する操作 */
				_display = ( function () {
					var /** @type {Number} 現在の表示レコード数 */
						_current = 0,
						/** @type {Array} 表示するアイテムのシリアル */
						_displayItems = [],
						/** @type {Object} アイテムの一度に表示するレコード数 */
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
									all: digitGrouping( ALL_RECORDS ) + " (all)",
									ord: digitGrouping( records )
								}[ mode ] );
						},
						/** @summary アイテム表示が終端判定
						 * @returns {Boolean} true -> 表示終端
						 */
						_isTerminate = function () {
							return _current === _displayItems.length;
						},
						/** @summary 表示アイテムの終了位置の計算
						 * @returns {Number} 終了位置
						 */
						_getToRecords = function () {
							var items = _ITEMS[ _currentStyle ]();

							return ( _current + items ) < _displayItems.length ? ( _current + items ) : _displayItems.length;
						},
						/** @summary アイテムの描写
						 * @param {Number} 開始位置
						 * @param {Number} 終了位置
						 */
						_write = function ( from, to ) {
							var html = "",
								i = 0,
								proc = _currentStyle === "list" ? "itemLine" : "itemCard",
								more = {
									list: function () {
										var toRecords = _getToRecords();

										if ( toRecords === _displayItems.length ) {
											return "残りすべて表示する（全 " + digitGrouping( _displayItems.length ) + " 件うち " + digitGrouping( _current ) + " 件表示中）";
										} else {
											return "さらに " + ( toRecords - _current ) + " 件表示する（全 " + digitGrouping( _displayItems.length ) + " 件うち " + digitGrouping( _current ) + " 件表示中）";
										}
									},
									card: function () {
										var toRecords = _getToRecords();

										if ( toRecords === _displayItems.length ) {
											return "<span class=\"item-card-more\">残りすべて表示する</span>" +
												"<span class=\"item-card-current\">表示中：" + digitGrouping( _current ) + " 件</span>" +
												"<span class=\"item-card-all\">ヒット数：" + digitGrouping( _displayItems.length ) + " 件</span>";
										} else {
											return "<span class=\"item-card-more\">さらに " + ( _getToRecords() - _current ) + " 件表示する</span>" +
												"<span class=\"item-card-current\">表示中：" + digitGrouping( _current ) + " 件</span>" +
												"<span class=\"item-card-all\">ヒット数：" + digitGrouping( _displayItems.length ) + " 件</span>";
										}
									}
								};

							for ( i = from; i < to; i += 1 ) {
								html += LAURUS[ proc ]( _displayItems[ i ] );
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
						/** @summary 表示アイテムのリセット */
						_reset = function () {
							$( "#wardrobe-list-area, #wardrobe-card-area" )
								.empty();
							$( "#zero-records, #wardrobe-list-area-box, #wardrobe-card-area-box, #list-more, #card-more" )
								.hide();

							_current = 0;

							if ( _displayItems.length === 0 ) {
								$( "#zero-records" ).show();
							} else {
								$( "#wardrobe-" + _currentStyle + "-area-box" )
									.show();
								_write( _current, _getToRecords() );
							}
						},
						/** @summary アイテム表示処理の初期化 */
						_init = function () {
							var
								withoutNotPosessions = function () {
									$.each( _myWardrobe, function () {
										if ( WARDROBE[ this ].possession ) {
											_displayItems.push( this );
										}
									} );
								},
								withoutPosessions = function () {
									$.each( _myWardrobe, function () {
										if ( !WARDROBE[ this ].possession ) {
											_displayItems.push( this );
										}
									} );
								},
								anyItems = function () {
									_displayItems = [].concat( _myWardrobe );
								};

							_myWardrobe.sort( _makeSortCompareFunction() );

							_displayItems = [];
							( _displayImpossession ? _displayImpossessionOnly ? withoutPosessions : anyItems : withoutNotPosessions )();

							_writeRecords( _displayItems.length );

							_reset();
						},
						/** @summary さらにアイテムを表示する */
						_more = function () {
							$( "#list-more, #card-more" )
								.hide();

							_write( _current, _getToRecords() );
						},
						/** @summary 未所持アイテムの表示可否（イベント） */
						_notPossession = function () {
							var proc = _displayImpossession ? "removeClass" : "addClass";

							_displayImpossession = !_displayImpossession;

							$( "#display-impossession" )[ proc ]( "sparkly" );
							$( "#display-impossession-only" )[ proc ]( "enabled" );
						},
						/** @summary 未所持アイテム"のみ"の表示可否（イベント） */
						_notPossessionOnly = function () {
							$( "#display-impossession-only" )[ _displayImpossessionOnly ? "removeClass" : "addClass" ]( "sparkly" );
							_displayImpossessionOnly = !_displayImpossessionOnly;
						};

					return {
						init: _init,
						more: _more,
						reset: _reset,
						notPossession: _notPossession,
						notPossessionOnly: _notPossessionOnly
					};
				}() ),
				/** @summary メディウムに記録されているフィルタ項目からフィルタリングして結果を描写する */
				_execFilter = function () {
					_myWardrobe = LAURUS.filter( _makeFilterRequest() );
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

							$.each( WARDROBE, function () {
								$.each( this[ COLUMN.SLOTS ], function () {
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

							$.each( WARDROBE, function () {
								var t = restore.tag( this[ COLUMN.TAGS ] );

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
						/** @summary エンターが押されたときのイベント
						 * @param {Object} evt イベントオプジェクト
						 */
						_enter2Blur = function ( evt ) {
							if ( ( evt.which ? evt.which : evt.keyCode ) === 13 ) {
								$( this ).blur();
							}
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
						enter2Blur: _enter2Blur,
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

							$.each( WARDROBE, function () {
								count[ Math.abs( this[ COLUMN.RARITY ] ) - 1 ] += 1;
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
				/** @type {MethodCollection} 並べ替え設定の操作 */
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
									asc: "0 → 999",
									desc: "999 → 0"
								},
								CATEGORY = {
									asc: "ヘアスタイル → メイク",
									desc: "メイク → ヘアスタイル"
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
									"category": CATEGORY,
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
							_sortConfig.key = "score";
							_sortConfig.order = "desc";
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
				/** @type {MethodCollection} アイテム所持状況の入出力 */
				_fileImex = ( function () {
					var FILE_STANDBY_HTML = "ここにファイルを直接ドロップ！<br>または<br><input id=\"import-file\" type=\"file\">",
						FILE_DETECTING_HTML = "ファイルを検知しました(｀・ω・´)<br>指の力をぬいてください",

						/** @summary ブラウザへのイベント伝搬を防止
						 * @param {Object} evt イベントオプジェクト
						 */
						_eventCancel = function ( evt ) {
							evt.preventDefault();
							evt.stopPropagation();
						},
						/** @summary ファイル読み込み処理
						 * @param {Object} evt イベントオプジェクト
						 * @param {Object} file ファイルオプジェクト
						 */
						_readFile = function ( evt, file ) {
							var reader = new FileReader();

							reader.readAsText( file );
							reader.onload = function () {
								setImposes( JSON.parse( reader.result ) );
								localStorage.setItem( "imposes", JSON.stringify( getImposes() ) );
								_execFilter();
								dialogue.dispose();
							};

							_eventCancel( evt );
						},
						/** @type {MethodCollection} ファイル読み込みのイベントハンドラ用イベント */
						_event = {
							/** @summary ファイルドラッグ時のイベント */
							dragover: _eventCancel,
							/** @summary ファイルが要素内に入った時のイベント
							 * @param {Object} evt イベントオプジェクト
							 */
							dragenter: function ( evt ) {
								$( this ).html( FILE_DETECTING_HTML );
								_eventCancel( evt );
							},
							/** @summary ファイルが要素内から離れた時のイベント
							 * @param {Object} evt イベントオプジェクト
							 */
							dragleave: function () {
								$( this ).html( FILE_STANDBY_HTML );
							},
							/** @summary ファイルをドロップした時のイベント
							 * @param {Object} evt イベントオプジェクト
							 */
							drop: function ( evt ) {
								_readFile( evt, evt.originalEvent.dataTransfer.files[ 0 ] );
							},
							/** @summary ファイル選択ダイアログからファイルを選択した時のイベント
							 * @param {Object} evt イベントオプジェクト
							 */
							input: function ( evt ) {
								_readFile( evt, evt.target.files[ 0 ] );
							},
							/** @summary アイテム所持情況マクロ選択イベント */
							posesOption: function () {
								var $this = $( this );

								if ( $this.hasClass( "sparkly" ) ) {
									$this
										.removeClass( "sparkly" );
									$( "#confirm-input" )
										.val( "" )
										.change()
										.prop( "disabled", true );
								} else {
									$( "#possessions-macro .poses-option" )
										.removeClass( "sparkly" );
									$this
										.addClass( "sparkly" );
									$( "#confirm-input" )
										.prop( "disabled", false );
								}
							},
							/** @summary 誤操作防止用入力イベント */
							confirmInput: function () {
								$( "#poses-deter" )[ $( this ).val() ? "removeClass" : "addClass" ]( "disabled" );
							},
							/** @summary 一括アイテム所持設定マクロの実行 */
							posesDeter: function () {
								var set = $( "#possessions-macro .sparkly" ).attr( "id" ) === "all-poses";

								$.each( WARDROBE, function () {
									this.possession = set;
								} );

								localStorage.setItem( "imposes", JSON.stringify( getImposes() ) );
								_execFilter();
								dialogue.dispose();
							}
						},
						/** @summary ファイル読み込みイベント
						 * @param {Object} evt イベントオプジェクト
						 */
						_import = function ( evt ) {
							_eventCancel( evt );
							dialogue.invoke( "file-import", this );

							$( "#file-droppable" )
								.html( FILE_STANDBY_HTML );
						},
						/** @summary ファイル書き出しイベント */
						_export = function () {
							var blob = new Blob( [ JSON.stringify( getImposes() ) ], { "type": "application/json" } );

							if ( navigator.msSaveBlob ) {
								navigator.msSaveBlob( blob, "myLaurus.json" );
								navigator.msSaveOrOpenBlob( blob, "myLaurus.json" );
							} else {
								$( this ).attr( "href", URL.createObjectURL( blob ) );
							}
						},
						_possessionsMacro = function ( evt ) {
							_eventCancel( evt );
							dialogue.invoke( "possessions-macro", this );
							$( "#possessions-macro .poses-option" )
								.removeClass( "sparkly" );
							$( "#confirm-input" )
								.val( "" )
								.change()
								.prop( "disabled", true );
						};

					return {
						event: _event,
						"import": _import,
						"export": _export,
						possessionsMacro: _possessionsMacro
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
				/** @summary 所持情況を編集する */
				_changePossession = function () {
					var $this = $( this ),
						serial = $this.data( "serial" ),
						record = WARDROBE[ serial ],
						proc = record.possession ?
							{
								to: false,
								cls: "addClass"
							} : {
								to: true,
								cls: "removeClass"
							};

					record.possession = proc.to;
					$this[ proc.cls ]( "impos" );

					localStorage.setItem( "imposes", JSON.stringify( getImposes() ) );
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
				fileImex: _fileImex,

				initialize: _initialize,
				resetUI: _resetUI,
				changStyle: _changeStyle,
				changePossession: _changePossession,
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
				/** @summary 所持情況編集のロック・解除 */
				changeEditable = function () {
					var $wardrobe = $( "#wardrobe" ),
						proc = $wardrobe.hasClass( "editable" ) ?
							{
								cls: "removeClass",
								html: "<span class=\"laurus-icon\">&#x2613;</span> 編集ロック"
							} :
							{
								cls: "addClass",
								html: "<span class=\"laurus-icon\">&#x2612;</span> 編集可能"
							};

					$wardrobe[ proc.cls ]( "editable" );
					$( this ).html( proc.html );
				},
				/** @summary ダイアログの呼び出し
				 * @param {String} filter フィルター名
				 * @returns {Function} ダイアログ呼び出しイベント関数
				 */
				invokeDialogue = function ( filter ) {
					return function () {
						dialogue.invoke( filter + "-filter", this, function () {
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
				.on( "keypress", "#filter-word", Medium.word.enter2Blur )
				.on( "click", "#filter-rarity .filter-key", invokeDialogue( "rarity" ) )
				.on( "click", "#sort-key .filter-key", invokeDialogue( "sort" ) )
				.on( "click", "#list-item-style", changeStyleFor( "list" ) )
				.on( "click", "#card-item-style", changeStyleFor( "card" ) )
				.on( "click", "#edit-lock", changeEditable )
				.on( "click", "#list-more, #card-more", Medium.display.more )
				.on( "click", "#file-import", Medium.fileImex[ "import" ] )
				.on( "click", "#file-export", Medium.fileImex[ "export" ] )
				.on( "click", "#dialogue-possessions-macro", Medium.fileImex.possessionsMacro );

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
				.on( "click", "[data-key]", mediumChangeEventFactory( "sort", "key" ) )
				.on( "click", "#display-impossession", Medium.display.notPossession )
				.on( "click", "#display-impossession-only", Medium.display.notPossessionOnly )
				// ファイル読み込み
				.on( "dragover", "#file-droppable", Medium.fileImex.event.dragover )
				.on( "dragenter", "#file-droppable", Medium.fileImex.event.dragenter )
				.on( "dragleave", "#file-droppable", Medium.fileImex.event.dragleave )
				.on( "drop", "#file-droppable", Medium.fileImex.event.drop )
				.on( "change", "#import-file", Medium.fileImex.event.input )
				.on( "click", ".poses-option", Medium.fileImex.event.posesOption )
				.on( "change", "#confirm-input", Medium.fileImex.event.confirmInput )
				.on( "click", "#poses-deter:not( .disabled )", Medium.fileImex.event.posesDeter );

			$( "#laurus" )
				.on( "click", ".editable [data-serial]", Medium.changePossession );

			$.each( CATEGORY_DEFS.HAS_SUB, function ( category ) {
				$( "#dialogue" )
					.on( "mouseenter", "[data-slot=\"" + CATEGORY[ category ] + "\"]", Medium.category.fakeMouseenter( category ) )
					.on( "mouseleave", "[data-slot=\"" + CATEGORY[ category ] + "\"]", Medium.category.fakeMouseleave( category ) );
			} );

			// constructor
			/* Start シリアル変更コンバータ */
			var
				replaceItemSerial = function ( serialzedData, oldSerial, newSerial ) {
					return serialzedData.replace( oldSerial, newSerial );
				},
				serializedImposes = localStorage.getItem( "imposes" );

			if ( serializedImposes ) {
				serializedImposes = replaceItemSerial( serializedImposes, "121154", "291154" ); // シロツメクサの幸せ since: 2017.12.25
				serializedImposes = replaceItemSerial( serializedImposes, "303314", "253314" ); // 雪だるま since: 2017.12.21
				serializedImposes = replaceItemSerial( serializedImposes, "300247", "120247" ); // 蝶のベール since: 2017.12.20
				setImposes( $.unique( JSON.parse( serializedImposes ) ) );
				localStorage.setItem( "imposes", JSON.stringify( getImposes() ) );
			}
			/* End シリアル変更コンバータ */

			// 当分の間、シリアル変更用コンバータで対応
			// setImposes( JSON.parse( localStorage.getItem( "imposes" ) ) );
			Medium.initialize();
		},
		/** @type {MethodCollection} メディウム操作窓口の提供 */
		_facade = ( function () {
			var /** @summary ソート基準を変更する（引数の順序を間違えても動作に影響はない）
				 * @param {String} オーダーキー
				 * @param {String} ソート項目
				 */
				_setSortConfig = function ( key, order ) {
					Medium.sort.change( key );
					Medium.sort.change( order );
					Medium.sort.setLabel();
				},
				/** @summary ワードフィルタに設定して実行する
				 * @param {String} ワードフィルタ（コマンド）
				 */
				_setWardFilter = function ( word ) {
					$( "#filter-word" ).val( word );
					Medium.word.change();
				};

			return {
				setSortConfig: _setSortConfig,
				setWardFilter: _setWardFilter
			};
		}() ),
		/** @summary Wardrobe のモード切替時処理 */
		_changeMode = Medium.execFilter;

	return {
		wakeup: _wakeup,
		changeMode: _changeMode,
		facade: _facade
	};
}() );

/** @type {MethodCollection} Cheetsheet 用メソッドコレクション */
LAURUS.cheatsheet = ( function () {
	"use strict";

	var // dependence
		WARDROBE = LAURUS.WARDROBE,

		COLUMN = LAURUS.STATIC_ITEMS.COLUMN.WARDROBE,
		STAGE = LAURUS.STATIC_ITEMS.COLUMN.STAGE,

		STYLE_DEFS = LAURUS.STATIC_ITEMS.STYLE_DEFS,
		SKILL_DEFS = LAURUS.STATIC_ITEMS.SKILL_DEFS,
		CATEGORY_DEFS = LAURUS.STATIC_ITEMS.CATEGORY_DEFS,

		REGISTERD_ITEMS = LAURUS.STATIC_ITEMS.ALL_RECORDS,

		digitGrouping = LAURUS.STATIC_ITEMS.utils.digitGrouping,
		restore = LAURUS.STATIC_ITEMS.restore,

		_nikki = "",

		/** @summary チートシートの生成 */
		_makeCheatSheet = function () {
			var /** @type {Object} スコアリングにおるソート済みスロット別リスト */
				SCORING_BY_SLOT = {},
				/** @summary fundamental data */
				fundamentalData = function () {
					var now = new Date(),
						year = now.getFullYear(),
						month = now.getMonth() + 1,
						date = now.getDate();

					$( "#cs-version" ).html( "ミラクルニキ " + _nikki + " 対応 / アイテム登録数：" + digitGrouping( REGISTERD_ITEMS ) + " / " + year + "." + ( month < 10 ? "0" + month : month ) + "." + ( date < 10 ? "0" + date : date ) + " 作成" );
					$( "#cs-stage" ).text( $( "#request-stage-title" ).text() );
					$( "#cs-chapter" ).html( $( "#request-chapter" ).html() );
					$( "#cs-subject" ).html( $( "#criteria-subject" ).html() );
				},
				/** @summary criteria style */
				criteriaStyle = function () {
					$.each( STYLE_DEFS.LIST, function ( index ) {
						var weight = $( "#criteria-" + this ).text(),
							branch = ( weight !== "-" ?
								{
									label: STYLE_DEFS.MAP[ index ],
									weight: weight,
									"class": ( weight < 1 ? "reduce" : 1 < weight ? "increase" : "same" )
								} : {
									label: "",
									weight: "",
									"class": ""
								} );

						$( "#cs-label-" + this )
							.text( branch.label );
						$( "#cs-" + this )
							.text( branch.weight )
							.removeClass()
							.addClass( branch[ "class" ] );
					} );
				},
				/** @summary tag bonus */
				tagBonus = function () {
					$.each( [ 1, 2 ], function () {
						var tag = $( "#criteria-tag-" + this ).text(),
							value = $( "#criteria-tag-box-" + this + " .value" ).text(),
							product = $( "#criteria-tag-box-" + this + " .product" ).text();

						$( "#cs-tag-box-" + this + " .tag" )
							.attr( "data-tag", tag )
							.html( "<span>" + tag + "</span>" );
						$( "#cs-tag-box-" + this + " .value" )
							.attr( "data-value", value )
							.text( value );
						$( "#cs-tag-box-" + this + " .product" )
							.text( product );
					} );
					$( "#none-tag-bonus" )[ $( "#cs-tag-bonus .tag-box .tag:visible" ).length === 0 ? "show" : "hide" ]();
				},
				/** @summary skills */
				skills = function () {
					var currentStage = LAURUS.advisor.getCurrentStage(),
						skill = {
							girl: currentStage[ STAGE.SKILL ][ 0 ],
							princess: currentStage[ STAGE.SKILL ][ 1 ]
						},
						NONE_SKILL = "</span><span class=\"cs-skill-name none\">スキルを使用しない または 不定</span>",
						makeSkillItem = function ( skill ) {
							return "<span class=\"cs-skill-icon " + skill + "\"></span><span class=\"cs-skill-name " + skill + "\">" + SKILL_DEFS.MAP[ skill ] + "</span>";
						},
						$receiveSkills = null;

					$( "#cs-girl-class, #cs-princess-class, #cs-other-class" )
						.hide();
					$( "#cs-skills .cs-skills" )
						.empty();

					if ( $( "#scenario-classes" ).data( "scenario" ) === "on" ) {
						$.each( [ "girl", "princess" ], function () {
							var cls = this,
								$skills = $( "#cs-" + this + "-class .cs-skills" );

							if ( skill[ this ] === 0 ) {
								$skills
									.html( NONE_SKILL );
							} else {
								$.each( SKILL_DEFS.LIST, function () {
									if ( SKILL_DEFS.MASK[ this ] & skill[ cls ] ) {
										$skills
											.append( makeSkillItem( this ) );
									}
								} );
							}
						} );

						$( "#cs-girl-class, #cs-princess-class" ).show();
					} else {
						$receiveSkills = $( "#receive-skill-icons .sparkly" );

						if ( $receiveSkills.length === 0 ) {
							$( "#cs-other-class .cs-skills" )
								.html( NONE_SKILL );
						} else {
							$receiveSkills
								.each( function () {
									$( "#cs-other-class .cs-skills" )
										.append( makeSkillItem( $( this ).data( "skill" ) ) );
								} );
						}

						$( "#cs-other-class" ).show();
					}
				},
				/** @summary slots */
				slots = function () {
					var criteriaTags = [ $( "#criteria-tag-1" ).data( "id" ), $( "#criteria-tag-2" ).data( "id" ) ],
						sortedWardrobe = LAURUS.advisor.getSortedWardrobe();

					$.each( CATEGORY_DEFS.SLOT_LIST, function () {
						SCORING_BY_SLOT[ this ] = [];
					} );

					$.each( sortedWardrobe, function () {
						var record = WARDROBE[ this ],
							slots = record.item[ COLUMN.SLOTS ];

						if ( !record.fail && record.score ) {
							SCORING_BY_SLOT[ slots.length === 1 ? CATEGORY_DEFS.SLOT[ slots[ 0 ] ] : "complex" ].push( this );
						}
					} );

					$( "#cs-recommends .cs-recommends-list" )
						.empty();

					$.each( CATEGORY_DEFS.SLOT_LIST, function () {
						var $slot = $( "#cs-" + this + " .cs-recommends-list" ),
							ITEMS = 6,
							list = SCORING_BY_SLOT[ this ],
							terminus = list.length < ITEMS ? list.length : ITEMS,
							serial = 0,
							before = -1,
							compare = "",
							matchTags = [],
							tags = null,
							record = null,
							item = null,
							makeTagIcon = function ( matchs ) {
								var html = "";

								$.each( matchs, function () {
									html += "<span class=\"cs-tag\" data-cs-tag=\"" + this + "\"></span>";
								} );

								return html;
							};

						if ( terminus === 0 ) {
							$slot
								.append( "<span class=\"cs-item none\"><span>推奨アイテムなし...( &gt;﹏&lt;。)</span></span>" );
						} else {
							for ( var i = 0; i < terminus; i += 1 ) {
								serial = list[ i ];
								record = WARDROBE[ serial ];
								item = record.item;
								compare = record.score < before ?
									{
										cls: "lesser",
										character: "&lt;"
									} : {
										cls: "equal",
										character: "="
									};
								tags = restore.tag( item[ COLUMN.TAGS ] );
								matchTags = [];

								$.each( tags, function () {
									if ( this !== 0 && ( this === criteriaTags[ 0 ] || this === criteriaTags[ 1 ] ) ) {
										matchTags.push( this );
									}
								} );

								$slot
									.append( "<span class=\"cs-item" + ( matchTags.length === 0 ? "" : " cs-has-tags" ) + "\"><span class=\"cs-compare " + compare.cls + "\">" + compare.character + "</span>" + makeTagIcon( matchTags ) + "<span class=\"cs-item-name\">" + item[ COLUMN.NAME ] + "</span><span class=\"cs-score\">" + digitGrouping( record.score ) + "</span></span>" );

								before = record.score;
							}
						}
					} );
				},
				/** @summary recommends */
				recommends = function () {
					var /** @summary 排他的スロットのスコア合計 */
						compareExclusive = function ( a, b ) {
							var　/** @summary スコア合計の計算 */
								scoreTotal = function ( slots ) {
									var total = 0;

									$.each( slots, function () {
										total += WARDROBE[ SCORING_BY_SLOT[ this ][ 0 ] ].score || 0;
									} );

									return total;
								},
								compareResult = [],
								recommend = scoreTotal( b ) <= scoreTotal( a );

							$.each( a, function () {
								compareResult.push( {
									slot: this,
									recommend: recommend
								} );
							} );

							recommend = !recommend;

							$.each( b, function () {
								compareResult.push( {
									slot: this,
									recommend: recommend
								} );
							} );

							return compareResult;
						},
						/** @summary 排他的スロットの推奨情報を書き込む */
						setRecommendSlot = function ( compareResult ) {
							$.each( compareResult, function () {
								$( "#cs-" + this.slot )
									.removeClass( "recommend deprecated" )
									.addClass( this.recommend ? "recommend" : "deprecated" );
							} );
						};

					setRecommendSlot( compareExclusive( [ "dress" ], [ "tops", "bottoms" ] ) );
					setRecommendSlot( compareExclusive( [ "right-hand-holding", "left-hand-holding" ], [ "both-hand-holding" ] ) );
				};

			fundamentalData();
			criteriaStyle();
			tagBonus();
			skills();
			slots();
			recommends();
		},
		/** @summary CheatSheet の初期化処理 */
		_wakeup = function () {
			_nikki = $( "#timeline .content:first" ).data( "nikki" );
		},
		/** @summary CheatSheet のモード切替時処理 */
		_changeMode = _makeCheatSheet;

	return {
		wakeup: _wakeup,
		changeMode: _changeMode
	};
}() );

/** @type {MethodCollection} Credit 用メソッドコレクション */
LAURUS.credit = ( function () {
	"use strict";

	var /** @summary Credit の初期化処理 */
		_wakeup = function () {
			var version = $( "#changelog .content:first .version" ).text(),
				release = $( "#changelog .content:first .release" ).text();

			$( "#last-update" ).text( version + " / " + release );
		},
		/** @summary Credit のモード切替時処理 */
		_changeMode = function () {
		};

	return {
		wakeup: _wakeup,
		changeMode: _changeMode
	};
}() );

/** @type {MethodCollection} Changelog 用メソッドコレクション */
LAURUS.changelog = ( function () {
	"use strict";

	var /** @summary Changelog の初期化処理 */
		_wakeup = function () {
			var /** @summary Changelog データベースを読み込んで追加する */
				loadLogs = function ( moreLogs ) {
					var _logs = "",
						items = [],
						appendItemsNum = 0,
						_build = function ( log ) {
							var withFigure = log.hasOwnProperty( "with-figure" ),
								content = "<div class=\"content\"><span class=\"version\">" + log.version + "</span><span class=\"release\">" + log.release + "</span>" + ( log.hasOwnProperty( "closet" ) ? "<span class=\"closet\">" + log.closet + "</span>" : "" ) + "<ul class=\"change-list" + ( withFigure ? " with-figure" : "" ) + "\">",

								appendItems = function () {
									var hasAppendItems = "";

									if ( log.hasOwnProperty( "append-items" ) ) {
										var appendItems = log[ "append-items" ],
											coordinate = "";

										$.each( appendItems, function () {
											coordinate += "<dt>" + "<span class=\"category " + this[ 0 ] + "\">" + this[ 1 ] + "</span>" + ( this[ 2 ] ? "<span class=\"coordinate\">" + this[ 2 ] + "</span>" : "" ) + "<span class=\"entries\">" + this[ 3 ] + "</span></dt>" +
												"<dd><span class=\"item-command-set\"><span class=\"append-items\"><span>" + this[ 4 ] + "</span></span><span class=\"filter-macro-button\"><span>抽出</span></span></span>" + ( this[ 5 ] ? "<span class=\"note\">" + this[ 5 ] + "</span>" : "" ) + "</dd>";
										} );

										items.push( coordinate );
										hasAppendItems = "hasAppendItems" + appendItemsNum;
										appendItemsNum += 1;
									}

									return hasAppendItems;
								};

							$.each( [ "advisor", "wardrobe", "cheatsheet", "credit", "changelog", "database", "foundation" ], function ( index, module ) {
								if ( log.hasOwnProperty( this ) ) {
									content += "<li class=\"" + this + "\"><span class=\"changelog-tab\">Laurus :: " + ( this.charAt( 0 ).toUpperCase() + this.slice( 1 ) ) + "</span><ul>";

									$.each( log[ this ], function () {
										content += "<li>" + this + ( module === "database" ? appendItems() : "" ) + "</li>";
									} );

									content += "</ul></li>";
								}
							} );

							return content + "</ul>" + ( withFigure ? "<img alt=\"\" class=\"lazyload figure\" src=\"resources/placeholder.png\" data-src=\"resources/changelog/" + log.version + ".png\">" : "" ) + "</div>";
						};

					$.each( moreLogs, function () {
						_logs += _build( this );
					} );

					_logs = _logs
						.replace( /\/\//g, "<br>" )
						.replace( /\|(.[^\|]+)\|/g, "<span class=\"coord\">$1</span>" )
						.replace( /\*\*([^\*]+)\*\*/g, "<strong>$1</strong>" )
						.replace( /\[([^\]]+)\]/g, "<p>$1</p>" )
						.replace( /(Issues #)(\d+)/g, "<a href=\"https://github.com/miramiku/Laurus/issues/$2\">$1$2</a>" );

					for ( var i = 0; i < appendItemsNum; i += 1 ) {
						_logs = _logs.replace( "hasAppendItems" + i, "<dl>" + items[ i ] + "</dl>" );
					}

					$( "#timeline" )
						.append( _logs );

					$( "#changelog-more" )
						.remove();
				};

			$( "#changelog" )
				.on( "click", "#changelog-more > span", function () {
					$.getJSON( "resources/changelog.json", loadLogs );
				} )
				.on( "click", ".append-items > span", function () {
					var range = document.createRange(),
						selection = window.getSelection();

					range.selectNodeContents( $( this ).get( 0 ) );
					selection.removeAllRanges();
					selection.addRange( range );
				} )
				.on( "click", ".filter-macro-button > span", function () {
					var filterCommand = $( this ).parent().prev().children().text(),
						$subject = $( this ).parent().parent().parent().prev(),
						$category = $subject.find( ".category" ),
						$coordinate = $subject.find( ".coordinate" ),
						wardrobeFacade = LAURUS.wardrobe.facade;

					wardrobeFacade.setSortConfig( "category", "asc" );
					wardrobeFacade.setWardFilter( filterCommand );

					$( "#wardrobe-button" ).click();
					$( "#back2top a" ).click();

					toastr.info( $category.text() + ( !( $category.hasClass( "all" ) || $category.hasClass( "others" ) ) ? " " + $coordinate.text() : "" ) + "のアイテムを抽出しました" );
				} );
		},
		/** @summary Changelog のモード切替時処理 */
		_changeMode = function () {
		};

	return {
		wakeup: _wakeup,
		changeMode: _changeMode
	};
}() );

/** @summary モード（ページ）チェンジ */
LAURUS.changeMode = function () {
	"use strict";

	var mode = $( this ).data( "mode" );

	toastr
		.remove();

	$( "#general-navgation .ghost-button" )
		.removeClass( "current-mode" );

	$( this )
		.addClass( "current-mode" );
	$( "#header" )
		.attr( "class", mode );

	$( "#current-mode" )
		.text( mode.charAt( 0 ).toUpperCase() + mode.substring( 1 ) );

	$( ".tab, .tab-toc" )
		.hide();
	$( "#" + mode + ", #toc-" + mode )
		.show();

	if ( LAURUS[ mode ].changeMode ) {
		LAURUS[ mode ].changeMode();
	}
};

/** @type {Object} 各ページ初期化処理 */
LAURUS.wakeup = {
	laurus: function () {
		"use strict";

		$( "#general-navgation" )
			.on( "click", ".ghost-button:not( .usage )", LAURUS.changeMode )
			.on( "click", ".usage", function () {
				window.open( "https://miramiku.github.io/Laurus/usage/" );
			} );

		$( "#laurus" )
			.on( "click", "a[href^=\"#\"]", function ( evt ) {
				var speed = 500,
					href = $( this ).attr( "href" ),
					target = $( href === "#" || href === "" ? "html" : href.replace( ":", "\\:" ) ),
					position = target.offset().top;

				$( "body, html" ).animate( {
					scrollTop: position
				}, speed, "swing" );

				evt.preventDefault();
			} )
			.on( "click", "#credit-me", function ( evt ) {
				evt.preventDefault();

				$( "#credit-button" ).click();
				$( "#back2top a" ).click();
			} );
	},
	advisor: LAURUS.advisor.wakeup,
	wardrobe: LAURUS.wardrobe.wakeup,
	// purveyor: function () { },
	cheatsheet: LAURUS.cheatsheet.wakeup,
	credit: LAURUS.credit.wakeup,
	changelog: LAURUS.changelog.wakeup,
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
	// LAURUS.wakeup.purveyor();
	LAURUS.wakeup.cheatsheet();
	LAURUS.wakeup.credit();
	LAURUS.wakeup.changelog();
	LAURUS.wakeup.dialogue();

	$( "#dialogue" ).perfectScrollbar();

	$( "#advisor-button" ).click();
} );
