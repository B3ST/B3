<?php
/**
 * @package B3
 * @subpackage B3/API
 */

include_once( dirname( __FILE__ ) . '/resources/class-b3-posts.php' );
include_once( dirname( __FILE__ ) . '/resources/class-b3-comments.php' );
include_once( dirname( __FILE__ ) . '/resources/class-b3-sidebars.php' );
include_once( dirname( __FILE__ ) . '/resources/class-b3-menus.php' );

class B3_JSON_REST_API {

    /**
     * [$server description]
     * @var [type]
     */
    protected $server;

    /**
     * [$posts description]
     * @var [type]
     */
    protected $posts;

    /**
     * [__construct description]
     */
    function __construct () {
        add_action( 'wp_json_server_before_serve', array( $this, 'default_filters' ), 10, 1 );
    }

    /**
     * [default_filters description]
     * @param  WP_JSON_ResponseHandler $server [description]
     * @return [type]                          [description]
     */
    function default_filters ( WP_JSON_ResponseHandler $server ) {
        $this->server   = $server;

        $this->posts    = new B3_Post( $server );
        $this->comments = new B3_Comment( $server );
        $this->sidebars = new B3_Sidebar( $server );
        $this->menus    = new B3_Menu( $server );

        add_filter( 'json_endpoints'    , array( $this->posts   , 'register_routes'     ), 10, 1 );
        add_filter( 'json_endpoints'    , array( $this->comments, 'register_routes'     ), 10, 1 );
        add_filter( 'json_endpoints'    , array( $this->sidebars, 'register_routes'     ), 10, 1 );
        add_filter( 'json_endpoints'    , array( $this->menus   , 'register_routes'     ), 10, 1 );
        add_filter( 'json_prepare_post' , array( $this->posts   , 'filter_prepare_post' ), 10, 3 );
    }

}

new B3_JSON_REST_API ();
