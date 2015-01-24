<?php

class B3_HTTP {

	/**
	 * Send CORS headers to allow cross-domain API requests.
	 * @param  array $headers HTTP response headers.
	 * @return array          Filtered HTTP response headers.
	 */
	public function send_headers_cors ( $headers ) {
		$headers['Access-Control-Allow-Origin']      = get_http_origin();
		$headers['Access-Control-Allow-Credentials'] = 'true';

		if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
			if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
				$headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
			}
			if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ) ) {
				$headers['Access-Control-Allow-Headers'] = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'];
			}
		}

		return $headers;
	}

}
