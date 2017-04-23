/*jshint unused: false */

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
