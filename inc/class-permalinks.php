<?php

/**
 * Permalink features.
 */
class B3_Permalinks {

	/**
	 * Theme instance.
	 * @var B3_Theme
	 */
	protected $theme;

	/**
	 * Constructor.
	 *
	 * @param B3_Theme $theme B3 theme instance.
	 */
	function __construct( B3_Theme $theme ) {
		$this->theme = $theme;

		add_action( 'template_redirect', array( $this, 'redirect_search' ) );
	}

	/**
	 * Redirects to a nicer search permalink.
	 *
	 * Redirects query string based search URIs (`s=<query>`) to a permalink
	 * based URI (`/search/<query>`). Additional query string arguments are
	 * preserved.
	 */
	public function redirect_search() {
		global $wp_rewrite;

		if ( ! get_option( 'permalink_structure' ) || ! is_search() || is_admin() ) {
			return;
		}

		$search_base = $wp_rewrite->search_base;

		if ( strpos( $_SERVER['REQUEST_URI'], "/{$search_base}/" ) !== false ) {
			return;
		}

		$qs = array();
		parse_str( $_SERVER['QUERY_STRING'], $qs );
		unset( $qs['s'] );

		$s     = urlencode( get_query_var( 's' ) );
		$query = empty( $qs ) ? '' : sprintf( '?%s', http_build_query( $qs ) );
		$url   = home_url( sprintf( '/%s/%s%s', $search_base, $s, $query ) );

		wp_redirect( $url );
		exit;
	}

}
