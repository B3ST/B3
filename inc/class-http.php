<?php

class B3_HTTP {

	/**
	 * Send CORS headers to allow cross-domain API requests.
	 *
	 * You can use the `allowed_http_origins` filter to control per-origin
	 * access.
	 *
	 * This is added only in debug mode to allow BrowserSync proxying.
	 *
	 * DO NOT USE ON LIVE SITES.
	 *
	 * @param  array $headers HTTP response headers.
	 * @return array          Filtered HTTP response headers.
	 */
	public function send_headers_cors( $headers ) {
		$origin = get_http_origin();

		if ( empty( $origin ) ) {
			return $headers;
		}

		$expose_headers = array(
			'X-WP-Total',
			'X-WP-TotalPages',
		);

		$headers['Access-Control-Allow-Origin']      = esc_url_raw( $origin );
		$headers['Access-Control-Allow-Credentials'] = 'true';
		$headers['Access-Control-Expose-Headers']    = implode( ', ', $expose_headers );

		if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
			if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
				$headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE';
			}
			if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ) ) {
				$headers['Access-Control-Allow-Headers'] = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'];
			}
		}

		return $headers;
	}

}
