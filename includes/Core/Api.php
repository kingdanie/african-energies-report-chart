<?php

namespace AERChartPlugin\Core;

use AERChartPlugin\Traits\Base;
use AERChartPlugin\Libs\API\Config;

/**
 * Class API
 *
 * Initializes and configures the API for the AERChartPlugin.
 *
 * @package AERChartPlugin\Core
 */
class API {

	use Base;

	/**
	 * Initializes the API for the AERChartPlugin.
	 *
	 * @return void
	 */
	public function init() {
		Config::set_route_file( AER_DIR . '/includes/Routes/Api.php' )
			->set_namespace( 'AERChartPlugin\Api' )
			->init();
	}
}
