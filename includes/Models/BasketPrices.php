<?php
/**
 * Class BasketPrices
 *
 * Represents the BasketPrices model for AERChartPlugin.
 *
 * @package AERChartPlugin\Models
 * @since 1.0.0
 */

namespace AERChartPlugin\Models;

use Prappo\WpEloquent\Database\Eloquent\Model;

/**
 * Class BasketPrices
 *
 * Represents the BasketPrices model for AERChartPlugin.
 *
 * @package AERChartPlugin\Models
 */
class BasketPrices extends Model {

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'basketprices';

	/**
	 * The primary key for the model.
	 *
	 * @var array
	 */
	protected $fillable = array(
		'day',
		'setScore',
		'created_at',
		'updated_at',
	);
}
