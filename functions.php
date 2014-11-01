<?php
/**
 * B3 theme logic.
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class B3Theme {

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
	 * [$require description]
	 * @var string
	 */
	protected $require_uri = '';

	/**
	 * [$loader description]
	 * @var string
	 */
	protected $loader_uri = '';

	/**
	 * [__construct description]
	 */
	public function __construct() {
		$this->require_uri    = get_template_directory_uri() . '/lib/require.js';
		$this->loader_uri     = get_template_directory_uri() . '/dist/config/main.js';
		$this->stylesheet_uri = get_template_directory_uri() . '/dist/assets/styles/style.css';

		$this->setup();
	}

	/**
	 * [is_wp_api_active description]
	 * @return boolean [description]
	 */
	protected function is_wp_api_active() {
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
		if ( ! $this->is_wp_api_active() ) {
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

		add_filter( 'script_loader_src', array( $this, 'script_loader_src' ), 10, 2 );

		add_action( 'widgets_init'      , array( $this, 'setup_widgets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'setup_scripts' ), 9999, 0 );
		add_action( 'wp_head'           , array( $this, 'print_require_script' ), 20, 0 );
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

	/**
	 * Inject client application scripts.
	 *
	 * This action is called on `wp_enqueue_scripts` and injects required client
	 * application settings from the backend, such as:
	 *
	 * - `root`:  Theme root URI.
	 * - `url`:   RESTful WP API endpoint prefix.
	 * - `name`:  Site name.
	 * - `nonce`: Nonce string.
	 */
	public function setup_scripts() {
		if ( ! $this->is_wp_api_active() ) {
			return;
		}

		$site_url = parse_url( site_url() );
		$routes              = array();

		if ( class_exists( 'B3_RoutesHelper' ) ) {
			$routes_helper = new B3_RoutesHelper();
			$routes        = $routes_helper->get_routes();
		}

		$settings = array(
			'name'      => get_bloginfo( 'name' ),
			'api'       => home_url( json_get_url_prefix() ),
			'nonce'     => wp_create_nonce( 'wp_json' ),
			'api_url'   => home_url( json_get_url_prefix() ),
			'site_path' => (string) isset( $site_url['path'] ) ? $site_url['path'] : '',
			'root_url'  => get_stylesheet_directory_uri(),
			'site_url'  => site_url(),
			'routes'    => $routes,
			'scripts'	=> $this->require_scripts(),
			);

		wp_register_script( $this->slug . '-settings', 'settings.js', null, $this->version );
		wp_localize_script( $this->slug . '-settings', 'WP_API_SETTINGS', $settings );
		wp_enqueue_script( $this->slug . '-settings' );

		wp_enqueue_style( $this->slug . '-style', $this->stylesheet_uri, null, $this->version, 'screen' );
	}

	/**
	 * Prevents all scripts from being printed to HTML.
	 *
	 * Runs on `script_loader_src`.
	 *
	 * @param  string $src    Script URI.
	 * @param  string $handle Script registration handle.
	 * @return string         Always empty.
	 */
	public function script_loader_src( $src, $handle ) {
		return '';
	}

	/**
	 * Dequeue all scripts from WordPress and return them.
	 *
	 * @return array List of all dequeued scripts.
	 */
	protected function require_scripts() {
		global $wp_scripts;

		$scripts = array();

		// Update script dependencies:
		$wp_scripts->all_deps( $wp_scripts->queue );

		// Fetch enqueued and dependency scripts URIs:
		foreach ( $wp_scripts->to_do as $handle ) {
			$src = $wp_scripts->registered[ $handle ]->src;
			if ( ! empty( $src ) ) {
				$scripts[ $handle ] = $src;
			}
		}

		return $scripts;
	}

	/**
	 * Print our RequireJS loader to the document head.
	 *
	 * We couldn't find a way to print a `data-main` attribute when enqueuing
	 * the script so we're printing it directly.
	 */
	public function print_require_script() {
		if ( ! $this->is_wp_api_active() ) {
			return;
		}

		printf( '<script src="%s" data-main="%s"></script>',
			esc_attr( $this->require_uri ),
			esc_attr( $this->loader_uri ) );
	}

}

function B3() {
	global $GLOBALS;

	if ( ! isset( $GLOBALS['b3'] ) ) {
		$GLOBALS['b3'] = new B3Theme();
	}

	return $GLOBALS['b3'];
}

add_action( 'after_setup_theme', 'B3' );
