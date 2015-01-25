<?php

require_once 'class-heartbeat-comments.php';
require_once 'class-heartbeat-posts.php';
require_once 'class-heartbeat-taxonomies.php';

class B3_Heartbeat {

	public function ready() {
		add_filter( 'heartbeat_send', array( $this, 'send' ), 10, 2 );
		add_filter( 'heartbeat_nopriv_send', array( $this, 'send' ), 10, 2 );
		add_filter( 'heartbeat_received', array( $this, 'received' ), 10, 2 );
		add_filter( 'heartbeat_nopriv_received', array( $this, 'received' ), 10, 2 );

		$this->heartbeat_comments   = new B3_Heartbeat_Comments();
		$this->heartbeat_posts      = new B3_Heartbeat_Posts();
		$this->heartbeat_taxonomies = new B3_Heartbeat_Taxonomies();
	}

	public function send( $response, $screen_id ) {

		//$data = get_transient( 'b3.heartbeat' );
		$data = null;

		if ( empty( $data ) ) {
			$time       = '15 minutes ago';
			$comments   = $this->heartbeat_comments->get_modified_since( $time );
			$posts      = $this->heartbeat_posts->get_modified_since( $time );
			$taxonomies = $this->heartbeat_taxonomies->get_taxonomies( $posts );

			$data = array(
				'b3' => array(
					'live' => array(
						'heartbeat:comments'       => $this->filter_comments( $comments ),
						'heartbeat:comments_posts' => $this->filter_by_comments_post_ids( $comments ),
						'heartbeat:posts'          => $this->filter_posts( $posts ),
						'heartbeat:taxonomies'     => $taxonomies,
					),
					'send.screen_id' => $screen_id,
				)
			);

			//set_transient( 'b3.heartbeat', $data, 30 );
		}

		$response = array_merge( $response, $data );

		return $response;
	}

	public function received( $response, $data ) {
		$response['b3.received.test'] = time();
		return $response;
	}

	private function filter_comments( $comments ) {
		$result = array();
		foreach ( $comments as $comment ) {
			array_push( $result, array(
				'ID'       => (int) $comment->comment_ID,
				'modified' => $comment->comment_date_gmt,
			));
		}

		return $result;
	}

	private function filter_by_comments_post_ids( $comments ) {
		$result = array();
		foreach ( $comments as $comment ) {
			array_push( $result, array(
				'ID' => (int) $comment->comment_post_ID,
			));
		}

		return $result;
	}

	private function filter_posts( $posts ) {
		$result = array();
		foreach ( $posts as $post ) {
			array_push( $result, array(
				'ID'       => $post->ID,
				'modified' => $post->post_modified,
			));
		}

		return $result;
	}
}
