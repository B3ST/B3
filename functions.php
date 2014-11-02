<?php
/**
 * B3 theme logic.
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once 'inc/class-permalinks.php';
require_once 'inc/class-scripts.php';

class B3_Theme {

	/**
	 * Theme slug.
	 * @var [type]
	 */
	protected $slug = 'b3';

	/**
	 * [$version description]
	 * @var string
	 */
	protected $version = '0.1.0';

	/**
	 * [$permalinks description]
	 * @var [type]
	 */
	protected $permalinks;

	/**
	 * [__construct description]
	 */
	public function __construct( $slug ) {
		$this->slug           = $slug;
		$this->stylesheet_uri = get_template_directory_uri() . '/dist/assets/styles/style.css';

		$this->wp_api_check();

		$this->setup();
	}

	/**
	 * Obtain theme slug.
	 * @return string Theme slug.
	 */
	public function get_slug() {
		return $this->slug;
	}

	/**
	 * Obtain theme version.
	 * @return string Theme version.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Obtain permalinks instance.
	 *
	 * @return B3_Permalinks Permalinks instance.
	 */
	public function get_permalinks() {
		return $this->permalinks;
	}

	/**
	 * Set permalinks instance.
	 *
	 * @param B3_Permalinks $permalinks Permalinks instance.
	 */
	public function set_permalinks( $permalinks ) {
		$this->permalinks = $permalinks;
	}

	/**
	 * [is_wp_api_active description]
	 * @return boolean [description]
	 */
	public function is_wp_api_active() {
		return function_exists( 'json_get_url_prefix' );
	}

	/**
	 * Throws an error if the WP API is not available.
	 *
	 * Invokes `wp_die()` if the WP API is not active.
	 *
	 * @todo Provide information on how to activate WordPress API features and
	 *       enable pretty permalinks.
	 */
	public function wp_api_check() {
		if ( ! is_admin() && ! $this->is_wp_api_active() ) {
			wp_die( __( 'The WordPress API is unavailable. Please install and enable the WP API plugin to use this theme.', 'b3' ),
				__( 'Error: WP API Unavailable', 'b3' ) );
		}
	}

	/**
	 * [setup description]
	 */
	public function setup() {
		load_theme_textdomain( $this->slug, get_template_directory() . '/languages' );

		$this->setup_menus();

		add_theme_support( 'automatic-feed-links' );

		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		if ( ! is_admin() ) {
			// Prevent all scripts from being printed to HTML.
			add_filter( 'script_loader_src', '__return_false' );
		}

		add_action( 'widgets_init', array( $this, 'setup_widgets' ) );
	}

	protected function enqueue() {
		wp_enqueue_style( $this->get_slug() . '-style', $this->stylesheet_uri, null, $this->get_version(), 'screen' );
	}

	/**
	 * [register_menus description]
	 */
	protected function setup_menus() {
		register_nav_menus( array(
			'primary' => __( 'Primary Menu', 'b3' ),
		) );
	}

	/**
	 * [register_widgets description]
	 * @return [type] [description]
	 */
	public function setup_widgets() {
		register_sidebar( array(
			'name'          => __( 'Sidebar', 'b3' ),
			'id'            => 'sidebar',
			'description'   => 'Default sidebar.',
		) );

		register_sidebar( array(
			'name'          => __( 'Footer', 'b3' ),
			'id'            => 'footer',
			'description'   => 'Footer widget area.',
		) );

	}
}

function B3() {
	global $GLOBALS;

	if ( ! isset( $GLOBALS['b3'] ) ) {
		$b3 = new B3_Theme( 'b3' );

		$b3->set_permalinks( new B3_Permalinks( $b3 ) );
		$b3->set_scripts( new B3_Scripts( $b3 ) );

		$GLOBALS['b3'] = $b3;
	}

	return $GLOBALS['b3'];
}

add_action( 'after_setup_theme', 'B3' );
