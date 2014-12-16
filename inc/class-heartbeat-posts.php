<?php

class B3_Heartbeat_Posts {
    public function get_last_updated( $time ) {
        $posts = get_posts(
            array(
                'date_query'          => $this->get_date_query( $time ),
                'posts_per_page'      => 20,
                'post_type'           => 'any',
                'ignore_sticky_posts' => true
            )
        );

        return $posts;
    }

    private function get_date_query( $time ) {
        return array(
             array(
                'column' => 'post_date_gmt',
                'before' => $time
            ),
            array(
                'column' => 'post_modified_gmt',
                'after'  => $time
            ),
        );
    }
}