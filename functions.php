<?php

function add_require() {
  $root_url = get_stylesheet_directory_uri();
  $settings = array(
    'root'  => $root_url,
    'url'   => esc_url_raw(get_json_url()),
    'nonce' => wp_create_nonce('wp_json'));

  wp_register_script('requirejs', $root_url . '/libs/require.js');
  wp_localize_script('requirejs', 'WP_API_SETTINGS', $settings);
  wp_enqueue_script('requirejs', array(), null, false);
}
add_action('wp_enqueue_scripts', 'add_require', 11);

function add_data_main($src, $handle){
  if ($handle != 'requirejs')
    return $src;

  return $src . '" id="requirejs-loader" data-main="' . get_stylesheet_directory_uri() . '/app/config/init.js"';
}
add_filter('script_loader_src', 'add_data_main', 10, 2);

function unclean_url($good_protocol_url, $original_url, $_context){
  if (strpos($original_url, 'requirejs-loader') !== false){
    remove_filter('clean_url', 'unclean_url', 10, 3);
    $url_parts = parse_url($good_protocol_url);
    return $url_parts['scheme'] . '://' . $url_parts['host'] . ':' . $url_parts['port'] . $url_parts['path'] . "' data-main='" . get_stylesheet_directory_uri() . "/app/config/init.js'";
  }

  return $good_protocol_url;
}
add_filter('clean_url', 'unclean_url', 10, 3);