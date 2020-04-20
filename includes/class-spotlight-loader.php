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

		// Load frontend.
		add_action( 'wp_footer', array( $this, 'load_view' ) );

		// The following registers an api route with custom parameters.
		add_action( 'rest_api_init', array( $this, 'add_custom_post_types_api' ) );
	}

	/**
	 * For registering script and stylesheet.
	 */
	public function register_script() {

		wp_enqueue_style( 'sp-style', SPOTLIGHT_URL . 'assets/style.css', array(), SPOTLIGHT_VERSION, false );

		// Enqueueing build script and styles.
		wp_enqueue_style( 'spl-react-style', SPOTLIGHT_URL . 'build/admin.css', array( 'wp-components' ), SPOTLIGHT_VERSION, false );
		wp_enqueue_script( 'spl-react-script', SPOTLIGHT_URL . 'build/admin.js', array( 'wp-components', 'wp-element', 'wp-api', 'wp-i18n' ), SPOTLIGHT_VERSION, true );

		wp_localize_script( 'spl-react-script', 'siteName', get_site_url() );
	}

	/**
	 * For registering custo route.
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
						'default'           => array( 'post' ),
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

		while ( $query->have_posts() ) :
			$query->the_post();

			$post_type_data[] = array(
				'title'     => get_the_title(),
				'excerpt'   => substr( get_the_excerpt(), 0, 300 ),  // custom excerpt length.
				'content'   => get_the_content(),
				'permalink' => get_permalink(),
			);
		endwhile;

		return $post_type_data;
	}



	/**
	 * For loading the view in WordPress footer section.
	 */
	public function load_view() {
		echo '<div id="spl-root"></div>';
	}

}

$spotlight = new Spotlight_Loader();
