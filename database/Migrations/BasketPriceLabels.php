<?php
/**
 * Database configuration using Eloquent ORM.
 *
 * @package AERChartPlugin
 * @subpackage Database
 * @since 1.0.0
 */

namespace AERChartPlugin\Database\Migrations;

use AERChartPlugin\Interfaces\Migration;
use Prappo\WpEloquent\Database\Capsule\Manager as Capsule;
use Prappo\WpEloquent\Database\Schema\Blueprint;
use Prappo\WpEloquent\Support\Facades\Schema;

/**
 * Class BasketPriceLabels
 *
 * Represents the migration for creating the 'basket_price_labels' table.
 * This table stores the 3 data point labels (e.g., Crudeoil, Gasoline, NGX) that can be renamed globally.
 *
 * @package AERChartPlugin\Database\Migrations
 */
class BasketPriceLabels implements Migration {

	/**
	 * Table name for the migration.
	 *
	 * @var string
	 */
	private static $table = 'aer_basket_price_labels';

	/**
	 * Run the migrations.
	 */
	public static function up() {
		if ( Capsule::schema()->hasTable( self::$table ) ) {
			return;
		}
		Capsule::schema()->create(
			self::$table,
			function ( Blueprint $table ) {
				$table->id();
				$table->string( 'label_key', 50 )->unique(); // 'label_1', 'label_2', 'label_3'
				$table->string( 'name' ); // Display name like 'Crudeoil', 'Gasoline', 'NGX'
				$table->integer( 'display_order' )->default( 0 );
				$table->string( 'color', 7 )->nullable(); // Hex color for chart lines
				$table->dateTime( 'created_at' )->nullable();
				$table->dateTime( 'updated_at' )->nullable();
			}
		);

		// Insert default labels
		$now = date( 'Y-m-d H:i:s' );
		Capsule::table( self::$table )->insert( array(
			array(
				'label_key'      => 'label_1',
				'name'           => 'Crudeoil',
				'display_order'  => 1,
				'color'          => '#10b981', // green
				'created_at'     => $now,
				'updated_at'     => $now,
			),
			array(
				'label_key'      => 'label_2',
				'name'           => 'Gasoline',
				'display_order'  => 2,
				'color'          => '#3b82f6', // light blue
				'created_at'     => $now,
				'updated_at'     => $now,
			),
			array(
				'label_key'      => 'label_3',
				'name'           => 'NGX',
				'display_order'  => 3,
				'color'          => '#6366f1', // dark blue/purple
				'created_at'     => $now,
				'updated_at'     => $now,
			),
		) );
	}

	/**
	 * Reverse the migrations.
	 */
	public static function down() {
		Schema::dropIfExists( self::$table );
	}
}

