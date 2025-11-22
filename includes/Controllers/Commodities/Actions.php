<?php

namespace AERChartPlugin\Controllers\Commodities;

use AERChartPlugin\Models\Commodities;

/**
 * Class Actions
 *
 * Handles commodities-related actions such as creation, retrieval, deletion, and update.
 *
 * @package AERChartPlugin\Controllers\Commodities
 */
class Actions {

	/**
	 * Creates a new commodity based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function create( \WP_REST_Request $request ) {
		try {
			$commodity              = new Commodities();
			$commodity->name        = sanitize_text_field( $request->get_param( 'name' ) );
			$commodity->abbreviation = sanitize_text_field( $request->get_param( 'abbreviation' ) );
			$commodity->prevPrice   = floatval( $request->get_param( 'prevPrice' ) );
			$commodity->curPrice    = floatval( $request->get_param( 'curPrice' ) );
			$commodity->save();

			return Messages::success_commodity_created();
		} catch ( \Exception $e ) {
			return Messages::error_commodity_created();
		}
	}

	/**
	 * Retrieves commodities from the database.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return mixed The list of commodities or single commodity.
	 */
	public function get( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		if ( $id ) {
			$commodity = Commodities::find( $id );
			if ( ! $commodity ) {
				return Messages::error_commodity_not_found();
			}
			return $commodity;
		}

		// Get optional query parameters
		$limit   = $request->get_param( 'limit' ) ? intval( $request->get_param( 'limit' ) ) : null;
		$offset  = $request->get_param( 'offset' ) ? intval( $request->get_param( 'offset' ) ) : 0;
		$order   = $request->get_param( 'order' ) ? sanitize_text_field( $request->get_param( 'order' ) ) : 'asc';
		$orderby = $request->get_param( 'orderby' ) ? sanitize_text_field( $request->get_param( 'orderby' ) ) : 'name';

		$query = Commodities::orderBy( $orderby, $order );

		if ( $limit ) {
			$query->limit( $limit )->offset( $offset );
		}

		return $query->get();
	}

	/**
	 * Deletes a commodity based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function delete( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' ); // Commodity ID requested to delete.
		try {
			$commodity = Commodities::find( $id );
			if ( ! $commodity ) {
				return Messages::error_commodity_not_found();
			}

			$commodity->delete();
			return Messages::success_commodity_deleted();
		} catch ( \Exception $e ) {
			return Messages::error_commodity_deleted();
		}
	}

	/**
	 * Updates a commodity based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function update( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		try {
			$commodity = Commodities::find( $id );
			if ( ! $commodity ) {
				return Messages::error_commodity_not_found();
			}

			$update_data = array();

			if ( $request->get_param( 'name' ) !== null ) {
				$update_data['name'] = sanitize_text_field( $request->get_param( 'name' ) );
			}

			if ( $request->get_param( 'abbreviation' ) !== null ) {
				$update_data['abbreviation'] = sanitize_text_field( $request->get_param( 'abbreviation' ) );
			}

			if ( $request->get_param( 'prevPrice' ) !== null ) {
				$update_data['prevPrice'] = floatval( $request->get_param( 'prevPrice' ) );
			}

			if ( $request->get_param( 'curPrice' ) !== null ) {
				$update_data['curPrice'] = floatval( $request->get_param( 'curPrice' ) );
			}

			$commodity->update( $update_data );
			return Messages::success_commodity_updated();
		} catch ( \Exception $e ) {
			return Messages::error_commodity_updated();
		}
	}
}

