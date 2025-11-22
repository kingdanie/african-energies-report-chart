<?php
/**
 * Class BasketPriceLabels
 *
 * Represents the BasketPriceLabels model for AERChartPlugin.
 *
 * @package AERChartPlugin\Models
 * @since 1.0.0
 */

namespace AERChartPlugin\Models;

use Prappo\WpEloquent\Database\Eloquent\Model;

/**
 * Class BasketPriceLabels
 *
 * Represents the BasketPriceLabels model for AERChartPlugin.
 * Stores the 3 data point labels (e.g., Crudeoil, Gasoline, NGX) that can be renamed globally.
 *
 * @package AERChartPlugin\Models
 */
class BasketPriceLabels extends Model {

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'aer_basket_price_labels';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = array(
		'label_key',
		'name',
		'display_order',
		'color',
		'created_at',
		'updated_at',
	);
}

