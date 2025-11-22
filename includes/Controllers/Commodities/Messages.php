<?php

namespace AERChartPlugin\Controllers\Commodities;

/**
 * Class Messages
 *
 * Provides static methods to generate standardized messages related to commodities actions.
 *
 * @package AERChartPlugin\Controllers\Commodities
 */
class Messages {

	/**
	 * Returns a success message for commodity creation.
	 *
	 * @return array
	 */
	public static function success_commodity_created() {
		return array(
			'status'  => 'success',
			'message' => 'commodity created successfully',
		);
	}

	/**
	 * Returns an error message for commodity creation failure.
	 *
	 * @return array
	 */
	public static function error_commodity_created() {
		return array(
			'status'  => 'error',
			'message' => 'unable to create commodity',
		);
	}

	/**
	 * Returns a success message for commodity deletion.
	 *
	 * @return array
	 */
	public static function success_commodity_deleted() {
		return array(
			'status'  => 'success',
			'message' => 'commodity deleted successfully',
		);
	}

	/**
	 * Returns an error message for commodity deletion failure.
	 *
	 * @return array
	 */
	public static function error_commodity_deleted() {
		return array(
			'status'  => 'error',
			'message' => 'unable to delete commodity',
		);
	}

	/**
	 * Returns a success message for commodity update.
	 *
	 * @return array
	 */
	public static function success_commodity_updated() {
		return array(
			'status'  => 'success',
			'message' => 'commodity updated successfully',
		);
	}

	/**
	 * Returns an error message for commodity update failure.
	 *
	 * @return array
	 */
	public static function error_commodity_updated() {
		return array(
			'status'  => 'error',
			'message' => 'unable to update commodity',
		);
	}

	/**
	 * Returns an error message when commodity is not found.
	 *
	 * @return array
	 */
	public static function error_commodity_not_found() {
		return array(
			'status'  => 'error',
			'message' => 'commodity not found',
		);
	}
}

