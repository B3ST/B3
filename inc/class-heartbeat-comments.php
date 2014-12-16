<?php

class B3_Heartbeat_Comments {

    public function get_last_updated() {
        $comments = get_comments(
            array(
                'date_query' => $this->get_date_query()
            )
        );

        return $this->filter_comments($comments);
    }

    private function get_date_query() {
        return array(
            array(
                'after' => '15 minutes ago',
            )
        );
    }

    private function filter_comments( $comments ) {
        $result = array();
        foreach ($comments as $comment) {
            array_push($result, (int)$comment->comment_ID);
        }

        return $result;
    }
}