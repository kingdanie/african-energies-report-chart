<?php
/**
 * AERChartPlugin Routes
 *
 * Defines and registers custom API routes for the AERChartPlugin using the Haruncpi\WpApi library.
 *
 * @package AERChartPlugin\Routes
 */

namespace AERChartPlugin\Routes;

use AERChartPlugin\Libs\API\Route;

Route::prefix(
	AER_ROUTE_PREFIX,
	function ( Route $route ) {

		// Allow hooks to add more custom API routes.

		// Define commodities API routes.
		$route->get( '/commodities/get', '\AERChartPlugin\Controllers\Commodities\Actions@get' );
		$route->post( '/commodities/create', '\AERChartPlugin\Controllers\Commodities\Actions@create' );
		$route->post( '/commodities/delete', '\AERChartPlugin\Controllers\Commodities\Actions@delete' );
		$route->post( '/commodities/update', '\AERChartPlugin\Controllers\Commodities\Actions@update' );

		// Define basket prices API routes.
		$route->get( '/basket-prices/get', '\AERChartPlugin\Controllers\BasketPrices\Actions@get' );
		$route->post( '/basket-prices/create', '\AERChartPlugin\Controllers\BasketPrices\Actions@create' );
		$route->post( '/basket-prices/delete', '\AERChartPlugin\Controllers\BasketPrices\Actions@delete' );
		$route->post( '/basket-prices/update', '\AERChartPlugin\Controllers\BasketPrices\Actions@update' );

		// Define countries API routes.
		$route->get( '/countries/get', '\AERChartPlugin\Controllers\Countries\Actions@get' );
		$route->post( '/countries/create', '\AERChartPlugin\Controllers\Countries\Actions@create' );
		$route->post( '/countries/delete', '\AERChartPlugin\Controllers\Countries\Actions@delete' );
		$route->post( '/countries/update', '\AERChartPlugin\Controllers\Countries\Actions@update' );

		// Define basket price labels API routes.
		$route->get( '/basket-price-labels/get', '\AERChartPlugin\Controllers\BasketPriceLabels\Actions@get' );
		$route->post( '/basket-price-labels/update', '\AERChartPlugin\Controllers\BasketPriceLabels\Actions@update' );

		do_action( 'aer_api', $route );
	}
);
