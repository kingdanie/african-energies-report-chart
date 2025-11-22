<?php
/**
 * Plugin Name: African Energies Report Chart Plugin
 * Description: A plugin that helps African Energies Report Admins to  manage price data and display on desired page using short codes.
 * Author: Danie D'mola
 * Author URI: https://github.com/kingdanie
 * License: GPLv2
 * Version: 1.0.0
 * Text Domain: aer-chart-plugin
 * Domain Path: /languages
 *
 * @package African Energies Report Chart Plugin
 */

use AERChartPlugin\Core\Install;

defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
require_once plugin_dir_path( __FILE__ ) . 'plugin.php';

/**
 * Initializes the AERChartPlugin plugin when plugins are loaded.
 *
 * @since 1.0.0
 * @return void
 */
function aer_chart_plugin_init() {
	AERChartPlugin::get_instance()->init();
}

// Hook for plugin initialization.
add_action( 'plugins_loaded', 'aer_chart_plugin_init' );

// Hook for plugin activation.
register_activation_hook( __FILE__, array( Install::get_instance(), 'init' ) );
