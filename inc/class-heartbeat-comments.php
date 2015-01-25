<?php

class B3_Heartbeat_Comments {

	public function get_modified_since( $time ) {
		$comments = get_comments(
			array(
				'number'     => 20,
				'date_query' => $this->get_date_query( $time ),
			)
		);

		return $comments;
	}

	private function get_date_query( $time ) {
		return array(
			array(
				'after' => $time,
			)
		);
	}
}
