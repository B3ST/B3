<?php
/**
 * Script functions.
 */

/**
 * Clean up script dependencies para removing invalid entries.
 *
 * Pseudo-dependencies such as WordPress uses to aggregate further
 * dependencies will be removed and it's child nodes hoisted.
 *
 * Please note that this method will not check whether a file exists or is
 * accessible.
 *
 * @param array $scripts (Input) Enqueued scripts.
 *
 * @todo Unmet dependencies should be removed to minimize loading errors.
 */
function cleanup_script_dependencies( &$scripts ) {
	foreach ( $scripts as $handle => $script ) {
		if ( empty( $script['src'] ) ) {
			replace_script_dependency( $scripts, $handle, $script['deps'] );
			unset( $scripts[ $handle ] );
		}
	}
}

/**
 * Replaces a dependency with a list of different dependencies.
 *
 * @param  array  $scripts     (Input) Enqueued scripts.
 * @param  string $replace     Dependency to replace.
 * @param  array  $replacement Replacement dependencies (empty by default).
 */
function replace_script_dependency( &$scripts, $replace, $replacement = array() ) {
	foreach ( $scripts as $handle => $script ) {
		$offset = array_search( $replace, $script['deps'] );
		if ( $offset !== false ) {
			array_splice( $scripts[ $handle ]['deps'], $offset, 1, $replacement );
		}
	}
}
