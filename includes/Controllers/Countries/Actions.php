<?php

namespace AERChartPlugin\Controllers\Countries;

use AERChartPlugin\Models\Countries;

/**
 * Class Actions
 *
 * Handles countries-related actions such as creation, retrieval, deletion, and update.
 *
 * @package AERChartPlugin\Controllers\Countries
 */
class Actions {

	/**
	 * Creates a new country based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function create( \WP_REST_Request $request ) {
		try {
			$country            = new Countries();
			$country->name      = sanitize_text_field( $request->get_param( 'name' ) );
			$country->code      = sanitize_text_field( $request->get_param( 'code' ) );
			$country->display_order = intval( $request->get_param( 'display_order' ) ) ?: 0;
			$country->is_active = $request->get_param( 'is_active' ) !== false;
			$country->save();

			return Messages::success_country_created();
		} catch ( \Exception $e ) {
			return Messages::error_country_created();
		}
	}

	/**
	 * Retrieves countries from the database.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return mixed The list of countries or single country.
	 */
	public function get( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		if ( $id ) {
			$country = Countries::find( $id );
			if ( ! $country ) {
				return Messages::error_country_not_found();
			}
			return $country;
		}

		// Get optional query parameters
		$active_only = $request->get_param( 'active_only' ) !== false;
		$order       = $request->get_param( 'order' ) ? sanitize_text_field( $request->get_param( 'order' ) ) : 'asc';
		$orderby     = $request->get_param( 'orderby' ) ? sanitize_text_field( $request->get_param( 'orderby' ) ) : 'display_order';

		$query = Countries::orderBy( $orderby, $order );

		if ( $active_only ) {
			$query->where( 'is_active', true );
		}

		return $query->get();
	}

	/**
	 * Deletes a country based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function delete( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );
		try {
			$country = Countries::find( $id );
			if ( ! $country ) {
				return Messages::error_country_not_found();
			}

			// Check if country has basket prices
			if ( $country->basketPrices()->count() > 0 ) {
				return Messages::error_country_has_data();
			}

			$country->delete();
			return Messages::success_country_deleted();
		} catch ( \Exception $e ) {
			return Messages::error_country_deleted();
		}
	}

	/**
	 * Updates a country based on the provided request.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return array The response message.
	 */
	public function update( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		try {
			$country = Countries::find( $id );
			if ( ! $country ) {
				return Messages::error_country_not_found();
			}

			$update_data = array();

			if ( $request->get_param( 'name' ) !== null ) {
				$update_data['name'] = sanitize_text_field( $request->get_param( 'name' ) );
			}

			if ( $request->get_param( 'code' ) !== null ) {
				$update_data['code'] = sanitize_text_field( $request->get_param( 'code' ) );
			}

			if ( $request->get_param( 'display_order' ) !== null ) {
				$update_data['display_order'] = intval( $request->get_param( 'display_order' ) );
			}

			if ( $request->get_param( 'is_active' ) !== null ) {
				$update_data['is_active'] = (bool) $request->get_param( 'is_active' );
			}

			$country->update( $update_data );
			return Messages::success_country_updated();
		} catch ( \Exception $e ) {
			return Messages::error_country_updated();
		}
	}
}

