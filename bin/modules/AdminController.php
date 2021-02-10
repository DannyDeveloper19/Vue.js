<?php
/**
 * @package video-embed
 */

namespace bin\modules;

class AdminController{
    
    public function register()
    {    
        add_action('wp_ajax_new_playlist', array($this, 'new_playlist'));
        add_action('wp_ajax_get_playlists', array($this, 'get_playlists'));
        add_action('wp_ajax_update_playlist_state', array($this, 'update_playlist_state'));
        add_action('wp_ajax_get_playlist_by_id', array($this, 'get_playlist_by_id'));
        add_action('wp_ajax_insert_video_in_playlist', array($this, 'insert_video_in_playlist'));
        add_action('wp_ajax_delete_playlist', array($this,'delete_playlist'));
        add_action('wp_ajax_delete_video', array($this,'delete_video'));
        add_action('wp_ajax_hide_show_video', array($this,'hide_show_video'));
    }

    public function new_playlist()
    {
        if (isset($_POST)) {
            $name = $_POST['name'];
            $description = $_POST['description'];

            global $wpdb;
            $table = $wpdb->prefix.'video_embed_playlist';
        if(count($wpdb->get_results("SELECT id from {$table} where name = '{$name}';")) == 0){
            $sql = "INSERT INTO {$table}(id, name, description, state) values(uuid(), '{$name}', '{$description}',2)";
            if ($wpdb->query($sql)) {
                $id = $wpdb->get_results("SELECT id from {$table} where name = '{$name}';");
                echo $id[0]->id;
            }
        }else{
            wp_send_json(false);
        }
            

        }
    }

    public function get_playlists()
    {
        global $wpdb;
        $table_1 = $wpdb->prefix.'video_embed_playlist';
        $table_2 = $wpdb->prefix.'video_embed_videos';
        $sql = "SELECT P.*,
                (SELECT count(*) FROM {$table_2} V WHERE V.playlist_id = P.id ) as videos 
                FROM {$table_1} P ORDER BY videos DESC;";
        $data = $wpdb->get_results($sql);
        wp_send_json($data);
    }

    public function get_playlist_by_id()
    {
        if (isset($_POST)) {
            $id = $_POST['id'];
            global $wpdb;
            $table_2 = $wpdb->prefix.'video_embed_videos';

            $sql = "SELECT V.* FROM {$table_2} V WHERE playlist_id = '{$id}' ORDER BY V.uploaded ASC;";
            $data = $wpdb->get_results($sql);
            wp_send_json($data);
        }
    }

    public function update_playlist_state()
    {
        if (isset($_POST['data'])) {
            $data = json_decode(stripcslashes($_POST['data']));
            $state = $_POST['state'];
            global $wpdb;
            $table = $wpdb->prefix.'video_embed_playlist';
            $updated = 0;
            foreach ($data as $value) {
            $sql = "UPDATE {$table} P SET P.state = {$state} WHERE P.id = '{$value}'";
                if($wpdb->query($sql)){
                    $updated += 1;
                }
            }
            if($updated == count($data)){
                wp_send_json(true);
            }else{
                wp_send_json(false);
            }
        }
    }

    public function insert_video_in_playlist()
    {
        if (isset($_POST)) {
            $video = $_POST['video'];
            $link = $_POST['link'];
            $playlist_id = $_POST['playlist_id'];
            global $wpdb;
            $table = $wpdb->prefix.'video_embed_videos';
            $sql = "INSERT INTO {$table}(id, name, link, playlist_id) values(uuid(), '{$video}', '{$link}','{$playlist_id}')";
            if ($wpdb->query($sql)) {
                wp_send_json(true);
            } else {
                wp_send_json(false);
            }
        }
    }

    public function delete_playlist(){
        if (isset($_POST['data'])) {
            $data = json_decode(stripcslashes($_POST['data']));
            $deleted = 0;
            global $wpdb;
            $pTable = $table = $wpdb->prefix.'video_embed_playlist';
            $vTable = $wpdb->prefix.'video_embed_videos';

            foreach ($data as $value) {
                $nVideos = $wpdb->get_results("SELECT count(*) FROM {$vTable} V WHERE V.playlist_id = '{$value}'");
                if( (int)$nVideos[0] > 0){
                    $sql = "DELETE FROM {$vTable} where playlist_id = '{$value}'";
                    if($wpdb->query($sql)){
                        $sql = "DELETE FROM {$pTable} where id = '{$value}'";
                        if ($wpdb->query($sql)) 
                            $deleted++;
                    }
                }else{
                    $sql = "DELETE FROM {$pTable} where id = '{$value}'";
                    if ($wpdb->query($sql)) {
                        $deleted++;
                    }
                }
            }
            if($deleted == count($data)){
                wp_send_json(true);
            }else{
                wp_send_json(false);
            }
        }
    }

    public function delete_video(){
        if (isset($_POST['data'])) {
            $data = json_decode(stripcslashes($_POST['data']));
            global $wpdb;
            $table = $wpdb->prefix.'video_embed_videos';
            $updated = 0;
            foreach ($data as $value) {
                $sql = "DELETE FROM {$table} where id = '{$value}'";
                if($wpdb->query($sql)){
                    $updated += 1;
                }
            }
            if($updated == count($data)){
                wp_send_json(true);
            }else{
                wp_send_json(false);
            }
        }        
    }
    
    public function hide_show_video()
    {
        if (isset($_POST['data'])) {
            $data = json_decode(stripcslashes($_POST['data']));
            $state = $_POST['state'];
            global $wpdb;
            $vTable = $wpdb->prefix.'video_embed_videos';
            $updated = 0;
            foreach ($data as $value) {
            $sql = "UPDATE {$vTable} V SET V.publish = {$state} WHERE V.id = '{$value}'";
                if($wpdb->query($sql)){
                    $updated += 1;
                }
            }
            if($updated == count($data)){
                wp_send_json(true);
            }else{
                wp_send_json(false);
            }
        }
    }
}