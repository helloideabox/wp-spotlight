<?php
/**
 * Plugin Name: Spotlight
 * Plugin URI: https://ideabox.io/
 * Author: IdeaBox
 * Author URI: https://ideabox.io
 * Version: 1.0.0
 * Description:
 * Text Domain: spotlight
 *
 * @package WordPress
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SPOTLIGHT_PATH', plugin_dir_path( __FILE__ ) );
define( 'SPOTLIGHT_URL', plugin_dir_url( __FILE__ ) );
define( 'SPOTLIGHT_VERSION', '1.0.0' );

require_once 'includes/class-spotlight-loader.php';
