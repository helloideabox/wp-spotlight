<?php
/**
 * Responsible for settings page for spotlight.
 *
 * @author  IdeaBox
 * @package Spotlight/Settings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


// Get post type arguments.
$args = array(
	'public'       => true,
	'show_in_rest' => true,
);

// For enqueuing media library.
wp_enqueue_media();

// Gettings registered post with specified args.
$post_type_objects = get_post_types( $args, 'object' );
$post_types        = array();

foreach ( $post_type_objects as $key ) {
	$post_types[ $key->name ] = $key->label;
}

unset( $post_types['attachment'] );

// Getting selected post types from db.
$selected_post_types = get_option( 'spl_post_types' );

// Getting settings value stored in db.
$enable_search_box      = get_option( 'spl_enable_search_box' );
$enable_contact_tab     = get_option( 'spl_enable_contact_tab' );
$enable_number_of_posts = get_option( 'spl_number_of_posts' );
$font_family            = get_option( 'spl_font_family' );
$post_heading_size      = get_option( 'spl_post_heading_size' );
$upload_image_url       = get_option( 'spl_upload_image_url' );
$upload_image_name      = get_option( 'spl_upload_image_name' );
$primary_color          = get_option( 'spl_primary_color' );
$from_email             = get_option( 'spl_from_email' );
$from_email             = get_option( 'spl_from_email' );
$from_name              = get_option( 'spl_from_name' );
$send_email             = get_option( 'spl_send_email' );

?>
<div class="spl-settings-wrap">
	<h1 class="spl-settings-heading"><?php esc_attr_e( 'Spotlight', 'spotlight' ); ?></h1>

	<div id="spl-message">
		<p><?php esc_attr_e( 'Settings Updated', 'spotlight' ); ?></p>

		<button type="button" class="spl-notice-dismiss">
			<span class="screen-reader-text"><?php esc_attr_e( 'Dismiss this notice', 'spotlight' ); ?></span>
		</button>
	</div>

	<div id="spl-settings-tab-wrapper" class="spl-nav-tab-wrapper">
		<a id="spl-settings-tab-general" class="spl-nav-tab spl-nav-tab-active" href="#tab-general">
			<?php esc_attr_e( 'General', 'spotlight' ); ?>
		</a>

		<a id="spl-settings-tab-style" class="spl-nav-tab" href="#tab-style">
			<?php esc_attr_e( 'Style', 'spotlight' ); ?>
		</a>
	</div>

	<form id="spl-settings-form" method="post" action="">
		<div id="tab-general" class="spl-settings-form-page spl-active">
			<table class="form-table">
				<tr class="spl-cpt-support">
					<th scope="row"><?php esc_attr_e( 'Post Types', 'spotlight' ); ?></th>

					<td>
						<?php foreach ( $post_types as $key => $value ) { ?>
						<label>
							<input
								type="checkbox"
								name="spl_cpt_support[]"
								value="<?php echo esc_attr( $key ); ?>"
								<?php
								if ( in_array( $key, $selected_post_types, true ) ) {
									esc_attr_e( 'checked', 'spotlight' );
								}
								?>
							>
							<?php echo esc_attr( $value ); ?>
						</label>
						<br>
						<?php } ?>
						<p>
							<i>
								<?php esc_attr_e( 'Note: These are the post types whose post are displayed and also used for searching.', 'spotlight' ); ?>
							</i>
						</p>
					</td>
				</tr>

				<tr class="spl-enable-search-box">
					<th scope="row"><?php esc_attr_e( 'Enable Search Box', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="checkbox"
								name="spl_enable_search_box"
								value="1"
								<?php checked( $enable_search_box ); ?>
							>
							<?php esc_attr_e( 'Checking this checkbox will enable search box for spotlight which will search post for the post type selected above.', 'spotlight' ); ?>
						</label>
					</td>
				</tr>

				<tr class="spl-enable-contact-tab">
					<th scope="row"><?php esc_attr_e( 'Enable Contact tab', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="checkbox"
								name="spl_enable_contact_tab"
								value="1"
								<?php checked( $enable_contact_tab ); ?>
							>
							<?php esc_attr_e( 'Checking this checkbox will enable contact tab for spotlight which will allow users to ask question.', 'spotlight' ); ?>
						</label>
					</td>
				</tr>

				<tr class="spl-number-of-post">
					<th scope="row"><?php esc_attr_e( 'Number of Posts', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="number"
								name="spl_number_of_posts"
								min="-1"
								placeholder="10"
								value="<?php echo esc_attr( $enable_number_of_posts ); ?>"
								<?php checked( $enable_contact_tab ); ?>
							>
							<p>
								<i>
								<?php esc_attr_e( 'Sets the number of posts to be shown in answers tab( Default: -1 ).', 'spotlight' ); ?>
								</i>
							</p>
						</label>
					</td>
				</tr>

				<tr class="spl-from-email">
					<th scope="row"><?php esc_attr_e( 'From Email', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="email"
								name="spl_from_email"
								placeholder="abc@gmail.com"
								value="<?php echo esc_attr( $from_email ); ?>"
							>
							<p>
								<i>
								<?php esc_attr_e( 'Uses the email address to send the message.', 'spotlight' ); ?>
								</i>
							</p>
						</label>
					</td>
				</tr>

				<tr class="spl-from-name">
					<th scope="row"><?php esc_attr_e( 'From Name', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="text"
								name="spl_from_name"
								value="<?php echo esc_attr( $from_name ); ?>"
							>
							<p>
								<i>
								<?php esc_attr_e( 'The name attached to the email address to send the message.', 'spotlight' ); ?>
								</i>
							</p>
						</label>
					</td>
				</tr>

				<tr class="spl-send-email">
					<th scope="row"><?php esc_attr_e( 'Send To Email', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="email"
								name="spl_send_email"
								value="<?php echo esc_attr( $send_email ); ?>"
							>
							<p>
								<i>
								<?php esc_attr_e( 'The email address the message is to be send.', 'spotlight' ); ?>
								</i>
							</p>
						</label>
					</td>
				</tr>
			</table>
		</div>

		<div id="tab-style" class="spl-settings-form-page">
			<table class="form-table">
				<tr class="spl-font-family">
					<th scope="row"><?php esc_attr_e( 'Font Family', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="text"
								name="spl_font_family"
								placeholder="Theme's font family"
								value="<?php echo esc_attr( $font_family ); ?>"
							>
							<p>
								<i>
								<?php esc_attr_e( 'Sets the font family for the plugin( Note: Use suitable name for otherwise it will fallback to themes font family ).', 'spotlight' ); ?>
								</i>
							</p>
						</label>
					</td>
				</tr>

				<tr class="spl-font-family">
					<th scope="row"><?php esc_attr_e( 'Post Heading', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="text"
								name="spl_post_heading_size"
								placeholder="13"
								value="<?php echo esc_attr( $post_heading_size ); ?>"
							><?php esc_attr_e( 'px', 'spotlight' ); ?>
							<p>
								<i>
								<?php esc_attr_e( 'Sets the font size of post heading displayed in answers tab( Default: 13px ).', 'spotlight' ); ?>
								</i>
							</p>
						</label>
					</td>
				</tr>

				<tr class="spl-font-family">
					<th scope="row"><?php esc_attr_e( 'Upload Image', 'spotlight' ); ?></th>

					<td>
						<label>
							<button id="upload-image" class="button button-primary" type="button">
								<?php esc_attr_e( 'Upload Image', 'spotlight' ); ?>
							</button>

							<div class="spl-upload-image-wrap">

								<?php if ( '' != $upload_image_name ) { ?>
									<span class="spl-upload-image-name"><?php echo esc_attr( $upload_image_name ); ?></span>
								<?php } else { ?>
									<span class="spl-upload-image-name"><?php esc_attr_e( 'No Image Selected', 'spotlight' ); ?></span>
								<?php } ?>

								<button id="spl-delete-image" class="button button-primary" type="button">Delete Image</button>
							</div>

							<input
								class="spl_upload_image_url"
								type="hidden"
								name="spl_upload_image_url"
								value="<?php echo esc_attr( $upload_image_url ); ?>"
							>

							<input
								class="spl_upload_image_name"
								type="hidden"
								name="spl_upload_image_name"
								value="<?php echo esc_attr( $upload_image_name ); ?>"
							>
							<p>
								<i>
								<?php esc_attr_e( 'Sets the image to header of the ask tab.', 'spotlight' ); ?>
								</i>
							</p>
						</label>
					</td>
				</tr>

				<tr class="spl-primary-color">
					<th scope="row"><?php esc_attr_e( 'Primary Color', 'spotlight' ); ?></th>

					<td>
						<label>
							<input
								type="text"
								value="<?php echo esc_attr( $primary_color ); ?>"
								class="spl-primary-color-field"
								name="spl_primary_color"
								data-default-color="#fc5d7d"
							/>
						</label>
						<p>
							<i>
							<?php esc_attr_e( 'Sets the background color of the plugin( Default: #fc5d7d ).', 'spotlight' ); ?>
							</i>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<?php submit_button(); ?>
	</form>
</div>
