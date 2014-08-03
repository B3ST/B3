<?php
/**
 * @package B3
 * @subpackage B3/API
 */

/**
 * Implements the Base API (abstract) class.
 */
abstract class B3_API {

    /**
     * WP API server.
     * @var WP_JSON_ResponseHandler
     */
    protected $server;

    /**
     * [__construct description]
     * @param [type] $server [description]
     */
    public function __construct ( WP_JSON_ResponseHandler $server ) {
        $this->server = $server;
    }

    /**
     * Register routes to the resources exposed by this endpoint.
     *
     * @param  array $routes Route array.
     * @return array         Modified route array.
     */
    abstract public function register_routes ( $routes );
}
