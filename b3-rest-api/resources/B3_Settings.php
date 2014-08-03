<?php
/**
 * @package B3
 * @subpackage B3/API
 */

require_once( dirname( __FILE__ ) . '/../wrappers/B3_WPSettings.php' );

/**
 * Implements the Settings resource API.
 */
class B3_Settings extends B3_API {

    /**
     * Settings object.
     * @var B3_WPSettings
     */
    protected $settings;

    /**
     * Options returned by the endpoint.
     * @var array
     * @see B3_WPSettings::__get()
     */
    protected $options = array(
        'name',
        'description',
        'site_url',
        'site_path',
        'wp_url',
        'api_url',
        'root_url',
        'routes',
        'page_on_front',
        'page_for_posts',
        'charset',
        'text_direction',
        'language'
    );

    /**
     * [__construct description]
     * @param WP_JSON_ResponseHandler $server [description]
     */
    public function __construct ( WP_JSON_ResponseHandler $server ) {
        parent::__construct( $server );

        $this->settings = new B3_WPSettings();
    }

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

        foreach ($this->options as $option) {
            $settings[$option] = $this->settings->$option;
        }

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
            $option => $this->settings->$option
        );

        return $this->prepare_settings( $settings, $option );
    }

    /**
     * Alter Settings entities returned by the service.
     *
     * @param  array  $_sidebar Settings entity data.
     * @param  string $context  The context for the prepared option, if single.
     *
     * @return array            Changed settings entity data.
     */
    protected function prepare_settings ( $_settings, $context = NULL ) {
        $settings = array();

        foreach ($_settings as $option => $value) {
            if (!in_array( $option, $this->options )) {
                continue;
            }

            $settings[$option] = array(
                'value' => apply_filters( 'b3_settings_option', $value, $option, $context ),
                'meta' => array(
                    'links' => array(
                        'self' => json_url( sprintf( '/b3:settings/%s', $option ) ),
                    ),
                ),
            );

            if ('page_on_front' === $option && !empty( $value )) {
                $settings[$option]['meta']['links']['page'] = json_url( '/pages/' . $value );
            }

            if ($context !== NULL) {
                $settings[$option]['meta']['links']['collection'] = json_url( '/b3:settings' );
            }
        }

        return apply_filters( 'b3_settings', $settings, $_settings, $context );
    }

}
