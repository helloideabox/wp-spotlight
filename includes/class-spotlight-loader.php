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

		// Action to handle the ajax response.
		add_action( 'wp_ajax_handle_submit', array( $this, 'handle_form_submit' ) );
		add_action( 'wp_ajax_nopriv_handle_submit', array( $this, 'handle_form_submit' ) );
	}

	/**
	 * For registering script and stylesheet.
	 */
	public function register_script() {

		// Enqueueing build script and styles.
		wp_enqueue_style( 'spl-react-style', SPOTLIGHT_URL . 'build/admin.css', array( 'wp-components' ), SPOTLIGHT_VERSION, false );
		wp_enqueue_script( 'spl-react-script', SPOTLIGHT_URL . 'build/admin.js', array( 'wp-components', 'wp-element', 'wp-api', 'wp-i18n' ), SPOTLIGHT_VERSION, true );
		wp_localize_script( 'spl-react-script', 'siteName', get_site_url() );
	}

	/**
	 * For registering script and stylesheet for spotlight admin setting page.
	 *
	 * @param string $hook To check the current page.
	 */
	public function register_admin_script( $hook ) {

		if ( 'toplevel_page_spotlight' === $hook ) {
			wp_enqueue_style( 'spl-style', SPOTLIGHT_URL . 'assets/style.css', array(), SPOTLIGHT_VERSION, false );
			wp_enqueue_script( 'spl-script', SPOTLIGHT_URL . 'assets/script.js', array(), SPOTLIGHT_VERSION, true );
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

		$args = array(
			'post_type'     => $request['post_types'],
			'post_status'   => 'publish',
			'post_per_page' => -1,
		);

		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) :
				$query->the_post();

				$post_type_data[] = array(
					'title'     => get_the_title(),
					'excerpt'   => substr( get_the_excerpt(), 0, 300 ),  // custom excerpt length.
					'content'   => get_the_content(),
					'permalink' => get_permalink(),
				);
			endwhile;
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
	}



	/**
	 * Handling form submit.
	 *
	 * @return void
	 */
	public function handle_form_submit() {
		// Checking for correct ajax request.
		$query = array();
		if ( check_ajax_referer( 'ajax_nonce', 'security' ) ) {
			if ( isset( $_POST['spl_cpt_support'] ) ) {
				// Sanitizing array values.
				$query = array_map( 'sanitize_text_field', wp_unslash( $_POST['spl_cpt_support'] ) );
			}
		}

		$status = update_option( 'spl_post_types', $query );
		print_r( $status );

		wp_die();
	}
}

$spotlight = new Spotlight_Loader();
