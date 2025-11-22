<?php

namespace AERChartPlugin\Controllers\BasketPriceLabels;

use AERChartPlugin\Models\BasketPriceLabels;

/**
 * Class Actions
 *
 * Handles basket price labels-related actions.
 *
 * @package AERChartPlugin\Controllers\BasketPriceLabels
 */
class Actions {

	/**
	 * Retrieves basket price labels from the database.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return mixed The list of labels.
	 */
	public function get( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		if ( $id ) {
			$label = BasketPriceLabels::find( $id );
			if ( ! $label ) {
				return Messages::error_label_not_found();
			}
			return $label;
		}

		// Always return labels ordered by display_order
		return BasketPriceLabels::orderBy( 'display_order', 'asc' )->get();
	}

	/**
	 * Updates a label based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function update( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		try {
			$label = BasketPriceLabels::find( $id );
			if ( ! $label ) {
				return Messages::error_label_not_found();
			}

			$update_data = array();

			if ( $request->get_param( 'name' ) !== null ) {
				$update_data['name'] = sanitize_text_field( $request->get_param( 'name' ) );
			}

			if ( $request->get_param( 'color' ) !== null ) {
				$update_data['color'] = sanitize_text_field( $request->get_param( 'color' ) );
			}

			if ( $request->get_param( 'display_order' ) !== null ) {
				$update_data['display_order'] = intval( $request->get_param( 'display_order' ) );
			}

			$label->update( $update_data );
			return Messages::success_label_updated();
		} catch ( \Exception $e ) {
			return Messages::error_label_updated();
		}
	}
}

