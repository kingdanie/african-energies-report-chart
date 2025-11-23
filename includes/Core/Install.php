<?php

namespace AERChartPlugin\Core;

use AERChartPlugin\Database\Migrations\Commodities;
use AERChartPlugin\Database\Migrations\Countries;
use AERChartPlugin\Database\Migrations\BasketPriceLabels;
use AERChartPlugin\Database\Migrations\BasketPrices;
use AERChartPlugin\Database\Seeders\Countries as SeedersCountries;
use AERChartPlugin\Traits\Base;

/**
 * This class is responsible for the functionality
 * which is required to set up after activating the plugin
 */
class Install {


	use Base;

	/**
	 * Initialize the class
	 *
	 * @return void
	 */
	public function init() {

		$this->install_pages();
		$this->install_tables();
		$this->insert_data();
	}

	/**
	 * Install the pages
	 *
	 * @return void
	 */
	private function install_pages() {
		aer_install_page(
			Template::FRONTEND_TEMPLATE_NAME,
			Template::FRONTEND_TEMPLATE_SLUG,
			Template::FRONTEND_TEMPLATE
		);
	}

	/**
	 * Install the tables
	 *
	 * @return void
	 */
	private function install_tables() {
		Commodities::up();
		Countries::up();
		BasketPriceLabels::up();
		BasketPrices::up(); // Run after Countries and Labels
	}

	/**
	 * Insert data to the tables
	 *
	 * @return void
	 */
	private function insert_data() {
		// Insert data to the tables.
		SeedersCountries::run(); // Seed Nigeria as default country
	}
}
