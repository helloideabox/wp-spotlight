<?php
/**
 * Responsible for setting up constants, classes and templates.
 *
 * @author  IdeaBox
 * @package Spotlight/Loader
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * All function loads from this class Widget_Manager_Loader.
 */
class  Spotlight_Loader {

	/**
	 * For automatically loading action and filters.
	 */
	public function __construct() {

		// Enqueue style and script for frontend.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_script' ) );

		// Enqueue admin script for settings page.
		add_action( 'admin_enqueue_scripts', array( $this, 'register_admin_script' ) );

		// Load frontend.
		add_action( 'wp_footer', array( $this, 'load_view' ) );

		// The following registers an api route with custom parameters.
		add_action( 'rest_api_init', array( $this, 'add_custom_post_types_api' ) );

		add_action( 'admin_menu', array( $this, 'register_spotlight_settings' ) );

		// Action to register setting for get_option function.
		add_action( 'init', array( $this, 'register_plugin_settings' ) );

		// Action to handle the ajax for admin page response.
		add_action( 'wp_ajax_handle_submit', array( $this, 'handle_form_submit' ) );
		add_action( 'wp_ajax_nopriv_handle_submit', array( $this, 'handle_form_submit' ) );

		// Action to handle the ajax for frontend response.
		add_action( 'wp_ajax_handle_ask', array( $this, 'handle_form_ask' ) );
		add_action( 'wp_ajax_nopriv_handle_ask', array( $this, 'handle_form_ask' ) );
	}

	/**
	 * For registering script and stylesheet.
	 */
	public function register_script() {

		// Enqueueing build script and styles.
		wp_enqueue_style( 'spl-react-style', SPOTLIGHT_URL . 'build/admin.css', array( 'wp-components' ), SPOTLIGHT_VERSION, false );
		wp_enqueue_script( 'spl-react-script', SPOTLIGHT_URL . 'build/admin.js', array( 'wp-components', 'wp-element', 'wp-api', 'wp-i18n' ), SPOTLIGHT_VERSION, true );
		wp_localize_script(
			'spl-react-script',
			'ajax',
			array(
				'siteName' => get_site_url(),
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'ajax_nonce' ),
			)
		);
	}

	/**
	 * For registering script and stylesheet for spotlight admin setting page.
	 *
	 * @param string $hook To check the current page.
	 */
	public function register_admin_script( $hook ) {

		if ( 'toplevel_page_spotlight' === $hook ) {

			// For wp color picker.
			wp_enqueue_style( 'wp-color-picker' );
			wp_enqueue_style( 'spl-style', SPOTLIGHT_URL . 'assets/style.css', array(), SPOTLIGHT_VERSION, false );
			wp_enqueue_script( 'spl-script', SPOTLIGHT_URL . 'assets/script.js', array( 'wp-color-picker' ), SPOTLIGHT_VERSION, true );
			wp_localize_script(
				'spl-script',
				'settings',
				array(
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'nonce'    => wp_create_nonce( 'ajax_nonce' ),
				)
			);
		}
	}


	/**
	 * For registering custom route.
	 */
	public function add_custom_post_types_api() {
		register_rest_route(
			'spotlight/v1',  // Namespace.
			'/posts',   // Route.
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_post_type_data' ),
				'args'     => array(
					'post_types' => array(
						'description'       => __( 'Differnt types of post types for wp query', 'spotlight' ),
						'type'              => 'array',
						'default'           => array(),
						'required'          => 'false',
						'sanitize_callback' => 'wp_unslash',
					),
				),
			)
		);
	}

	/**
	 * To get the post_type data.
	 *
	 * @param array $request list of post types.
	 */
	public function get_post_type_data( $request ) {

		$post_type_data = array();

		// Checking for any post type selected in settings.
		if ( ! empty( $request['post_types'] ) ) {
			$args = array(
				'post_type'      => $request['post_types'],
				'post_status'    => 'publish',
				'posts_per_page' => get_option( 'spl_number_of_posts' ),
			);

			$query = new WP_Query( $args );

			if ( $query->have_posts() ) {
				while ( $query->have_posts() ) :
					$query->the_post();

					$post_type_data[] = array(
						'id'        => get_the_ID(),
						'title'     => get_the_title(),
						'excerpt'   => substr( get_the_excerpt(), 0, 250 ),  // custom excerpt length.
						'content'   => get_the_content(),
						'permalink' => get_permalink(),
					);
				endwhile;
			}
		}

		return $post_type_data;
	}


	/**
	 * Registering spotlight manager.
	 *
	 * @return void
	 */
	public function register_spotlight_settings() {
		// Adding menu to spotlight.
		add_menu_page(
			__( 'Spotlight', 'spotlight' ), // Page title.
			__( 'Spotlight', 'spotlight' ), // Menu title.
			'manage_options', // Capability.
			'spotlight', // Menu slug.
			array( $this, 'render_spotlight_settings_page' ), // Callback function.
			'', // Url.
			26 // Position of page in admin bar.
		);
	}

	/**
	 * Renders spotlight settings page.
	 *
	 * @return void
	 */
	public function render_spotlight_settings_page() {
		require_once SPOTLIGHT_PATH . './template/settings.php';
	}


	/**
	 * For loading the view in WordPress footer section.
	 */
	public function load_view() {
		echo '<div id="spl-root"></div>';
	}


	/**
	 * Registering widget settings in rest-api.
	 *
	 * @return void
	 */
	public function register_plugin_settings() {
		register_setting(
			'spl-settings-group',
			'spl_post_types',
			array(
				'show_in_rest' => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'string',
						),
					),
				),
				'default'      => array( 'post' ),
			)
		);

		register_setting(
			'spl-settings-group',
			'spl_enable_search_box',
			array(
				'type'         => 'boolean',
				'show_in_rest' => true,
				'default'      => true,
			)
		);

		register_setting(
			'spl-settings-group',
			'spl_enable_contact_tab',
			array(
				'type'         => 'boolean',
				'show_in_rest' => true,
				'default'      => true,
			)
		);

		register_setting(
			'spl-settings-group',
			'spl_number_of_posts',
			array(
				'type'         => 'integer',
				'show_in_rest' => true,
				'default'      => 10,
			)
		);

		register_setting(
			'spl-settings-group',
			'spl_font_family',
			array(
				'type'         => 'string',
				'show_in_rest' => true,
				'default'      => '',
			)
		);

		register_setting(
			'spl-settings-group',
			'spl_post_heading_size',
			array(
				'type'         => 'integer',
				'show_in_rest' => true,
				'default'      => 13,
			)
		);

		register_setting(
			'spl-settings-group',
			'spl_upload_image_url',
			array(
				'type'         => 'string',
				'show_in_rest' => true,
				'default'      => '',
			)
		);

		register_setting(
			'spl-settings-group',
			'spl_primary_color',
			array(
				'type'         => 'string',
				'show_in_rest' => true,
				'default'      => '#fc5d7d',
			)
		);
	}



	/**
	 * Handling form submit.
	 *
	 * @return void
	 */
	public function handle_form_submit() {

		// Checking for correct ajax request.
		$query              = array();
		$enable_search_box  = 0;
		$enable_contact_tab = 0;
		$number_of_posts    = 10;
		$font_family        = '';
		$post_heading_size  = 13;
		$upload_image_url   = '';
		$upload_image_name  = '';
		$primary_color      = '#fc5d7d';
		$from_email         = '';
		$from_name          = '';
		$send_email         = '';

		if ( check_ajax_referer( 'ajax_nonce', 'security' ) ) {
			if ( isset( $_POST['spl_cpt_support'] ) ) {
				// Sanitizing array values.
				$query = array_map( 'sanitize_text_field', wp_unslash( $_POST['spl_cpt_support'] ) );
			}

			if ( isset( $_POST['spl_enable_search_box'] ) ) {

				$enable_search_box = sanitize_text_field( wp_unslash( $_POST['spl_enable_search_box'] ) );
			}

			if ( isset( $_POST['spl_enable_contact_tab'] ) ) {

				$enable_contact_tab = sanitize_text_field( wp_unslash( $_POST['spl_enable_contact_tab'] ) );
			}

			if ( isset( $_POST['spl_number_of_posts'] ) ) {

				$number_of_posts = sanitize_text_field( wp_unslash( $_POST['spl_number_of_posts'] ) );
			}

			if ( isset( $_POST['spl_font_family'] ) ) {

				$font_family = sanitize_text_field( wp_unslash( $_POST['spl_font_family'] ) );
			}

			if ( isset( $_POST['spl_post_heading_size'] ) ) {

				$post_heading_size = sanitize_text_field( wp_unslash( $_POST['spl_post_heading_size'] ) );
			}

			if ( isset( $_POST['spl_upload_image_url'] ) ) {

				$upload_image_url = sanitize_text_field( wp_unslash( $_POST['spl_upload_image_url'] ) );
			}

			if ( isset( $_POST['spl_upload_image_name'] ) ) {

				$upload_image_name = sanitize_text_field( wp_unslash( $_POST['spl_upload_image_name'] ) );
			}

			if ( isset( $_POST['spl_primary_color'] ) ) {

				$primary_color = sanitize_text_field( wp_unslash( $_POST['spl_primary_color'] ) );
			}

			if ( isset( $_POST['spl_from_email'] ) ) {

				$from_email = sanitize_text_field( wp_unslash( $_POST['spl_from_email'] ) );
			}

			if ( isset( $_POST['spl_from_name'] ) ) {

				$from_name = sanitize_text_field( wp_unslash( $_POST['spl_from_name'] ) );
			}

			if ( isset( $_POST['spl_send_email'] ) ) {

				$send_email = sanitize_text_field( wp_unslash( $_POST['spl_send_email'] ) );
			}
		}

		update_option( 'spl_post_types', $query );
		update_option( 'spl_enable_search_box', $enable_search_box );
		update_option( 'spl_enable_contact_tab', $enable_contact_tab );
		update_option( 'spl_number_of_posts', $number_of_posts );
		update_option( 'spl_font_family', $font_family );
		update_option( 'spl_post_heading_size', $post_heading_size );
		update_option( 'spl_upload_image_url', $upload_image_url );
		update_option( 'spl_upload_image_name', $upload_image_name );
		update_option( 'spl_primary_color', $primary_color );
		update_option( 'spl_from_email', $from_email );
		update_option( 'spl_from_name', $from_name );
		update_option( 'spl_send_email', $send_email );

		echo 'success';

		wp_die();
	}


	/**
	 * Handling form submit.
	 *
	 * @return void
	 */
	public function handle_form_ask() {

		// Checking for ajax nonce.
		if ( check_ajax_referer( 'ajax_nonce', 'security' ) ) {

			// Checking for file type object.
			if ( isset( $_FILES['files'] ) ) {
				$file = $_FILES['files'];

				// array of variables of multiple uploaded file.
				$file_names  = $file['name'];
				$file_errors = $file['error'];
				$file_tmps   = $file['tmp_name'];

				// Taking file extension for comparing.
				foreach ( $file_names as $file_name ) {
					$file_exts    = explode( '.', $file_name );
					$file_check[] = strtolower( end( $file_exts ) );
				}

				// Extension to be compared with.
				$file_ext_stored = array( 'png', 'jpg', 'jpeg' );

				// Getting path for uploads directory for WordPress.
				$upload_dir = wp_upload_dir();

				// Looping through each file uploaded and moving to destination folder.
				foreach ( $file_names as $index => $value ) {

					// Checking if the directory exits or not.
					if ( in_array( $file_check[ $index ], $file_ext_stored, true ) ) {
						if ( ! is_dir( $upload_dir['basedir'] . '/spotlight' ) ) {
							mkdir( $upload_dir['basedir'] . '/spotlight' );
						}

						// Moving uploaded file from tmp to destination folder.
						$destination_file = $upload_dir['basedir'] . '/spotlight/' . $file_names[ $index ];
						move_uploaded_file( $file_tmps[ $index ], $destination_file );
					}
				}
			}

			$name  = '';
			$email = '';
			$query = '';

			if ( isset( $_POST['name'] ) ) {
				$name = sanitize_text_field( wp_unslash( $_POST['name'] ) );
			}

			if ( isset( $_POST['email'] ) ) {
				$email = sanitize_text_field( wp_unslash( $_POST['email'] ) );
			}

			if ( isset( $_POST['query'] ) ) {
				$query = sanitize_text_field( wp_unslash( $_POST['query'] ) );
			}

			$to      = get_option( 'spl_send_email' );
			$subject = 'Queries or Suggestion Regarding Spotlight';
			$headers = array(
				'From: ' . get_option( 'spl_from_name' ) . ' <' . get_option( 'spl_from_email' ) . '>',
				'Reply-To: ' . $name . ' <' . $email . '>',
			);

			if ( wp_mail( $to, $subject, $query, $headers ) ) {
				echo 'success';
			} else {
				echo 'failed';
			}
		}

		wp_die();
	}
}

$spotlight = new Spotlight_Loader();
