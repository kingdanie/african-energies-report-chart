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
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = array(
		'country_id',
		'day',
		'value_label_1',
		'value_label_2',
		'value_label_3',
		'setScore', // Keep for backward compatibility
		'created_at',
		'updated_at',
	);

	/**
	 * Get the country that owns the basket price.
	 *
	 * @return \Prappo\WpEloquent\Database\Eloquent\Relations\BelongsTo
	 */
	public function country() {
		return $this->belongsTo( Countries::class, 'country_id' );
	}
}
