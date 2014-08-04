<?php

define( 'B3_EP_NONE'      , 0 );
define( 'B3_EP_PAGE'      , 1 );
define( 'B3_EP_ATTACHMENT', 2 );
define( 'B3_EP_COMMENTS'  , 4 );
define( 'B3_EP_ALL'       , B3_EP_PAGE | B3_EP_ATTACHMENT | B3_EP_COMMENTS );

/**
 * Prepares WordPress rewrite rules for presentation.
 */
class B3_RoutesHelper {

    /**
     * WordPress routes.
     * @var array
     */
    protected $routes = array();

    /**
     * Pagination route fragment.
     * @var string
     */
    protected $pagination_base = '';

    /**
     * Comments route fragment.
     * @var string
     */
    protected $comments_base   = '';

    /**
     * Attachment route fragment.
     * @var string
     */
    protected $attachment_base = '';

    /**
     * Creates a new WP rewrite rules helper.
     */
    public function __construct () {
        global $wp_rewrite;

        $this->pagination_base = '(/' . $wp_rewrite->pagination_base . '/:page)';
        $this->comments_base   = '/' . $wp_rewrite->comments_base;
        $this->attachment_base = '/attachment/:attachment';

        $this->add_root_routes();
        $this->add_post_routes();
        $this->add_page_routes();
        $this->add_author_routes();
        $this->add_date_routes();
        $this->add_search_routes();
        $this->add_post_type_routes();
        $this->add_taxonomy_routes();

        $this->unfold_tokens();

        ksort( $this->routes );
    }

    /**
     * Returns the routes array.
     *
     * This method applies the `b3_routes` filter.
     *
     * @return array WordPress routes.
     */
    public function get_routes () {
        /**
         * Allows developers to alter the list of resource routes sent
         * to the client frontend.
         *
         * @param  array $routes Route list, with the route as the key
         *                       and the resource type as its value.
         *
         * @return array         Filtered route list.
         */
        return apply_filters( 'b3_routes', $this->routes );
    }

    /**
     * Format a single route string.
     *
     * Rewrites tokens and removes leading and trailing slashes.
     *
     * @param  string $route Permastruct obtained from WordPress.
     * @return string        Formatted route.
     */
    protected function prepare_route ( $route ) {
        // Rewrite tokens:
        $route = preg_replace( '/%([^%]+)%/', ":$1", $route );

        // Trim leading and trailing slashes:
        $route = preg_replace( '#^/|/$#', '', $route );

        return $route;
    }

    /**
     * Add a set of routes for a provided resource.
     *
     * Depending on the mask set in `$mask`, page, comment and
     * attachment routes are added for the provided resource endpoint.
     *
     * @param string $route    New base route to add.
     * @param string $resource Resource for the route.
     * @param int    $mask     Extra endpoints mask (default B3_EP_NONE)
     *                         - B3_EP_NONE
     *                         - B3_EP_PAGE
     *                         - B3_EP_ATTACHMENT
     *                         - B3_EP_COMMENTS
     *                         - B3_EP_ALL
     */
    protected function add_routes ( $route, $resource, $mask = B3_EP_NONE ) {
        $routes = array();
        $route  = $this->prepare_route( $route );

        $attachment_route = '';
        $resource_route   = $this->prepare_route( $route . $this->pagination_base );

        $routes[$resource_route] = $resource;

        if (B3_EP_ATTACHMENT & $mask) {
            $attachment_route = $this->prepare_route( $route . $this->attachment_base );
            $routes[$attachment_route] = array( 'object' => 'post', 'type' => 'attachment' );
        }

        if (B3_EP_COMMENTS & $mask) {
            $comments_resource = array( 'object' => 'comments', 'type' => $resource['type'] );
            $comments_route = $this->prepare_route( $route . $this->comments_base . $this->pagination_base );
            $routes[$comments_route] = $comments_resource;

            if ($attachment_route) {
                $comments_resource = array( 'object' => 'comments', 'type' => 'attachment' );
                $comments_route = $this->prepare_route( $attachment_route . $this->comments_base . $this->pagination_base );
                $routes[$comments_route] = $comments_resource;
            }
        }

        $this->routes = array_merge( $this->routes, $routes );
    }

    /**
     * Add routes for the website root.
     *
     * Paged results are added.
     */
    protected function add_root_routes () {
        $resource  = array( 'object' => 'archive', 'type' => 'root' );
        $this->add_routes( '', $resource, B3_EP_PAGE | B3_EP_ATTACHMENT );
    }

    /**
     * Add routes for single posts.
     *
     * This will include routes for multiple pages, comments and page
     * attachments (and their comments).
     */
    protected function add_post_routes () {
        $resource = array( 'object' => 'post', 'type' => 'post' );
        $this->add_routes( get_option( 'permalink_structure' ), $resource, B3_EP_ALL );
    }

    /**
     * Add routes for single pages.
     *
     * This will include routes for multiple pages, comments and page
     * attachments (and their comments).
     */
    protected function add_page_routes () {
        global $wp_rewrite;
        $resource = array( 'object' => 'post', 'type' => 'page' );
        $this->add_routes( $wp_rewrite->get_page_permastruct(), $resource, B3_EP_ALL );
    }

    /**
     * Add special routes for the author archives.
     *
     * This will include routes for paged results.
     */
    protected function add_author_routes () {
        global $wp_rewrite;
        $resource = array( 'object' => 'author', 'type' => 'author' );
        $this->add_routes( $wp_rewrite->get_author_permastruct(), $resource, B3_EP_PAGE );
    }

    /**
     * Add special routes for the date archives, by year, month and day.
     *
     * This will include routes for paged results.
     */
    protected function add_date_routes () {
        global $wp_rewrite;
        $resource = array( 'object' => 'archive', 'type' => 'date' );
        $this->add_routes( $wp_rewrite->get_date_permastruct(), $resource, B3_EP_PAGE );
        $this->add_routes( $wp_rewrite->get_month_permastruct(), $resource, B3_EP_PAGE );
        $this->add_routes( $wp_rewrite->get_year_permastruct(), $resource, B3_EP_PAGE );
    }

    /**
     * Add special routes for the search page.
     *
     * This will include routes for paged results.
     */
    protected function add_search_routes () {
        global $wp_rewrite;
        $resource = array( 'object' => 'archive', 'type' => 'search' );
        $this->add_routes( $wp_rewrite->get_search_permastruct(), $resource, B3_EP_PAGE );
    }

    /**
     * Add post type routes, including any public custom post types found.
     *
     * Will include routes for paged results, comments, post attachments
     * and post attachment comments. For obvious reasons, private or
     * internal post types are not added.
     *
     * Examples of routes added:
     *
     * - `post-type/:post-type`
     * - `post-type/:post-type/page/:page`
     * - `post-type/:post-type/comments`
     * - `post-type/:post-type/attachment/:attachment`
     */
    protected function add_post_type_routes () {
        global $wp_rewrite;

        $post_types = get_post_types( array( 'public' => true ) );

        foreach ($post_types as $post_type) {
            $route = $wp_rewrite->get_extra_permastruct( $post_type );

            if (empty( $route )) {
                continue;
            }

            $resource = array( 'object' => 'post', 'type' => $post_type );
            $mask     = ($post_type === 'attachment')
                      ? B3_EP_COMMENTS | B3_EP_PAGE
                      : B3_EP_ALL;

            $this->add_routes( $route, $resource, $mask );
        }
    }

    /**
     * Add taxonomy routes, including any public custom taxonomies found.
     *
     * Will include routes for paged results. For obvious reasons, private
     * or internal taxonomies are not added.
     *
     * Examples of routes added:
     *
     * - `custom-taxonomy/:custom-taxonomy`
     * - `custom-taxonomy/:custom-taxonomy/page/:page`
     */
    protected function add_taxonomy_routes () {
        global $wp_rewrite;

        $taxonomies = get_taxonomies( array( 'public' => true ) );

        foreach ($taxonomies as $taxonomy) {
            $route    = $wp_rewrite->get_extra_permastruct( $taxonomy );
            $resource = array( 'object' => 'taxonomy', 'type' => $taxonomy );
            $this->add_routes( $route, $resource, B3_EP_PAGE );
        }
    }

    /**
     * Extract tokens from routes and include them as resource data.
     */
    protected function unfold_tokens () {
        foreach ($this->routes as $route => $resource) {
            $tokens = array();
            preg_match_all( '#:([^/:*()]+)#', $route, $tokens );
            $resource['tokens']   = $tokens[1];
            $this->routes[$route] = $resource;
        }
    }

}
