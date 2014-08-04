<?php

define( 'B3_EP_NONE'      , 0 );
define( 'B3_EP_PAGE'      , 1 );
define( 'B3_EP_ATTACHMENT', 2 );
define( 'B3_EP_COMMENTS'  , 4 );
define( 'B3_EP_ALL'       , B3_EP_PAGE | B3_EP_ATTACHMENT | B3_EP_COMMENTS );

class B3_WPSettings {

    /**
     * [$route_pagination_base description]
     * @var string
     */
    protected $route_pagination_base = '';

    /**
     * [$route_comments_base description]
     * @var string
     */
    protected $route_comments_base   = '';

    /**
     * [$route_attachment_base description]
     * @var string
     */
    protected $route_attachment_base = '';

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
     * [prepare_route description]
     * @param  [type] $route [description]
     * @return [type]        [description]
     */
    protected function prepare_route ( $route ) {
        // Rewrite tokens:
        $route = preg_replace( '/%([^%]+)%/', ":$1", $route );

        // Trim leading and trailing slashes:
        $route = preg_replace( '/^\/|\/$/', '', $route );

        return $route;
    }

    /**
     * [add_route description]
     * @param array  $routes   New routes will be added to this array.
     * @param string $route    New base route to add.
     * @param string $resource Resource for the route.
     * @param int    $mask     Extra endpoints mask (default B3_EP_NONE)
     *                         - B3_EP_NONE
     *                         - B3_EP_PAGE
     *                         - B3_EP_ATTACHMENT
     *                         - B3_EP_COMMENTS
     *                         - B3_EP_ALL
     */
    protected function add_route( &$routes, $route, $resource, $mask = B3_EP_NONE ) {
        $route         = $this->prepare_route( $route );

        $added         = array();
        $added[$route] = $resource;

        if (B3_EP_ATTACHMENT & $mask) {
            $attachment_route = $this->prepare_route( $route . $this->route_attachment_base );
            $added[$attachment_route] = array( 'object' => 'post', 'type' => 'attachment' );
        }

        $comments = array();

        foreach ($added as $route => $resource) {
            if ((B3_EP_COMMENTS & $mask) || ($resource['type'] === 'attachment')) {
                $comments_route = $this->prepare_route( $route . $this->route_comments_base );
                $comments[$comments_route] = array( 'object' => 'comments', 'type' => 'comments' );
            }
        }

        $added = array_merge( $added, $comments );

        if (B3_EP_PAGE & $mask) {
            $pages = array();
            foreach ($added as $route => $resource) {
                if ($resource['type'] === 'attachment') {
                    continue;
                }
                $paging_route = $this->prepare_route( $route . $this->route_pagination_base );
                $pages[$paging_route] = $resource;
            }
            $added = array_merge( $added, $pages );
        }

        $routes = array_merge( $routes, $added );
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

        $this->route_comments_base   = '/' . $wp_rewrite->comments_base;
        $this->route_pagination_base = '/' . $wp_rewrite->pagination_base . '/:page';
        $this->route_attachment_base = '/attachment/:attachment';

        $routes = array();

        $resource_post   = array( 'object' => 'post'   , 'type' => 'post' );
        $resource_page   = array( 'object' => 'post'   , 'type' => 'page' );
        $resource_author = array( 'object' => 'author' , 'type' => 'author' );
        $resource_date   = array( 'object' => 'extra', 'type' => 'date' );
        $resource_search = array( 'object' => 'extra', 'type' => 'search' );

        $this->add_route( $routes, $wp_rewrite->front . '%post_id%'     , $resource_post  , B3_EP_ALL );
        $this->add_route( $routes, $wp_rewrite->front . '%postname%'    , $resource_post  , B3_EP_ALL );
        $this->add_route( $routes, $wp_rewrite->get_page_permastruct()  , $resource_page  , B3_EP_ALL );
        $this->add_route( $routes, $wp_rewrite->get_author_permastruct(), $resource_author, B3_EP_PAGE );
        $this->add_route( $routes, $wp_rewrite->get_date_permastruct()  , $resource_date  , B3_EP_PAGE );
        $this->add_route( $routes, $wp_rewrite->get_month_permastruct() , $resource_date  , B3_EP_PAGE );
        $this->add_route( $routes, $wp_rewrite->get_year_permastruct()  , $resource_date  , B3_EP_PAGE );
        $this->add_route( $routes, $wp_rewrite->get_search_permastruct(), $resource_search, B3_EP_PAGE );

        // Public post types:

        $post_types = get_post_types( array( 'public' => true ) );

        foreach ($post_types as $post_type) {
            $route    = $wp_rewrite->get_extra_permastruct( $post_type );
            $resource = array( 'object' => 'post', 'type' => $post_type );
            $mask     = B3_EP_ALL;

            if (empty( $route )) {
                $post_type = 'root';
                $resource = array( 'object' => 'extra', 'type' => $post_type );
                $mask      = B3_EP_PAGE | B3_EP_ATTACHMENT;
            }

            if ($post_type !== 'attachment') {
                $this->add_route( $routes, $route, $resource, $mask );
            }
        }

        // Public taxonomies:

        $taxonomies = get_taxonomies( array( 'public' => true ) );

        foreach ($taxonomies as $taxonomy) {
            $route = $wp_rewrite->get_extra_permastruct( $taxonomy );
            $resource = array( 'object' => 'taxonomy', 'type' => $taxonomy );
            $this->add_route( $routes, $route, $resource, B3_EP_PAGE );
        }

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
