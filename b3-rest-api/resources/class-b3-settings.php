<?php
/**
 * @package B3
 * @subpackage B3/API
 */

/**
 * Implements the Settings resource API.
 */
class B3_Settings extends B3_API {

    /**
     * [register_routes description]
     * @param  [type] $routes [description]
     * @return [type]         [description
     */
    public function register_routes ( $routes ) {

        $sidebar_routes = array(
            '/b3:settings' => array(
                array( array( $this, 'get_options' ), WP_JSON_Server::READABLE ),
            ),

            '/b3:settings/(?P<option>\w+)' => array(
                array( array( $this, 'get_option' ), WP_JSON_Server::READABLE ),
            ),
        );

        return array_merge( $routes, $sidebar_routes );
    }

    /**
     * [get_sidebars description]
     * @return [type] [description]
     */
    public function get_options () {

        $settings = array();

        return $this->prepare_settings( $settings );
    }

    /**
     * Retrieve a setting by by option name.
     *
     * @param  mixed $option Name of the opttion to retrieve.
     * @return array         Settings entity.
     */
    public function get_option ( $option ) {

        $settings = array(
            $option => array(),
        );

        return $this->prepare_settings( $settings, $option );
    }

    /**
     * Alter Settings entities returned by the service.
     *
     * @param  array  $_sidebar Settings entity data.
     * @param  string $context  The context for the prepared option, if single.
     * @return array            Changed settings entity data.
     */
    protected function prepare_settings ( $settings, $context = NULL ) {

        $allowed_options = array( '...' );


        if (NULL !== $context) {
            $settings = $settings[$context];
        }

        return apply_filters( 'b3_settings', $settings, $_settings, $context );
    }

}
