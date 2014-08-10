<?php
/**
 * @package B3
 * @subpackage B3/API
 */

require_once( dirname( __FILE__ ) . '/resources/B3_API.php' );
require_once( dirname( __FILE__ ) . '/helpers/B3_RoutesHelper.php' );
require_once( dirname( __FILE__ ) . '/helpers/B3_SettingsHelper.php' );

class B3_JSON_REST_API {

    /**
     * WP API server.
     * @var WP_JSON_ResponseHandler
     */
    protected $server;

    /**
     * Resources provided by this extension.
     * @var array
     */
    protected $resources = array();

    /**
     * [__construct description]
     */
    function __construct () {

        $this->resources = array(
            'B3_Comment'  => NULL,
            'B3_Menu'     => NULL,
            'B3_Post'     => NULL,
            'B3_Settings' => NULL,
            'B3_Sidebar'  => NULL,
        );

        add_action( 'init', array( $this, 'init' ) );
    }

    /**
     * [init description]
     * @return [type] [description]
     */
    public function init () {
        add_action( 'wp_json_server_before_serve', array( $this, 'default_filters' ), 10, 1 );
    }

    /**
     * [default_filters description]
     * @param  WP_JSON_ResponseHandler $server [description]
     * @return [type]                          [description]
     */
    public function default_filters ( WP_JSON_ResponseHandler $server ) {
        $this->server = $server;

        foreach ($this->resources as $class => $resource) {
            include_once( dirname( __FILE__ ) . '/resources/' . $class . '.php' );
            $this->resources[$class] = $resource = new $class( $server );
            add_filter( 'json_endpoints', array( $resource, 'register_routes' ), 10, 1 );
        }

        add_filter( 'json_prepare_post', array( $this->resources['B3_Post'], 'json_prepare_post' ), 10, 3 );
        add_filter( 'json_prepare_page', array( $this->resources['B3_Post'], 'json_prepare_post' ), 10, 3 );
    }

}

new B3_JSON_REST_API ();
