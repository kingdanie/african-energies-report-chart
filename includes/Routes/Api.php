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

		// Define accounts API routes.

		$route->post( '/accounts/create', '\AERChartPlugin\Controllers\Accounts\Actions@create' );
		$route->get( '/accounts/get', '\AERChartPlugin\Controllers\Accounts\Actions@get' );
		$route->post( '/accounts/delete', '\AERChartPlugin\Controllers\Accounts\Actions@delete' );
		$route->post( '/accounts/update', '\AERChartPlugin\Controllers\Accounts\Actions@update' );

		// Posts routes.
		$route->get( '/posts/get', '\AERChartPlugin\Controllers\Posts\Actions@get_all_posts' );
		$route->get( '/posts/get/{id}', '\AERChartPlugin\Controllers\Posts\Actions@get_post' );
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


		do_action( 'aer_api', $route );
	}
);
