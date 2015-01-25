<?php
/**
 * B3 theme logic.
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once 'inc/class-http.php';
require_once 'inc/class-theme.php';
require_once 'inc/class-permalinks.php';
require_once 'inc/class-scripts.php';
require_once 'inc/class-heartbeat.php';

/**
 * WordPress initialization.
 */
function b3_init() {
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		$http = new B3_HTTP();
		add_filter( 'wp_headers', array( $http, 'send_headers_cors' ), 11, 1 );
	}
}

add_action( 'init', 'b3_init' );

/**
 * Theme initialization.
 */
function b3_setup_theme() {
	// Setup theme:
	$b3 = new B3_Theme( 'b3', '0.1.0' );
	$b3->wp_api_check();
	$b3->setup();
	$b3->set_permalinks( new B3_Permalinks( $b3 ) );
	$b3->set_scripts( new B3_Scripts( $b3 ) );
}

add_action( 'after_setup_theme', 'b3_setup_theme' );
