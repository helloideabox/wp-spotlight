// Switching between the tabs.
jQuery( document ).ready( function() {

	jQuery( '.spl-nav-tab' ).on( 'click',function() {

		if( jQuery( this ).hasClass( 'spl-nav-tab-active' ) ){
			return;
		}

		jQuery( '.spl-nav-tab' ).removeClass( 'spl-nav-tab-active' );
		jQuery( this ).addClass( 'spl-nav-tab-active' );

		jQuery( '.spl-settings-form-page' ).removeClass( 'spl-active' );

		var selected_tab = jQuery(this).attr("href");
		
		jQuery( selected_tab ).addClass( 'spl-active' );
	} );

	jQuery( '#submit' ).on( 'click', function( e ) {

		e.preventDefault();

		var form = jQuery( '#spl-settings-form' );

		// Send data to server. 
		data = 'action=handle_submit&' + form.serialize() + '&security=' + settings.nonce;
		//console.log( data );
		
		// Ajax request.
		jQuery.post( settings.ajax_url, data, function( response ) {

			jQuery( '#spl-message' ).fadeOut();

			if( response == 'success' ) {
				jQuery( '#spl-message' ).fadeIn();
			}
		} );
	} );

	jQuery( '.spl-notice-dismiss' ).on( 'click', function() {
		jQuery( '#spl-message' ).fadeOut();
	} );

	jQuery( '#upload-image' ).click( function() {

		var image = wp.media({
            title : "Upload image for Slider",
            multiple : false
        }).open().on( "select",function() {

			//getting information about the image
			var uploaded_image = image.state().get("selection").first().toJSON();

			jQuery( '.spl-upload-image-name' ).html( uploaded_image.title );
			jQuery( '.spl_upload_image_url' ).val( uploaded_image.url );
			jQuery( '.spl_upload_image_name' ).val( uploaded_image.title );
			//console.log( uploaded_image );
		} );
	} );

	jQuery( '#spl-delete-image' ).on( 'click', function() {

		jQuery( '.spl-upload-image-name' ).html( 'No Image Selected' );
		jQuery( '.spl_upload_image_name' ).val( ' ' );
		jQuery( '.spl_upload_image_url' ).val( ' ' );
	} );


	// Help to initiate wp color picker with associated class.
	jQuery('.spl-primary-color-field').wpColorPicker();
} );