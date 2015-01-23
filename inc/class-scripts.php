<?php
/**
 * Script dependency utilities.
 */

/**
 * Script dependency class.
 */
class B3_Scripts {

	/**
	 * [$script_replacements description]
	 * @var array
	 */
	protected $script_replacements = array(
		'wp.script.jquery-core' => '',
		'wp.script.backbone'    => '',
	);

	/**
	 * Theme instance.
	 * @var B3_Theme
	 */
	protected $theme;

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
	 * Enqueued WordPress scripts.
	 * @var array
	 */
	protected $scripts;

	/**
	 * Constructor.
	 *
	 * @param B3_Theme $theme B3 theme instance.
	 */
	function __construct( B3_Theme $theme ) {
		$this->theme       = $theme;
		$this->require_uri = get_template_directory_uri() . '/lib/require.js';
		$this->loader_uri  = get_template_directory_uri() . '/dist/main.js';
		$this->scripts     = array();

		if ( ! is_admin() ) {
			// Prevent all scripts from being printed to HTML.
			add_filter( 'script_loader_src', '__return_false' );
		}

		add_action( 'wp_enqueue_scripts', array( $this, 'setup' ), 999, 0 );
		add_action( 'wp_head'           , array( $this, 'print_loader' ), 20, 0 );
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
	 *
	 * @todo Find a way to enqueue JS data without having to register a script URI.
	 */
	public function setup() {
		$site_url = parse_url( site_url() );
		$routes   = array();

		if ( class_exists( 'B3_RoutesHelper' ) ) {
			$routes_helper = new B3_RoutesHelper();
			$routes        = $routes_helper->get_routes();
		}

		if ( current_theme_supports( 'live-updates' ) ) {
			wp_enqueue_script( 'heartbeat' );
		}

		$this->require_scripts();

		$settings = array(
			'name'      => get_bloginfo( 'name' ),
			'api'       => home_url( json_get_url_prefix() ),
			'nonce'     => wp_create_nonce( 'wp_json' ),
			'api_url'   => home_url( json_get_url_prefix() ),
			'site_path' => (string) isset( $site_url['path'] ) ? $site_url['path'] : '',
			'root_url'  => get_stylesheet_directory_uri(),
			'site_url'  => site_url(),
			'routes'    => $routes,
			'scripts'   => $this->scripts,
			);

		wp_register_script( $this->theme->get_slug() . '-settings', 'settings.js', null, $this->theme->get_version() );
		wp_localize_script( $this->theme->get_slug() . '-settings', 'WP_API_SETTINGS', $settings );
		wp_enqueue_script( $this->theme->get_slug() . '-settings' );
	}

	/**
	 * Dequeue all scripts from WordPress and return them.
	 *
	 * @return array List of all dequeued scripts.
	 */
	protected function require_scripts() {
		global $wp_scripts;

		// Prefix handles to minimize conflicts when requiring scripts:
		$handle_prefix = 'wp.script.';

		// Update script dependencies:
		$wp_scripts->all_deps( $wp_scripts->queue );

		// Fetch enqueued and dependency script URIs:
		foreach ( $wp_scripts->to_do as $handle ) {
			$src    = $wp_scripts->registered[ $handle ]->src;
			$deps   = (array) $wp_scripts->registered[ $handle ]->deps;
			$handle = $handle_prefix . $handle;

			// RequireJS: The path that is used should NOT include an extension.
			$src  = preg_replace( '/(\.min)?\.js$/i', '', $src );

			// Prepend prefix to each dependency handle:
			foreach ( $deps as $index => $dep ) {
				$deps[ $index ] = $handle_prefix . $dep;
			}

			$this->scripts[ $handle ] = array(
				'src'  => $src,
				'deps' => $deps,
			);
		}

		$this->cleanup_dependencies();
	}

	/**
	 * Print our RequireJS loader to the document head.
	 *
	 * We couldn't find a way to print a `data-main` attribute when enqueuing
	 * the script so we're printing it directly.
	 */
	public function print_loader() {
		printf( '<script src="%s" data-main="%s"></script>',
			esc_attr( $this->require_uri ),
			esc_attr( $this->loader_uri ) );
	}

	/**
	 * Clean up script dependencies para removing invalid entries.
	 *
	 * Pseudo-dependencies such as WordPress uses to aggregate further
	 * dependencies will be removed and it's child nodes hoisted.
	 *
	 * Please note that this method will not check whether a file exists or is
	 * accessible.
	 *
	 * @todo Unmet dependencies should be removed to minimize loading errors.
	 */
	protected function cleanup_dependencies() {
		foreach ( $this->scripts as $handle => &$script ) {
			if ( isset( $this->script_replacements[ $handle ] ) ) {
				$script['src'] = $this->script_replacements[ $handle ];
			}

			if ( empty( $script['src'] ) ) {
				$this->replace_dependency( $handle, $script['deps'] );
				unset( $this->scripts[ $handle ] );
			}
		}
	}

	/**
	 * Replaces a dependency with a list of different dependencies.
	 *
	 * @param  string $replace     Dependency to replace.
	 * @param  array  $replacement Replacement dependencies (empty by default).
	 */
	protected function replace_dependency( $replace, $replacement = array() ) {
		foreach ( $this->scripts as $handle => $script ) {
			$offset = array_search( $replace, $script['deps'] );
			if ( $offset !== false ) {
				array_splice( $this->scripts[ $handle ]['deps'], $offset, 1, $replacement );
			}
		}
	}

}
