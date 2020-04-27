// Switching between the tabs.
jQuery( document ).ready( function() {

	jQuery( '.spl-nav-tab' ).click( function() {

		if( jQuery( this ).hasClass( 'spl-nav-tab-active' ) ){
			return;
		}

		jQuery( '.spl-nav-tab' ).removeClass( 'spl-nav-tab-active' );
		jQuery( this ).addClass( 'spl-nav-tab-active' );

		jQuery( '.spl-settings-form-page' ).removeClass( 'spl-active' );

		var selected_tab = jQuery(this).attr("href");
		
		jQuery( selected_tab ).addClass( 'spl-active' );
	} );

	jQuery( '#submit' ).click( function( e ) {

		e.preventDefault();

		var form = jQuery( '#spl-settings-form' );

		// Send data to server. 
		data = 'action=handle_submit&' + form.serialize() + '&security=' + settings.nonce;
		
		// Ajax request.
		jQuery.post( settings.ajax_url, data, function( response ) {
			if( response == 'success' ) {
				jQuery( '#spl-message' ).css( 'display', 'block' );
			}
		} )
		console.log( form.serialize() );
	} );

	jQuery( '.spl-notice-dismiss' ).click( function() {
		jQuery( '#spl-message' ).css( 'display', 'none' );
	} );
} );