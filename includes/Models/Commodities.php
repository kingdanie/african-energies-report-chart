<?php
/**
 * Class Commodities
 *
 * Represents the Commodities model for AERChartPlugin.
 *
 * @package AERChartPlugin\Models
 * @since 1.0.0
 */

namespace AERChartPlugin\Models;

use Prappo\WpEloquent\Database\Eloquent\Model;

/**
 * Class Commodities
 *
 * Represents the Commodities model for AERChartPlugin.
 *
 * @package AERChartPlugin\Models
 */
class Commodities extends Model {

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'commodities';

	/**
	 * The primary key for the model.
	 *
	 * @var array
	 */
	protected $fillable = array(
		'name',
		'abbreviation',
		'prevPrice',
		'curPrice',
		'created_at',
		'updated_at',
	);
}
