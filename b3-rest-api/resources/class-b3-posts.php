<?php

/**
 * Extends the default Post resource API.
 */
class B3_Post {

    /**
     * [$server description]
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
     * [register_routes description]
     * @param  [type] $routes [description]
     * @return [type]         [description
     */
    public function register_routes ( $routes ) {

        $post_routes = array(
            '/posts/b3/slug/(?P<slug>.+)' => array(
                array( array( $this, 'get_post' ), WP_JSON_Server::READABLE ),
            ),
        );

        return array_merge( $routes, $post_routes );
    }

    /**
     * Retrieve a post by slug.
     *
     * @uses get_post()
     * @param  string $slug   Post slug.
     * @param  array  $fields Post fields to return (optional).
     * @return array          Post entity.
     */
    public function get_post ( $slug, $context = 'view' ) {
        global $wp_json_posts;
        $post = get_page_by_path( $slug, OBJECT, 'post' );
        return $wp_json_posts->get_post( $post->ID, $context );
    }

}
