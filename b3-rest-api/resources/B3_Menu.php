<?php
/**
 * @package B3
 * @subpackage B3/API
 */

/**
 * Implements the Menu resource API.
 */
class B3_Menu extends B3_API {

    /**
     * [register_routes description]
     * @param  [type] $routes [description]
     * @return [type]         [description
     */
    public function register_routes ( $routes ) {

        $menu_routes = array(
            '/b3:menus' => array(
                array( array( $this, 'get_menus' ), WP_JSON_Server::READABLE ),
            ),

            '/b3:menus/(?P<location>\w+)' => array(
                array( array( $this, 'get_menu' ), WP_JSON_Server::READABLE ),
            ),
        );

        return array_merge( $routes, $menu_routes );
    }

    /**
     * Get the list of registered menus.
     *
     * @return [type] [description]
     */
    public function get_menus () {
        return $this->prepare_location( get_registered_nav_menus() );
    }

    /**
     * Retrieve a menu by index.
     *
     * @param  mixed $id       Menu name or id to retrieve.
     * @param  string $context Context in which the menu appears.
     * @return array           Menu entity.
     */
    public function get_menu ( $location, $context = 'single' ) {

        $menus = get_registered_nav_menus();

        if (!isset( $menus[$location] )) {
            return new WP_Error( 'json_menu_invalid_id', __( 'Invalid menu location.' ), array( 'status' => 404 ) );
        }

        $menus = $this->prepare_location( array( $location => $menus[$location] ), $location );

        return $menus[$location];
    }

    /**
     * Alter Post entities returned by the service.
     *
     * - Changes the reply link to use the `/posts/{id}/b3:replies` endpoint.
     *
     * @param  array  _menus    Menu entity data.
     * @param  string $context  The context for the prepared menu. (single|collection)
     * @return array            Changed post entity data.
     */
    protected function prepare_location ( $_locations, $context = NULL ) {

        $locations = array();

        foreach ($_locations as $location => $name) {
            $locations[$location] = array(
                'location' => $location,
                'name'     => $name,
                'meta'     => array(
                    'links' => array(
                        'self'       => json_url( sprintf( '/b3:menus/%s', $location ) ),
                        'collection' => json_url( '/b3:menus' ),
                    ),
                ),
            );
        }

        if (!empty( $context )) {
            $menu_locations = get_nav_menu_locations();
            $menu_id        = isset( $menu_locations[$context] )
                            ? $menu_locations[$context]
                            : false;

            if ($menu_id) {
                $menu = get_term_by( 'id', $menu_id, 'nav_menu' );
                $locations[$location]['menu'] = $this->prepare_menu( $menu );
            }
        }

        return apply_filters( 'b3_menu_locations', $locations, $_locations, $context );
    }

    /**
     * [prepare_menu description]
     * @param  [type] $_menu [description]
     * @return [type]        [description]
     */
    protected function prepare_menu ( $_menu ) {

        $menu = array(
            'ID'          => $_menu->term_id,
            'name'        => $_menu->name,
            'slug'        => $_menu->slug,
            'description' => $_menu->description,
            'count'       => $_menu->count,
            'items'       => $this->prepare_menu_items( wp_get_nav_menu_items( $_menu ) ),
        );

        return apply_filters( 'b3_menu', $menu );
    }

    /**
     * [prepare_menu_items description]
     * @param  [type] $_items [description]
     * @param  [type] $menu   [description]
     * @return [type]         [description]
     */
    protected function prepare_menu_items ( $_items ) {

        $items = array();

        foreach ($_items as $_item) {
            $item = array(
                'ID'            => (int) $_item->ID,
                'parent'        => (int) $_item->menu_item_parent,
                'order'         => (int) $_item->menu_order,
                'type'          => $_item->post_type,
                'guid'          => $_item->guid,
                'object'        => (int) $_item->object_id,
                'object_parent' => (int) $_item->post_parent,
                'object_type'   => $_item->object,
                'link'          => $_item->url,
                'title'         => $_item->title,
                'attr_title'    => $_item->attr_title,
                'description'   => $_item->description,
                'classes'       => $_item->classes,
                'target'        => $_item->target,
                'xfn'           => $_item->xfn,
            );

            $link = $this->get_object_link( $_item );

            if (!empty( $link )) {
                $item['meta'] = array( 'links' => array( 'object' => $link ) );
            }

            $items[] = $item;
        }

        return apply_filters( 'b3_menu_items', $items );
    }

    /**
     * [get_object_link description]
     * @param  [type] $item [description]
     * @return [type]       [description]
     */
    protected function get_object_link ( $item ) {

        $link = false;

        if ('post_type' === $item->type) {
            $link = $this->get_post_type_link( $item );

        } elseif ('taxonomy' === $item->type) {
            $link = $this->get_term_link( $item );
        }

        return apply_filters( 'b3_item_link', $link, $item );
    }

    /**
     * [get_post_type_link description]
     * @param  [type] $item [description]
     * @return [type]       [description]
     */
    protected function get_post_type_link ( $item ) {

        switch ($item->object) {
            case 'post':
                $link = json_url( sprintf( '/posts/%d', $item->object_id ) );
                break;

            case 'page':
                $link = json_url( sprintf( '/pages/%s', get_page_uri( $item->object_id ) ) );
                break;

            default:
                $link = false;
                break;
        }

        return apply_filters( 'b3_post_type_link', $link, $item->object_id, $item->object );
    }

    /**
     * [get_term_link description]
     * @param  [type] $item [description]
     * @return [type]       [description]
     */
    protected function get_term_link ( $item ) {

        switch ($item->object) {
            case 'category':
                $link = json_url( sprintf( '/categories/%d', $item->object_id ) );
                break;

            case 'tag':
                $link = json_url( sprintf( '/tags/%s', get_page_uri( $item->object_id ) ) );
                break;

            default:
                $link = false;
                break;
        }

        return apply_filters( 'b3_taxonomy_link', $link, $item->object_id, $item->object );
    }

}
