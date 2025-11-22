<?php

namespace AERChartPlugin\Controllers\BasketPrices;

/**
 * Class Messages
 *
 * Provides static methods to generate standardized messages related to basket prices actions.
 *
 * @package AERChartPlugin\Controllers\BasketPrices
 */
class Messages {

	/**
	 * Returns a success message for basket price creation.
	 *
	 * @return array
	 */
	public static function success_basket_price_created() {
		return array(
			'status'  => 'success',
			'message' => 'basket price created successfully',
		);
	}

	/**
	 * Returns an error message for basket price creation failure.
	 *
	 * @return array
	 */
	public static function error_basket_price_created() {
		return array(
			'status'  => 'error',
			'message' => 'unable to create basket price',
		);
	}

	/**
	 * Returns a success message for basket price deletion.
	 *
	 * @return array
	 */
	public static function success_basket_price_deleted() {
		return array(
			'status'  => 'success',
			'message' => 'basket price deleted successfully',
		);
	}

	/**
	 * Returns an error message for basket price deletion failure.
	 *
	 * @return array
	 */
	public static function error_basket_price_deleted() {
		return array(
			'status'  => 'error',
			'message' => 'unable to delete basket price',
		);
	}

	/**
	 * Returns a success message for basket price update.
	 *
	 * @return array
	 */
	public static function success_basket_price_updated() {
		return array(
			'status'  => 'success',
			'message' => 'basket price updated successfully',
		);
	}

	/**
	 * Returns an error message for basket price update failure.
	 *
	 * @return array
	 */
	public static function error_basket_price_updated() {
		return array(
			'status'  => 'error',
			'message' => 'unable to update basket price',
		);
	}

	/**
	 * Returns an error message when basket price is not found.
	 *
	 * @return array
	 */
	public static function error_basket_price_not_found() {
		return array(
			'status'  => 'error',
			'message' => 'basket price not found',
		);
	}

	/**
	 * Returns an error message when basket price already exists.
	 *
	 * @return array
	 */
	public static function error_basket_price_exists() {
		return array(
			'status'  => 'error',
			'message' => 'basket price already exists for this country and date',
		);
	}
}

