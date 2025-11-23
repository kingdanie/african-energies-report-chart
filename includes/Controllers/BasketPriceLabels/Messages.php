<?php

namespace AERChartPlugin\Controllers\BasketPriceLabels;

/**
 * Class Messages
 *
 * Provides static methods to generate standardized messages related to basket price labels actions.
 *
 * @package AERChartPlugin\Controllers\BasketPriceLabels
 */
class Messages {

	/**
	 * Returns a success message for label update.
	 *
	 * @return array
	 */
	public static function success_label_updated() {
		return array(
			'status'  => 'success',
			'message' => 'label updated successfully',
		);
	}

	/**
	 * Returns an error message for label update failure.
	 *
	 * @return array
	 */
	public static function error_label_updated() {
		return array(
			'status'  => 'error',
			'message' => 'unable to update label',
		);
	}

	/**
	 * Returns an error message when label is not found.
	 *
	 * @return array
	 */
	public static function error_label_not_found() {
		return array(
			'status'  => 'error',
			'message' => 'label not found',
		);
	}
}

