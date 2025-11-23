<?php
/**
 * Database configuration using Eloquent ORM.
 *
 * @package AERChartPlugin
 * @subpackage Database
 */

namespace AERChartPlugin\Database\Seeders;

use Prappo\WpEloquent\Database\Capsule\Manager as Capsule;
/**
 * Class BasketPrices
 *
 * Represents the seeder for the 'basketprices' table.
 *
 * @package AERChartPlugin\Database\Seeders
 * @since 1.0.0
 */
class BasketPrices {
	private static $table = 'basketprices';

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public static function run() {

		// Insert data to the tables.
		$basketprices = array(
			array(
				'day' => '2025-09-1',
				'setScore' => 4000,
			),
			array(
				'day' => '2025-09-2',
				'setScore' => 3000,
			),
			array(
				'day' => '2025-09-3',
				'setScore' => 2000,
			),
			array(
				'day' => '2025-09-4',
				'setScore' => 2780,
			),
			array(
				'day' => '2025-09-5',
				'setScore' => 1890,
			),
			array(
				'day' => '2025-09-6',
				'setScore' => 2390,
			),
			array(
				'day' => '2025-09-7',
				'setScore' => 3490,
			),
			array(
				'day' => '2025-09-8',
				'setScore' => 2780,
			),
			array(
				'day' => '2025-09-9',
				'setScore' => 1890,
			),
			array(
				'day' => '2025-09-10',
				'setScore' => 2390,
			),
			array(
				'day' => '2025-09-11',
				'setScore' => 3490,
			),
			array(
				'day' => '2025-09-12',
				'setScore' => 2180,
			),
			array(
				'day' => '2025-09-13',
				'setScore' => 5890,
			),
			array(
				'day' => '2025-09-14',
				'setScore' => 390,
			),
			array(
				'day' => '2025-09-15',
				'setScore' => 3490,
			),
			array(
				'day' => '2025-09-16',
				'setScore' => 4000,
			),
			array(
				'day' => '2025-09-17',
				'setScore' => 3000,
			),
			array(
				'day' => '2025-10-18',
				'setScore' => 2000,
			),
			array(
				'day' => '2025-10-19',
				'setScore' => 2780,
			),
			array(
				'day' => '2025-10-20',
				'setScore' => 1890,
			),
			array(
				'day' => '2025-10-21',
				'setScore' => 2390,
			),
			array(
				'day' => '2025-10-22',
				'setScore' => 3490,
			),
			array(
				'day' => '2025-10-23',
				'setScore' => 2780,
			),
			array(
				'day' => '2025-10-24',
				'setScore' => 1890,
			),
			array(
				'day' => '2025-10-25',
				'setScore' => 2390,
			),
			array(
				'day' => '2025-10-26',
				'setScore' => 3490,
			),
			array(
				'day' => '2025-10-27',
				'setScore' => 2180,
			),
			array(
				'day' => '2025-10-28',
				'setScore' => 5890,
			),
			array(
				'day' => '2025-10-29',
				'setScore' => 390,
			),
			array(
				'day' => '2025-10-30',
				'setScore' => 3490,
			),
			array(
				'day' => '2025-10-31',
				'setScore' => 4000,
			)
		);

		foreach ( $basketprices as $basketprice ) {
				\AERChartPlugin\Models\BasketPrices::create( $basketprice );
			
		}
	}
}
