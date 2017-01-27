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
		"靴下", "シューズ", "ヘアアクセサリー", "首飾り", "耳飾り",
		"腕飾り", "手持品", "腰飾り", "特殊", "メイク"
	],
	/** クローゼットのコラム名 */
	COLUMN: {
		PART:        0,
		RARITY:      1,
		NAME:        2,
		THEME:       3,
		COORDINATE:  4,
		STYLES:      5,
		ATTRIBUTES:  6,
		VALUES:      7,
		TAGS:        8,
		PROC:        9,
		NOTES:      10,
		TEXT:       11
	},
	/** スタイルの対応値 */
	STYLE_INDEX: [
		"華麗", "シンプル",
		"エレガント", "アクティブ",
		"大人", "キュート",
		"セクシー", "ピュア",
		"ウォーム", "クール"
	],
	/** タグの対応値 */
	TAG_INDEX: [
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
	/** 属性値の対応値 */
	VALUE_INDEX: [ "C", "B", "A", "S", "SS" ]
};

/** クローゼット */
LAURUS.CLOSET = ( function () {
	"use strict";
	var _closet = {};

	$.each( LAURUS.CONSTS.CATEGORY, function () {
		_closet[ this ] = {};
	} );

	$.ajax( {
		type: "GET",
		url: "data/closet.json",
		dataType: "json",
		async: false,
		success: function( data ) {
			var records = 0;

			$.each( data, function () {
				_closet[ this[ 0 ] ][ this[ 1 ] ] = this.slice( 2 );
				records += 1;
			} );

			LAURUS.CONSTS.ALL_RECORDS = records;
		}
	} );

	return _closet;
} () );

LAURUS.itemCard = function ( category, id ) {
	"use strict";

	var COLUMN = LAURUS.CONSTS.COLUMN,
		data = LAURUS.CLOSET[ category ][ id ],
		card = "<div class=\"item-card\">";

	card += "<div class=\"item-icon-box\">";
	card += "<span class=\"item-icon\"><img src=\"data/hair-style/001.png\" alt=\"\"></span>";
	card += "<span class=\"item-tags\"><img src=\"data/tags/tag1.png\" alt=\"\"><img src=\"data/tags/tag2.png\" alt=\"\"></span>";
	card += "</div>";
	card += "<span class=\"item-name\">" + data[ COLUMN.NAME ] + "</span>";
	card += "<span class=\"item-attributes\"></span>";


	card += "</div>";

	/*
	 * https://www.amcharts.com/demos/micro-charts-sparklines/
	 * https://www.amcharts.com/kbase/creating-sparkline-micro-charts/
	 */

	return card;
};

/** 各モード初期化処理 */
LAURUS.wakeup = {
	advisor: function () {},
	manager: function () {
		"use strict";

		$.each( LAURUS.CONSTS.CATEGORY, function () {
			var category = this;
			$.each( LAURUS.CLOSET[ category ], function ( id ) {
				$( "#manager" ).append( LAURUS.itemCard( category, id ) );
			} );
		} );
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

	$( "article" ).hide();
	$( "#" + mode ).show();
};

/** boot Laurus */
$( document ).ready( function () {
	"use strict";

	$( "#general-navgation .ghost-button" )
		.click( LAURUS.changeMode );

	LAURUS.wakeup.manager();

	$( "#manager-button" ).click();
} );

