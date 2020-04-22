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

// Gettings registered post with specified args.
$post_type_objects = get_post_types( $args, 'object' );
$post_types        = array();

foreach ( $post_type_objects as $key ) {
	$post_types[ $key->name ] = $key->label;
}

unset( $post_types['attachment'] );

// Getting selected post types from db.
$selected_post_types = get_option( 'spl_post_types' );

?>
<div class="spl-settings-wrap">
	<h1><?php esc_attr_e( 'Spotlight', 'spotlight' ); ?></h1>

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
								value="<?php esc_attr_e( $key, 'spotlight' ); ?>"
								<?php
								if ( in_array( $key, $selected_post_types, true ) ) {
									esc_attr_e( 'checked', 'spotlight' );
								}
								?>
							>
							<?php esc_attr_e( $value, 'spotlight' ); ?>
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
			</table>
		</div>
		<div id="tab-style" class="spl-settings-form-page">This is style page</div>

		<?php submit_button(); ?>
	</form>
</div>
