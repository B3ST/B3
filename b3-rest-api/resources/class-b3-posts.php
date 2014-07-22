<?php
/**
 * @package B3
 * @subpackage B3/API
 */

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
            '/posts/b3:slug:(?P<slug>.+)' => array(
                array( array( $this, 'get_post' ), WP_JSON_Server::READABLE ),
            ),
        );

        return array_merge( $routes, $post_routes );
    }

    /**
     * Retrieve a post by slug.
     *
     * @uses get_post()
     * @param  string $slug    Post slug.
     * @param  string $Context Context in which the post appears.
     * @return array           Post entity.
     */
    public function get_post ( $slug, $context = 'view' ) {
        global $wp_json_posts;
        $post = get_page_by_path( $slug, OBJECT, 'post' );
        return $wp_json_posts->get_post( $post->ID, $context );
    }

    /**
     * Alter Post entities returned by the service.
     *
     * - Changes the reply link to use the `/posts/{id}/b3:replies` endpoint.
     *
     * @param  array  $_post   Post entity data.
     * @param  array  $post    Raw post data.
     * @param  string $context The context for the prepared post. (view|view-revision|edit|embed)
     * @return array           Changed post entity data.
     */
    public function filter_prepare_post ( $_post, $post, $context ) {

        if ('view-revision' !== $context) {
            $_post['meta']['links']['replies'] = json_url( '/posts/' . $post['ID'] . '/b3:replies' );
        }

        return $_post;
    }

}
