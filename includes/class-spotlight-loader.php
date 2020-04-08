<?php
/**
 * Responsible for setting up constants, classes and templates.
 *
 * @author  IdeaBox
 * @package Elementor Widget Manager/Loader
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
	}

	/**
	 * For registering script and stylesheet.
	 */
	public function register_script() {

		wp_enqueue_style( 'sp-style', SPOTLIGHT_URL . 'assets/style.css', array(), SPOTLIGHT_VERSION, false );

		// Enqueueing build script and styles.
		wp_enqueue_style( 'spl-react-style', SPOTLIGHT_URL . 'build/admin.css', array( 'wp-components' ), SPOTLIGHT_VERSION, false );
		wp_enqueue_script( 'spl-react-script', SPOTLIGHT_URL . 'build/admin.js', array( 'wp-components', 'wp-element', 'wp-api', 'wp-i18n' ), SPOTLIGHT_VERSION, true );
	}

	/**
	 * For loading the view in WordPress footer section.
	 */
	public function load_view() {
		echo '<div id="spl-root"></div>';
	}

}

$spotlight = new Spotlight_Loader();
