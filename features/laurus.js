/** Package のつもり */
var LAURUS = {};

LAURUS.changeMode = function () {
	"use strict";

	var mode = $( this ).data( "mode" );

	$( "#general-navgation .ghost-button" ).removeClass( "current-mode" );

	$( this ).addClass( "current-mode" );
	$( "#header" ).attr( "class", mode );

	$( "#current-mode" ).text( mode.charAt( 0 ).toUpperCase() + mode.substring( 1 ) );
	$( "#debug" ).text( mode.charAt( 0 ).toUpperCase() + mode.substring( 1 ) );

	$( "article" ).hide();
	$( "#" + mode ).show();

};

/** boot Laurus */
$( document ).ready( function () {
	"use strict";

	$( "#general-navgation .ghost-button" )
		.click( LAURUS.changeMode );

	$( "#advisor-button" ).click();
} );
