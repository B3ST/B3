<?php

include_once( dirname( __FILE__ ) . '/resources/class-b3-posts.php' );

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
        $this->server = $server;
        $this->posts  = new B3_Post( $server );

        add_filter( 'json_endpoints', array( $this->posts, 'register_routes' ), 10, 1 );
    }

}

new B3_JSON_REST_API ();
