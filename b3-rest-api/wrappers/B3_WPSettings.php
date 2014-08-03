<?php

class B3_WPSettings {

    /**
     * [get_options description]
     * @return [type] [description]
     */
    public function get_options () {
        return $this->options;
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
                return $this->get_routes();

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
                return get_option( $option );

            default:
                return get_bloginfo( $option );
        }
    }

    protected function prepare_route ( $route ) {
        // Rewrite tokens:
        $route = preg_replace( '/%([^%]+)%/', ":$1", $route );

        // Trim leading and trailing slashes:
        $route = preg_replace( '/^\/|\/$/', '', $route );

        return $route;
    }

    protected function add_route( &$routes, $route, $resource ) {
        $route          = $this->prepare_route( $route );
        $routes[$route] = $resource;
    }

    /**
     * [get_routes description]
     *
     * - root
     * - post
     * - page
     * - date
     * - category
     * - post_tag
     * - post_format
     * - author
     * - comments
     * - search
     *
     * @return [type] [description]
     */
    protected function get_routes () {
        global $wp_rewrite;

        $pagination_base = '/' . $wp_rewrite->pagination_base . '/:page';
        $comments_base   = '/' . $wp_rewrite->comments_base;
        $attachment_base = '/attachment/:attachment';

        $routes = array();

        $this->add_route( $routes, $wp_rewrite->front . '%post_id%'     , 'post' );
        $this->add_route( $routes, $wp_rewrite->front . '%postname%'    , 'post' );
        $this->add_route( $routes, $wp_rewrite->get_page_permastruct()  , 'page' );
        $this->add_route( $routes, $wp_rewrite->get_author_permastruct(), 'author' );
        $this->add_route( $routes, $wp_rewrite->get_date_permastruct()  , 'date' );
        $this->add_route( $routes, $wp_rewrite->get_month_permastruct() , 'date' );
        $this->add_route( $routes, $wp_rewrite->get_year_permastruct()  , 'date' );
        $this->add_route( $routes, $wp_rewrite->get_search_permastruct(), 'search' );

        // Public post types:

        $post_types = get_post_types( array( 'public' => true ) );

        foreach ($post_types as $post_type) {
            $route = $wp_rewrite->get_extra_permastruct( $post_type );

            if (empty( $route )) {
                $post_type = 'root';
            }

            if ($post_type !== 'attachment') {
                $this->add_route( $routes, $route                           , $post_type );
                $this->add_route( $routes, $route . $attachment_base        , 'attachment' );
                $this->add_route( $routes, $attachment_base . $comments_base, 'comments' );
            }
        }

        // Public taxonomies:

        $taxonomies = get_taxonomies( array( 'public' => true ) );

        foreach ($taxonomies as $taxonomy) {
            $route = $wp_rewrite->get_extra_permastruct( $taxonomy );
            $this->add_route( $routes, $route, $taxonomy );
        }

        // Extra routes:

        $extra = array();

        foreach ($routes as $route => $resource) {
            // Add pagination paths:
            $this->add_route( $extra, $route . $pagination_base, $resource );

            // Add comment and attachment routes for posts and pages:
            if ($resource === 'page' || $resource === 'post') {
                $this->add_route( $extra, $route . $comments_base, 'comments' );
                $this->add_route( $extra, $route . $comments_base . $pagination_base, 'comments' );

                $this->add_route( $extra, $route . $attachment_base, 'attachment' );
                $this->add_route( $extra, $route . $attachment_base . $pagination_base, 'attachment' );

                $this->add_route( $extra, $route . $attachment_base . $comments_base, 'comments' );
                $this->add_route( $extra, $route . $attachment_base . $comments_base . $pagination_base, 'comments' );
            }
        }

        $routes = array_merge( $extra, $routes );

        ksort( $routes );

        /**
         * Allows developers to alter the list of resource routes sent
         * to the client frontend.
         *
         * @param  array $routes Route list, with the route as the key
         *                       and the resource type as its value.
         *
         * @return array         Filtered route list.
         */
        return apply_filters( 'b3_routes', $routes );
    }

}
