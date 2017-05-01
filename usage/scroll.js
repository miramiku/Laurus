( function () {
	"use strict";

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
		} );
}() );
