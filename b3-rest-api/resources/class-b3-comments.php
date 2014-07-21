<?php

/**
 * Implements a Comment resource API.
 */
class B3_Comment {

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
     * @param  array $routes [description]
     * @return array         [description]
     */
    public function register_routes ( $routes ) {

        $post_routes = array(
            '/posts/(?P<id>\d+)/b3\:replies' => array(
                array( array( $this, 'get_post_replies' ),    WP_JSON_Server::READABLE ),
                array( array( $this, 'new_post_reply' ),      WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
            ),

            '/b3\:comments/(?P<id>\d+)' => array(
                array( array( $this, 'get_comment' ),         WP_JSON_Server::READABLE ),
                array( array( $this, 'update_comment' ),      WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
                array( array( $this, 'delete_comment' ),      WP_JSON_Server::DELETABLE ),
            ),

            '/b3\:comments/(?P<id>\d+)/b3\:replies' => array(
                array( array( $this, 'get_comment_replies' ), WP_JSON_Server::READABLE ),
                array( array( $this, 'new_comment_reply' ),   WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
            ),
        );

        return array_merge( $routes, $post_routes );
    }

    /**
     * Retrieve all responses to a post.
     *
     * @param  int    $post_id Post ID to retrieve comments for.
     * @return array           List of Comment entities.
     */
    public function get_post_replies ( $id ) {
        global $wp_json_posts;

        $post = get_post( $id, ARRAY_A );

        if (empty( $post['ID'] )) {
            return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.' ), array( 'status' => 404 ) );
        }

        if (!$this->check_read_permission( $post )) {
            return new WP_Error( 'json_user_cannot_read', __( 'Sorry, you cannot read this post.' ), array( 'status' => 401 ) );
        }

        $comments = get_comments( array( 'post_id' => $id ) );

        $response = array();

        foreach ($comments as $comment) {
            $response[] = $this->prepare_comment( $comment, array( 'comment', 'meta' ), 'collection' );
        }

        return $response;
    }

    /**
     * Add a reply to a post.
     *
     * @param  int    $post_id [description]
     * @param  array  $data    Data array, containing the following fields:
     *                         - comment_post_ID
     *
     * @return mixed           [description]
     */
    public function new_post_reply ( $id, $data ) {
        global $wp_json_posts;

        $post = get_post( $id, ARRAY_A );

        if (empty( $post['ID'] )) {
            return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.' ), array( 'status' => 404 ) );
        }

        if (!$this->check_read_permission( $post )) {
            return new WP_Error( 'json_user_cannot_read', __( 'Sorry, you cannot read replies to this post.' ), array( 'status' => 401 ) );
        }

        if (!$this->check_reply_permission( $post )) {
            return new WP_Error( 'json_user_cannot_reply', __( 'Sorry, you cannot reply to this post.' ), array( 'status' => 401 ) );
        }

        $data['comment_post_ID'] = (int) $id;

        $user = wp_get_current_user();

        if ($user) {
            $data['user_ID'] = $user->ID;
            $data['user_id'] = $user->ID;
        }

        $comment_ID = wp_new_comment( $data );

        if (is_wp_error( $comment_ID )) {
            return $comment_ID;
        }

        return $this->get_comment( $comment_ID );
    }

    /**
     * Retrieve a single comment by ID.
     *
     * @param  int   $id Comment ID.
     * @return array     Comment entity.
     */
    public function get_comment ( $id ) {
        global $wp_json_posts;

        $comment = get_comment( $id );

        if (empty( $comment->comment_ID )) {
            return new WP_Error( 'json_comment_invalid_id', __( 'Invalid comment ID.' ), array( 'status' => 404 ) );
        }

        $post = get_post( $comment->comment_post_ID, ARRAY_A );

        if (!$this->check_read_permission( $post )) {
            return new WP_Error( 'json_user_cannot_read', __( 'Sorry, you cannot read replies to this post.' ), array( 'status' => 401 ) );
        }

        return $this->prepare_comment( $comment, array( 'comment', 'meta' ), 'single' );
    }

    /**
     * Edit a single comment by ID.
     *
     * @param  int    $comment_id Comment ID to edit.
     * @param  [type] $data       [description]
     * @return [type]             [description]
     *
     * @todo
     */
    public function update_comment ( $id, $data ) {
        global $wp_json_posts;

        return new WP_Error( 'json_not_implemented', __( 'Not yet implemented.' ), array( 'status' => 501 ) );
    }

    /**
     * Remove a single comment.
     *
     * @param  int    $comment_id Comment ID to removed.
     * @return [type]             [description]
     *
     * @todo
     */
    public function delete_comment ( $id ) {
        global $wp_json_posts;

        return new WP_Error( 'json_not_implemented', __( 'Not yet implemented.' ), array( 'status' => 501 ) );
    }

    /**
     * Retrieve all responses to a comment.
     *
     * @param  int    $comment_id Unique ID for the comment whose replies are being retrieved.
     * @param  string $context    [description]
     * @return [type]             [description]
     */
    public function get_comment_replies ( $id ) {
        global $wp_json_posts;

        $comment = get_comment( $id );

        if (empty( $comment->comment_ID )) {
            return new WP_Error( 'json_comment_invalid_id', __( 'Invalid comment ID.' ), array( 'status' => 404 ) );
        }

        $post = get_post( $comment->comment_post_ID, ARRAY_A );

        if (!$this->check_read_permission( $post )) {
            return new WP_Error( 'json_user_cannot_read', __( 'Sorry, you cannot read this post.' ), array( 'status' => 401 ) );
        }

        $comments = get_comments( array( 'parent' => $id ) );

        $response = array();

        foreach ($comments as $comment) {
            $response[] = $this->prepare_comment( $comment, array( 'comment', 'meta' ), 'collection' );
        }

        return $response;
    }

    /**
     * Add a reply to a comment.
     *
     * @param  int    id    Unique ID for the comment being replied to.
     * @param  array  $data Comment data.
     * @return [type]       [description]
     */
    public function new_comment_reply ( $id, $data ) {
        global $wp_json_posts;

        $comment = get_comment( $id );

        if (empty( $comment->comment_ID )) {
            return new WP_Error( 'json_comment_invalid_id', __( 'Invalid comment ID.' ), array( 'status' => 404 ) );
        }

        $post = get_post( $comment->comment_post_ID, ARRAY_A );

        if (empty( $post['ID'] )) {
            return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.' ), array( 'status' => 404 ) );
        }

        if (!$this->check_read_permission( $post )) {
            return new WP_Error( 'json_user_cannot_read', __( 'Sorry, you cannot read replies to this post.' ), array( 'status' => 401 ) );
        }

        if (!$this->check_reply_permission( $post )) {
            return new WP_Error( 'json_user_cannot_reply', __( 'Sorry, you cannot reply to this post.' ), array( 'status' => 401 ) );
        }

        $data['comment_parent']  = (int) $id;
        $data['comment_post_ID'] = (int) $comment->comment_post_ID;

        $user = wp_get_current_user();

        if ($user) {
            $data['user_ID'] = $user->ID;
            $data['user_id'] = $user->ID;
        }

        $comment_ID = wp_new_comment( $data );

        if (is_wp_error( $comment_ID )) {
            return $comment_ID;
        }

        return $this->get_comment( $comment_ID );
    }

    /**
     * Check if the current user is allowed to read a post.
     *
     * @param  [type] $post [description]
     * @return [type]       [description]
     */
    protected function check_read_permission ( $post ) {
        $post_type = get_post_type_object( $post['post_type'] );

        // Ensure the post type can be read
        if ( ! $post_type->show_in_json ) {
            return false;
        }

        // Can we read the post?
        if ('publish' === $post['post_status'] || current_user_can( $post_type->cap->read_post, $post['ID'] )) {
            return true;
        }

        // Can we read the parent if we're inheriting?
        if ('inherit' === $post['post_status'] && $post['post_parent'] > 0) {
            $parent = get_post( $post['post_parent'], ARRAY_A );

            if ($this->check_read_permission( $parent )) {
                return true;
            }
        }

        // If we don't have a parent, but the status is set to inherit, assume
        // it's published (as per get_post_status())
        if ( 'inherit' === $post['post_status'] ) {
            return true;
        }

        return false;
    }

    /**
     * Check if the current user is allowed to comment on a post.
     *
     * @param  [type] $post [description]
     * @return [type]       [description]
     */
    protected function check_reply_permission ( $post ) {
        return comments_open( $post['ID'] );
    }

    /**
     * Check if the current user is allowed to edit a comment.
     *
     * @param  [type] $comment [description]
     * @return [type]          [description]
     */
    protected function check_edit_permission ( $comment ) {
        return false;
    }

    /**
     * Check if the current user is allowed to delete a comment.
     *
     * @param  [type] $comment [description]
     * @return [type]          [description]
     */
    protected function check_delete_permission ( $comment ) {
        return false;
    }

    /**
     * [prepare_comment description]
     * @param  [type] $comment [description]
     * @return [type]          [description]
     */
    protected function prepare_comment ( $comment, $requested_fields = array( 'comment', 'meta' ), $context = 'single' ) {
        $fields = array(
            'ID'   => (int) $comment->comment_ID,
            'post' => (int) $comment->comment_post_ID,
        );

        $post = (array) get_post( $fields['post'] );

        // Content
        $fields['content'] = apply_filters( 'comment_text', $comment->comment_content, $comment );

        // Status
        switch ($comment->comment_approved) {
            case 'hold':
            case '0':
                $fields['status'] = 'hold';
                break;

            case 'approve':
            case '1':
                $fields['status'] = 'approved';
                break;

            case 'spam':
            case 'trash':
            default:
                $fields['status'] = $comment->comment_approved;
                break;
        }

        // Type
        $fields['type'] = apply_filters( 'get_comment_type', $comment->comment_type );

        if (empty( $fields['type'] )) {
            $fields['type'] = 'comment';
        }

        // Parent
        $fields['parent'] = (int) $comment->comment_parent;

        // Author
        if ((int) $comment->user_id !== 0) {
            $fields['author'] = (int) $comment->user_id;
        } else {
            $fields['author'] = array(
                'ID'     => 0,
                'name'   => $comment->comment_author,
                'URL'    => $comment->comment_author_url,
                'avatar' => json_get_avatar_url( $comment->comment_author_email ),
            );
        }

        // Date
        $timezone = json_get_timezone();

        $date               = WP_JSON_DateTime::createFromFormat( 'Y-m-d H:i:s', $comment->comment_date, $timezone );
        $fields['date']     = $date->format( 'c' );
        $fields['date_tz']  = $date->format( 'e' );
        $fields['date_gmt'] = date( 'c', strtotime( $comment->comment_date_gmt ) );

        // Meta
        $meta = array(
            'links' => array(
                'up' => json_url( sprintf( '/posts/%d', (int) $comment->comment_post_ID ) )
            ),
        );

        if (0 !== (int) $comment->comment_parent) {
            $meta['links']['in-reply-to'] = json_url( sprintf( '/b3:comments/%d', (int) $comment->comment_parent ) );
        }

        if ('single' !== $context) {
            $meta['links']['self'] = json_url( sprintf( '/b3:comments/%d', (int) $comment->comment_ID ) );
        }

        // Remove unneeded fields
        $data = array();

        if (in_array( 'comment', $requested_fields )) {
            $data = array_merge( $data, $fields );
        }

        if (in_array( 'meta', $requested_fields )) {
            $data['meta'] = $meta;
        }

        return apply_filters( 'b3_prepare_comment', $data, $comment, $context );
    }

}
