<?php
/**
 * B3 theme logic.
 */

if (!defined( 'WPINC' )) {
    die;
}

/**
 * FIXME: Eventually move this to its own plugin.
 */
require_once get_template_directory() . '/b3-rest-api/b3-rest-api.php';

class B3Theme {

    /**
     * Theme slug.
     * @var [type]
     */
    protected $slug = 'b3';

    /**
     * [$version description]
     * @var string
     */
    protected $version = '0.1.0';

    /**
     * [$require description]
     * @var string
     */
    protected $require_uri = '';

    /**
     * [$loader description]
     * @var string
     */
    protected $loader_uri = '';

    /**
     * [__construct description]
     */
    public function __construct () {
        $this->settings_uri = get_template_directory_uri() . '/settings.js';
        $this->require_uri  = get_template_directory_uri() . '/lib/require.js';
        $this->loader_uri   = get_template_directory_uri() . '/dist/config/init.js';

        $this->setup();
    }

    /**
     * [is_wp_api_active description]
     * @return boolean [description]
     */
    protected function is_wp_api_active () {
        return function_exists( 'json_get_url_prefix' );
    }

    /**
     * [is_wp_api_active description]
     * @return boolean [description]
     */
    public function wp_api_check () {
        if (!$this->is_wp_api_active()) {
            wp_die( __( 'The WordPress API is unavailable. Please install and enable the WP API plugin to use this theme.', 'b3' ),
                __( 'Error: WP API Unavailable', 'b3' ) );
        }
    }

    /**
     * [setup description]
     */
    public function setup () {
        load_theme_textdomain( $this->slug, get_template_directory() . '/languages' );

        $this->setup_menus();

        add_theme_support( 'automatic-feed-links' );

        add_theme_support( 'html5', array(
            'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
        ) );

        add_action( 'widgets_init'      , array( $this, 'setup_widgets' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'setup_scripts' ) );
        add_action( 'wp_head'           , array( $this, 'enqueue_require_script' ), 20, 0 );
        add_action( 'wp_footer'         , array( $this, 'enqueue_browsersync_script' ), 99, 0 );
    }

    /**
     * [register_menus description]
     */
    protected function setup_menus () {
        register_nav_menus( array(
            'primary' => __( 'Primary Menu', 'b3' ),
        ) );
    }

    /**
     * [register_widgets description]
     * @return [type] [description]
     */
    public function setup_widgets () {
        register_sidebar( array(
            'name'          => __( 'Sidebar', 'b3' ),
            'id'            => 'sidebar',
            'description'   => 'Default sidebar.',
        ) );

        register_sidebar( array(
            'name'          => __( 'Footer', 'b3' ),
            'id'            => 'footer',
            'description'   => 'Footer widget area.',
        ) );

    }

    /**
     * Inject client application scripts.
     *
     * This action is called on `wp_enqueue_scripts` and injects required client
     * application settings from the backend, such as:
     *
     * - `root`:  Theme root URI.
     * - `url`:   RESTful WP API endpoint prefix.
     * - `name`:  Site name.
     * - `nonce`: Nonce string.
     */
    public function setup_scripts () {
        if (!$this->is_wp_api_active()) {
            return;
        }

        $site_url_components = parse_url( site_url() );

        $permastructs = $this->_get_permastructs();

        $settings = array(
            'path'         => (string) $site_url_components['path'],
            'root'         => get_stylesheet_directory_uri(),
            'url'          => home_url( json_get_url_prefix() ),
            'name'         => get_bloginfo( 'name' ),
            'nonce'        => wp_create_nonce( 'wp_json' ),
            'permastructs' => $permastructs,
            );

        wp_register_script( $this->slug . '-settings', $this->settings_uri );
        wp_localize_script( $this->slug . '-settings', 'WP_API_SETTINGS', $settings );
        wp_enqueue_script( $this->slug . '-settings' );

        wp_enqueue_style( $this->slug . '-style', get_stylesheet_uri(), NULL, $this->version, 'screen' );
    }

    protected function _get_permastructs () {
        global $wp_rewrite;

        /**
         * Allows developers to alter the list of permastructs sent to the client frontend.
         * @param  array $permastructs List of permastructs.
         * @return array               Filtered list of permastructs.
         */
        $permastructs = apply_filters( 'b3_permastructs', array(
            'page'     => $wp_rewrite->get_page_permastruct(),
            'category' => $wp_rewrite->get_category_permastruct(),
            'tag'      => $wp_rewrite->get_tag_permastruct(),
            'author'   => $wp_rewrite->get_author_permastruct(),
            'date'     => $wp_rewrite->get_date_permastruct(),
            'day'      => $wp_rewrite->get_day_permastruct(),
            'month'    => $wp_rewrite->get_month_permastruct(),
            'year'     => $wp_rewrite->get_year_permastruct(),
            ) );

        foreach ($permastructs as $key => $permastruct) {
            $permastructs[$key] = preg_replace( '/%([^%]+)%/', ":$1", $permastruct );
        }

        return $permastructs;
    }

    public function enqueue_require_script () {
        if (!$this->is_wp_api_active()) {
            return;
        }
        echo '<script src="' . $this->require_uri . '" data-main="' . $this->loader_uri . '"></script>';
    }

    public function enqueue_browsersync_script () {
        if (defined( 'WP_DEBUG' ) && WP_DEBUG) {
            // echo '<script src="http://127.0.0.1:3000/lib/socket.js" async></script>';
            // echo '<script src="http://127.0.0.1:3000/browser-sync-client.js" async></script>';
        }
    }

}

function B3 () {
    global $GLOBALS;

    if (!isset( $GLOBALS['b3'] )) {
        $GLOBALS['b3'] = new B3Theme();
    }

    return $GLOBALS['b3'];
}

add_action( 'after_setup_theme', 'B3' );
