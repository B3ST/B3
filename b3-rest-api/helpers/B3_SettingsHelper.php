<?php

class B3_SettingsHelper {

    /**
     * [get_options description]
     * @return [type] [description]
     */
    public function __construct () {

    }

    /**
     * Option getter.
     *
     * By default, options will take their value from WordPress's
     * `get_bloginfo()`.  Options specific to B3 are handled manually.
     *
     * @param  [type] $option [description]
     * @return [type]         [description]
     */
    public function __get( $option ) {
        switch ($option) {
            case 'api_url':
                return home_url( json_get_url_prefix() );

            case 'root_url':
                return get_stylesheet_directory_uri();

            case 'routes':
                $routes = new B3_RoutesHelper();
                return $routes->get_routes();

            case 'site_url':
                return get_bloginfo( 'url' );

            case 'site_path':
                $site_url_components = parse_url( site_url() );
                return (string) $site_url_components['path'];

            case 'wp_url':
                return get_bloginfo( 'wpurl' );

            case 'show_on_front':
            case 'page_on_front':
            case 'page_for_posts':
                return (int) get_option( $option );

            default:
                return get_bloginfo( $option );
        }
    }

}
