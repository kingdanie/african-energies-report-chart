<?php
/**
 * Uninstall the plugin
 *
 * @package WordPress_Plugin_Boilerplate
 * @subpackage Database
 */

use AERChartPlugin\Database\Migrations\Commodities;
use AERChartPlugin\Database\Migrations\Countries;
use AERChartPlugin\Database\Migrations\BasketPriceLabels;
use AERChartPlugin\Database\Migrations\BasketPrices;

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

// delete tables from database which is created by this plugin.
BasketPrices::down();
BasketPriceLabels::down();
Commodities::down();
Countries::down();
