<?php

class B3_Heartbeat_Taxonomies {

	public function get_taxonomies( $posts ) {
		$result = array();
		foreach ( $posts as $post ) {
			$id     = $post->ID;
			$types  = get_object_taxonomies( get_post_type( $id ) );
			$terms  = wp_get_post_terms( $id, $types, array( 'fields' => 'ids' ) );
			$result = array_merge( $result, $terms );
		}

		return array_unique( $result );
	}

}
