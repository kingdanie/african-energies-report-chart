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
			return;
		}
		Capsule::schema()->create(
			self::$table,
			function ( Blueprint $table ) {
				$table->id();
				$table->string( 'day' );
				$table->decimal( 'setScore' );
				$table->dateTime( 'created_at' )->nullable();
				$table->dateTime( 'updated_at' )->nullable();
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
