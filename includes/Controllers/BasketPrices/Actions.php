<?php

namespace AERChartPlugin\Controllers\BasketPrices;

use AERChartPlugin\Models\BasketPrices;
use AERChartPlugin\Models\Countries;

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
			$country_id = intval( $request->get_param( 'country_id' ) );
			$day        = sanitize_text_field( $request->get_param( 'day' ) );

			// Check if entry already exists for this country and day
			$existing = BasketPrices::where( 'country_id', $country_id )
				->where( 'day', $day )
				->first();

			if ( $existing ) {
				return Messages::error_basket_price_exists();
			}

			$basket_price                = new BasketPrices();
			$basket_price->country_id    = $country_id;
			$basket_price->day           = $day;
			$basket_price->value_label_1 = floatval( $request->get_param( 'value_label_1' ) );
			$basket_price->value_label_2 = floatval( $request->get_param( 'value_label_2' ) );
			$basket_price->value_label_3 = floatval( $request->get_param( 'value_label_3' ) );
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
			$basket_price = BasketPrices::with( 'country' )->find( $id );
			if ( ! $basket_price ) {
				return Messages::error_basket_price_not_found();
			}
			return $basket_price;
		}

		// Get optional query parameters
		$country_id = $request->get_param( 'country_id' ) ? intval( $request->get_param( 'country_id' ) ) : null;
		$limit      = $request->get_param( 'limit' ) ? intval( $request->get_param( 'limit' ) ) : null;
		$offset     = $request->get_param( 'offset' ) ? intval( $request->get_param( 'offset' ) ) : 0;
		$order      = $request->get_param( 'order' ) ? sanitize_text_field( $request->get_param( 'order' ) ) : 'asc';
		$orderby    = $request->get_param( 'orderby' ) ? sanitize_text_field( $request->get_param( 'orderby' ) ) : 'day';

		$query = BasketPrices::with( 'country' )->orderBy( $orderby, $order );

		if ( $country_id ) {
			$query->where( 'country_id', $country_id );
		}

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

			if ( $request->get_param( 'country_id' ) !== null ) {
				$update_data['country_id'] = intval( $request->get_param( 'country_id' ) );
			}

			if ( $request->get_param( 'day' ) !== null ) {
				$update_data['day'] = sanitize_text_field( $request->get_param( 'day' ) );
			}

			if ( $request->get_param( 'value_label_1' ) !== null ) {
				$update_data['value_label_1'] = floatval( $request->get_param( 'value_label_1' ) );
			}

			if ( $request->get_param( 'value_label_2' ) !== null ) {
				$update_data['value_label_2'] = floatval( $request->get_param( 'value_label_2' ) );
			}

			if ( $request->get_param( 'value_label_3' ) !== null ) {
				$update_data['value_label_3'] = floatval( $request->get_param( 'value_label_3' ) );
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

