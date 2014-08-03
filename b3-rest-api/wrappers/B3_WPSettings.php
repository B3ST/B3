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

        $raw_routes = array(
            $wp_rewrite->front . '%post_id%'     => 'post',
            $wp_rewrite->front . '%postname%'    => 'post',
            $wp_rewrite->get_page_permastruct()   => 'page',
            $wp_rewrite->get_author_permastruct() => 'author',
            $wp_rewrite->get_date_permastruct()   => 'date',
            $wp_rewrite->get_month_permastruct()  => 'date',
            $wp_rewrite->get_year_permastruct()   => 'date',
            $wp_rewrite->get_search_permastruct() => 'search',
        );

        // Public post types:

        $post_types      = get_post_types( array( 'public' => true ) );
        $attachment_base = '/attachment/:attachment';
        $comments_base   = '/' . $wp_rewrite->comments_base;

        foreach ($post_types as $post_type) {
            $route = $wp_rewrite->get_extra_permastruct( $post_type );

            if (empty( $route )) {
                $route     = '/';
                $post_type = 'root';
            }

            if ($post_type !== 'attachment') {
                $raw_routes[$route]                                     = $post_type;
                $raw_routes[$route . $attachment_base]                  = 'attachment';
                $raw_routes[$route . $attachment_base . $comments_base] = 'comments';
            }
        }

        // Public taxonomies:

        $taxonomies = get_taxonomies( array( 'public' => true ) );

        foreach ($taxonomies as $taxonomy) {
            $route              = $wp_rewrite->get_extra_permastruct( $taxonomy );
            $raw_routes[$route] = $taxonomy;
        }

        // Cleanup:

        $routes = array();
        $page   = '/' . $wp_rewrite->pagination_base . '/:page';

        foreach ($raw_routes as $route => $resource) {
            // Rewrite tokens:
            $route = preg_replace( '/%([^%]+)%/', ":$1", $route );

            // Trim leading and trailing slashes:
            $route = preg_replace( '/^\/|\/$/', '', $route );

            $routes[$route]                     = $resource;
            $routes[$route . $page]             = $resource;
        }

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
