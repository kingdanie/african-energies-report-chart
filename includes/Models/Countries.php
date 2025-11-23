<?php
/**
 * Class Countries
 *
 * Represents the Countries model for AERChartPlugin.
 *
 * @package AERChartPlugin\Models
 * @since 1.0.0
 */

namespace AERChartPlugin\Models;

use Prappo\WpEloquent\Database\Eloquent\Model;

/**
 * Class Countries
 *
 * Represents the Countries model for AERChartPlugin.
 *
 * @package AERChartPlugin\Models
 */
class Countries extends Model {

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'aer_countries';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = array(
		'name',
		'code',
		'display_order',
		'is_active',
		'created_at',
		'updated_at',
	);

	/**
	 * Get the basket prices for this country.
	 *
	 * @return \Prappo\WpEloquent\Database\Eloquent\Relations\HasMany
	 */
	public function basketPrices() {
		return $this->hasMany( BasketPrices::class, 'country_id' );
	}
}

