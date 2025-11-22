<?php

namespace AERChartPlugin\Controllers\BasketPrices;

use AERChartPlugin\Models\BasketPrices;

/**
 * Class Actions
 *
 * Handles basket prices-related actions such as creation, retrieval, deletion, and update.
 *
 * @package AERChartPlugin\Controllers\BasketPrices
 */
class Actions {

	/**
	 * Creates a new basket price based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function create( \WP_REST_Request $request ) {
		try {
			$basket_price            = new BasketPrices();
			$basket_price->day       = sanitize_text_field( $request->get_param( 'day' ) );
			$basket_price->setScore  = floatval( $request->get_param( 'setScore' ) );
			$basket_price->save();

			return Messages::success_basket_price_created();
		} catch ( \Exception $e ) {
			return Messages::error_basket_price_created();
		}
	}

	/**
	 * Retrieves basket prices from the database.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return mixed The list of basket prices or single basket price.
	 */
	public function get( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		if ( $id ) {
			$basket_price = BasketPrices::find( $id );
			if ( ! $basket_price ) {
				return Messages::error_basket_price_not_found();
			}
			return $basket_price;
		}

		// Get optional query parameters
		$limit  = $request->get_param( 'limit' ) ? intval( $request->get_param( 'limit' ) ) : null;
		$offset = $request->get_param( 'offset' ) ? intval( $request->get_param( 'offset' ) ) : 0;
		$order  = $request->get_param( 'order' ) ? sanitize_text_field( $request->get_param( 'order' ) ) : 'desc';
		$orderby = $request->get_param( 'orderby' ) ? sanitize_text_field( $request->get_param( 'orderby' ) ) : 'day';

		$query = BasketPrices::orderBy( $orderby, $order );

		if ( $limit ) {
			$query->limit( $limit )->offset( $offset );
		}

		return $query->get();
	}

	/**
	 * Deletes a basket price based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function delete( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' ); // Basket price ID requested to delete.
		try {
			$basket_price = BasketPrices::find( $id );
			if ( ! $basket_price ) {
				return Messages::error_basket_price_not_found();
			}

			$basket_price->delete();
			return Messages::success_basket_price_deleted();
		} catch ( \Exception $e ) {
			return Messages::error_basket_price_deleted();
		}
	}

	/**
	 * Updates a basket price based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function update( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		try {
			$basket_price = BasketPrices::find( $id );
			if ( ! $basket_price ) {
				return Messages::error_basket_price_not_found();
			}

			$update_data = array();

			if ( $request->get_param( 'day' ) !== null ) {
				$update_data['day'] = sanitize_text_field( $request->get_param( 'day' ) );
			}

			if ( $request->get_param( 'setScore' ) !== null ) {
				$update_data['setScore'] = floatval( $request->get_param( 'setScore' ) );
			}

			$basket_price->update( $update_data );
			return Messages::success_basket_price_updated();
		} catch ( \Exception $e ) {
			return Messages::error_basket_price_updated();
		}
	}
}

