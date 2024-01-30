<?php
/*
    Plugin Name: Calendly UTM
    Description: This plugin store coockies and update links for calendly-js links
    Version: 2.0.3
    Author: Aleksandr Zanko 
    Author URI: https://enway.com/
    License: GPL2
   */

add_action('wp_enqueue_scripts', 'calendly_utm');

function calendly_utm()
{
    wp_enqueue_script('calendly_js', plugins_url('js/main.js', __FILE__));
}
