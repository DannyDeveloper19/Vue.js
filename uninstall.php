<?php
/**
 * Trigger this file on Plugin uninstall
 * @package video-embed
 */

 if(!defined('WP_UNINSTALL_PLUGIN')) die;

 //Access the wordpress database via SQL;
 global $wpdb;
 $table_name_1 = $wpdb->prefix . "video-embed-playlist";
 $table_name_2 = $wpdb->prefix . "video-embed-videos";

 //Drop table created
if($wpdb->query("DROP TABLE IF EXISTS {$table_name_2}")){
    //Drop stored procedure created
    $wpdb->query("DROP TABLE IF EXISTS {$table_name_1}");
}
 