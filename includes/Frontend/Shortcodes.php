<?php

namespace AERChartPlugin\Frontend;

use AERChartPlugin\Libs\Utils\Shortcode;
use AERChartPlugin\Traits\Base;

/**
 * Class Shortcodes
 *
 * Handles frontend shortcode registration.
 *
 * @package AERChartPlugin\Frontend
 */
class Shortcodes {

	use Base;

	/**
	 * Initialize shortcodes.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'init', array( $this, 'register_shortcodes' ) );
	}

	/**
	 * Register all shortcodes.
	 *
	 * @return void
	 */
	public function register_shortcodes() {
		// Register commodities shortcode.
		Shortcode::add()
			->tag( 'aer_commodities' )
			->attrs( array() )
			->render( array( $this, 'render_commodities_shortcode' ) );

		// Register basket prices shortcode.
		Shortcode::add()
			->tag( 'aer_basket_prices' )
			->attrs( array() )
			->render( array( $this, 'render_basket_prices_shortcode' ) );
	}

	/**
	 * Render commodities shortcode.
	 *
	 * @param array  $atts Shortcode attributes.
	 * @param string $content Shortcode content.
	 * @return string
	 */
	public function render_commodities_shortcode( $atts, $content = null ) {
		// Mark that shortcodes are present.
		\AERChartPlugin\Assets\Frontend::mark_shortcode_present();

		$unique_id = 'aer-commodities-' . uniqid();

		return '<div id="' . esc_attr( $unique_id ) . '" class="aer-commodities-container" data-shortcode="commodities"></div>';
	}

	/**
	 * Render basket prices shortcode.
	 *
	 * @param array  $atts Shortcode attributes.
	 * @param string $content Shortcode content.
	 * @return string
	 */
	public function render_basket_prices_shortcode( $atts, $content = null ) {
		// Mark that shortcodes are present.
		\AERChartPlugin\Assets\Frontend::mark_shortcode_present();

		$unique_id = 'aer-basket-prices-' . uniqid();

		return '<div id="' . esc_attr( $unique_id ) . '" class="aer-basket-prices-container" data-shortcode="basket-prices"></div>';
	}
}

