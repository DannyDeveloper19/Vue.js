<?php
/**
 * @package video-embed
 */

require(dirname(__FILE__,6)."/wp-load.php");
 
if (isset($_POST)) {
    switch ($_POST['action']) {
        case 'get_playlists':
            global $wpdb;
            $table_1 = $wpdb->prefix.'video_embed_playlist';
            $table_2 = $wpdb->prefix.'video_embed_videos';
            $sql = "SELECT P.*,
                    (SELECT count(*) FROM {$table_2} V WHERE V.playlist_id = P.id AND V.publish = 1) as videos 
                    FROM {$table_1} P WHERE P.state = 1 ORDER BY videos DESC;";
            $data = $wpdb->get_results($sql);
            echo json_encode($data);
            break;
        case 'get_playlist_by_id':
            $id = $_POST['id'];
            global $wpdb;
            $table_2 = $wpdb->prefix.'video_embed_videos';

            $sql = "SELECT V.* FROM {$table_2} V WHERE playlist_id = '{$id}' AND publish = 1 ORDER BY V.uploaded ASC;";
            $data = $wpdb->get_results($sql);
            echo json_encode($data);
            break;
        default:
            # code...
            break;
    }
}

        

