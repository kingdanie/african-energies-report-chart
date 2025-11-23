<?php

namespace AERChartPlugin\Controllers\Countries;

/**
 * Class Messages
 *
 * Provides static methods to generate standardized messages related to countries actions.
 *
 * @package AERChartPlugin\Controllers\Countries
 */
class Messages {

	/**
	 * Returns a success message for country creation.
	 *
	 * @return array
	 */
	public static function success_country_created() {
		return array(
			'status'  => 'success',
			'message' => 'country created successfully',
		);
	}

	/**
	 * Returns an error message for country creation failure.
	 *
	 * @return array
	 */
	public static function error_country_created() {
		return array(
			'status'  => 'error',
			'message' => 'unable to create country',
		);
	}

	/**
	 * Returns a success message for country deletion.
	 *
	 * @return array
	 */
	public static function success_country_deleted() {
		return array(
			'status'  => 'success',
			'message' => 'country deleted successfully',
		);
	}

	/**
	 * Returns an error message for country deletion failure.
	 *
	 * @return array
	 */
	public static function error_country_deleted() {
		return array(
			'status'  => 'error',
			'message' => 'unable to delete country',
		);
	}

	/**
	 * Returns a success message for country update.
	 *
	 * @return array
	 */
	public static function success_country_updated() {
		return array(
			'status'  => 'success',
			'message' => 'country updated successfully',
		);
	}

	/**
	 * Returns an error message for country update failure.
	 *
	 * @return array
	 */
	public static function error_country_updated() {
		return array(
			'status'  => 'error',
			'message' => 'unable to update country',
		);
	}

	/**
	 * Returns an error message when country is not found.
	 *
	 * @return array
	 */
	public static function error_country_not_found() {
		return array(
			'status'  => 'error',
			'message' => 'country not found',
		);
	}

	/**
	 * Returns an error message when country has associated data.
	 *
	 * @return array
	 */
	public static function error_country_has_data() {
		return array(
			'status'  => 'error',
			'message' => 'cannot delete country with existing basket price data',
		);
	}
}

