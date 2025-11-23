<?php
/**
 * Database configuration using Eloquent ORM.
 *
 * @package AERChartPlugin
 * @subpackage Database
 */

namespace AERChartPlugin\Database\Seeders;

/**
 * Class Countries
 *
 * Represents the seeder for the 'aer_countries' table.
 *
 * @package AERChartPlugin\Database\Seeders
 * @since 1.0.0
 */
class Countries {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public static function run() {

		// Insert Nigeria as default country if it doesn't exist
		if ( ! \AERChartPlugin\Models\Countries::where( 'name', 'Nigeria' )->exists() ) {
			\AERChartPlugin\Models\Countries::create(
				array(
					'name'          => 'Nigeria',
					'code'          => 'NGA',
					'display_order' => 1,
					'is_active'     => true,
					'created_at'    => gmdate( 'Y-m-d H:i:s' ),
					'updated_at'    => gmdate( 'Y-m-d H:i:s' ),
				)
			);
		}
	}
}

