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
 * Class BasketPrices
 *
 * Represents the migration for creating the 'basketpirces' table.
 *
 * @package AERChartPlugin\Database\Migrations
 */
class BasketPrices implements Migration {

	/**
	 * Table name for the migration.
	 *
	 * @var string
	 */
	private static $table = 'basketprices';

	/**
	 * Run the migrations.
	 */
	public static function up() {
		if ( Capsule::schema()->hasTable( self::$table ) ) {
			// Check if we need to migrate existing table structure
			if ( ! Capsule::schema()->hasColumn( self::$table, 'country_id' ) ) {
				// Add new columns for country-based structure
				Capsule::schema()->table(
					self::$table,
					function ( Blueprint $table ) {
						$table->unsignedBigInteger( 'country_id' )->nullable()->after( 'id' );
						$table->decimal( 'value_label_1', 10, 2 )->nullable()->after( 'setScore' );
						$table->decimal( 'value_label_2', 10, 2 )->nullable()->after( 'value_label_1' );
						$table->decimal( 'value_label_3', 10, 2 )->nullable()->after( 'value_label_2' );
						$table->index( 'country_id' );
						$table->index( 'day' );
					}
				);
			}
			return;
		}
		Capsule::schema()->create(
			self::$table,
			function ( Blueprint $table ) {
				$table->id();
				$table->unsignedBigInteger( 'country_id' );
				$table->date( 'day' );
				$table->decimal( 'value_label_1', 10, 2 ); // First data point (e.g., Crudeoil)
				$table->decimal( 'value_label_2', 10, 2 ); // Second data point (e.g., Gasoline)
				$table->decimal( 'value_label_3', 10, 2 ); // Third data point (e.g., NGX)
				// Keep setScore for backward compatibility, will be deprecated
				$table->decimal( 'setScore', 10, 2 )->nullable();
				$table->dateTime( 'created_at' )->nullable();
				$table->dateTime( 'updated_at' )->nullable();
				$table->index( 'country_id' );
				$table->index( 'day' );
				$table->unique( array( 'country_id', 'day' ) ); // One entry per country per day
			}
		);
	}

	/**
	 * Reverse the migrations.
	 */
	public static function down() {
		Schema::dropIfExists( self::$table );
	}
}
