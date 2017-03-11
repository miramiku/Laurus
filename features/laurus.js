/*jshint devel: true */

/** Laurus Package */
var LAURUS = {};

/** 定数コレクション */
LAURUS.CONSTS = {
	/** 全アイテム数 */
	ALL_RECORDS: 0,
	/** アイテム分類一覧兼オーダー */
	CATEGORY: [
		"ヘアスタイル", "ドレス", "コート", "トップス", "ボトムス",
		"靴下", "シューズ", "ヘアアクセサリー", "耳飾り", "首飾り",
		"腕飾り", "手持品", "腰飾り", "特殊", "メイク"
	],
	/** クローゼットのコラム名 */
	COLUMN: {
		PART: 0,
		RARITY: 1,
		NAME: 2,
		THEME: 3,
		COORDINATE: 4,
		STYLES: 5,
		ATTRIBUTES: 6,
		TAGS: 7,
		PROC: 8,
		NOTES: 9,
		TEXT: 10
	},
	/** スタイルの対応値 */
	STYLE_INDEX: [
		"華麗", "シンプル",
		"エレガント", "アクティブ",
		"大人", "キュート",
		"セクシー", "ピュア",
		"ウォーム", "クール"
	],
	/** アイテム分類の対応値 */
	CATEGORY_MAP: {
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
	/** アイテム分類の対応値 */
	CATEGORY_ICONS: {
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
	/** タグの対応値 */
	TAG_MAP: [
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
	/** タグの CSS クラス対応表 */
	TAGS_CLASSES: [
		"none",
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
	/** 属性値の対応値 */
	VALUE_INDEX: [ "C", "B", "A", "S", "SS" ]
};

/** クローゼット */
LAURUS.WARDROBE = ( function () {
	"use strict";

	var _wardrobe = {};

	$.each( LAURUS.CONSTS.CATEGORY, function () {
		_wardrobe[ this ] = {};
	} );


	$.ajax( {
		type: "GET",
		url: "/data/wardrobe.json",
		dataType: "json",
		async: false,
		success: function ( data ) {
			var ATTRIBUTES = LAURUS.CONSTS.COLUMN.ATTRIBUTES,
				TAGS = LAURUS.CONSTS.COLUMN.TAGS,
				records = 0,
				attributesColumn = function ( attributes ) {
					var a = [];

					$.each( attributes.split( "" ), function ( index ) {
						var v = parseInt( this, 16 );
						a[ index ] = ( 0 < ( v & 8 ) ? -1 : 1 ) * ( ( v & 7 ) + 1 );
					} );

					return a;
				},
				tagColumn = function ( tags ) {
					var TAG_BASE = 45;

					return [ tags % TAG_BASE, Math.floor( tags / TAG_BASE ) ];
				};

			$.each( data, function () {
				var category = this[ 0 ],
					id = this[ 1 ];

				_wardrobe[ category ][ id ] = this.slice( 2 );
				_wardrobe[ category ][ id ][ ATTRIBUTES ] = attributesColumn( _wardrobe[ category ][ id ][ ATTRIBUTES ] );
				_wardrobe[ category ][ id ][ TAGS ] = tagColumn( _wardrobe[ category ][ id ][ TAGS ] );

				records += 1;
			} );

			LAURUS.CONSTS.ALL_RECORDS = records;
		}
	} );

	return _wardrobe;
}() );

LAURUS.itemCard = function ( category, id ) {
	"use strict";

	var // consts
		COLUMN = LAURUS.CONSTS.COLUMN,
		TAGS_CLASSES = LAURUS.CONSTS.TAGS_CLASSES,
		CATEGORY_ICONS = LAURUS.CONSTS.CATEGORY_ICONS,

		// record
		record = LAURUS.WARDROBE[ category ][ id ],

		// concrete HTML
		icon = ( function () {
			/* Note:
			 * style="background-image: url( Filename );"
			 * ではスラッシュがHTML描画時に空白に置き換えられてしまうため、CSSで対応。
			 */
			var ROW = 20,
				SIDE = 40,
				UNIT = 200,

				iconFile = CATEGORY_ICONS[ category ] + "-" + Math.floor( id / UNIT ),
				rowPos = -1 * ( id % ROW ) * SIDE,
				colPos = -1 * Math.floor( ( id % ROW ) / ROW ) * SIDE;

			return "<span class=\"item-icon " + iconFile + "\" style=\"background-position: " + rowPos + "px " + colPos + "px;\"></span>";
		}() ),
		tags = "<span class=\"item-tags-box\"><span class=\"item-tags item-tags-" + TAGS_CLASSES[ record[ COLUMN.TAGS ][ 0 ] ] + "\"></span><span class=\"item-tags item-tags-" + TAGS_CLASSES[ record[ COLUMN.TAGS ][ 1 ] ] + "\"></span></span>",
		name = "<span class=\"item-name\"><span class=\"item-id\">" + ( id < 100 ? ( "000" + id ).slice( -3 ) : id ) + "</span>" + record[ COLUMN.NAME ] + "</span>",
		rarity = "<span class=\"item-rarity " + ( record[ COLUMN.RARITY ] < 0 ? " with-animate" : "" ) + "\"><span class=\"laurus-icon\">&#x2606;</span>" + Math.abs( record[ COLUMN.RARITY ] ) + "</span>",
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

			$.each( record[ COLUMN.ATTRIBUTES ], function () {
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
		sparkline = "<span class=\"item-sparkline-box\"><span class=\"item-sparkline\">" + record[ COLUMN.ATTRIBUTES ].join( "," ) + "</span></span>";

	return "<div class=\"item-card\">" +
		"<div class=\"item-icon-box\">" + icon + tags + "</div>" +
		name + rarity +
		attributesTable + sparkline +
		"</div>";
};

/** 各モード初期化処理 */
LAURUS.wakeup = {
	advisor: function () {},
	wardrobe: function () {
		"use strict";

		$.each( LAURUS.CONSTS.CATEGORY, function () {
			var category = this;
			$.each( LAURUS.WARDROBE[ category ], function ( id ) {
				$( "#wardrobe" ).append( LAURUS.itemCard( category, id ) );
			} );
		} );

		$( ".item-sparkline" )
			.peity( "line", {
				strokeWidth: 2,
				height: 37,
				width: 60,
				delimiter: ",",
				fill: "rgba( 141, 214, 141, 0.2 )",
				max: 5,
				min: -5,
				stroke: "#8dd68d"
			}　 );
	},
	purveyor: function () {},
	credit: function () {},
	changelog: function () {}
};

/** モード（ページ）チェンジ */
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

/** boot Laurus */
$( document ).ready( function () {
	"use strict";

	$( "#general-navgation .ghost-button" )
		.click( LAURUS.changeMode );

	//	LAURUS.wakeup.wardrobe();

	$( "#advisor-button" ).click();
	//	$( "#wardrobe-button" ).click();
} );
