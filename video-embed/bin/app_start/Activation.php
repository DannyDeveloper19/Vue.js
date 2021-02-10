<?php
/**
 * @package video-embed
 */

 namespace bin\app_start;
 
 class Activation
 {
    public function register()
    {
        register_activation_hook(VIDEO_EMBED, array($this,'activate'));

        register_deactivation_hook(VIDEO_EMBED, array($this,'deactivate'));
    }

    public static function activate()
    {
        //Creating option
        if (!get_option('video_embed_op')) {
            update_option('video_embed_op', array('theme'=>'default'));
        }

        global $wpdb;
        $db_name = $wpdb->dbname;
        $charset_collate = $wpdb->get_charset_collate();
        
    //Creating Playlist and videos table
       $table_name_1 = $wpdb->prefix . "video_embed_playlist";
       $table_name_2 = $wpdb->prefix . "video_embed_videos";

       if(count($wpdb->get_results("select * from information_schema.tables where table_schema='{$db_name}' and table_name='{$table_name_1}';")) == 0){
            $sql = "CREATE TABLE $table_name_1 (
                `id` varchar(50) NOT NULL,
                `name` varchar(50) NOT NULL,
                `description` varchar(250) NOT NULL,
                `state` int not null,
                PRIMARY KEY (`id`)
              ) $charset_collate;";

            //$wpdb->query($sql);
            require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
            dbDelta( $sql );

               $sql = "CREATE TABLE $table_name_2 (
                    `id` varchar(50) NOT NULL,
                    `name` varchar(50) NOT NULL,
                    `uploaded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    `link` varchar(50) NOT NULL,
                    `publish` tinyint(1) NOT NULL DEFAULT 1,
                    `playlist_id` varchar(50) NOT NULL,
                    PRIMARY KEY (`id`),
                    FOREIGN KEY (`playlist_id`) REFERENCES $table_name_1(`id`)
                  ) $charset_collate";

                dbDelta( $sql ); 
        }

            // $stored_procedure_name = $wpdb->prefix.'insert_playlist';

            // if (count($wpdb->get_results("show procedure status where db = '{$db_name}' and name = '{$stored_procedure_name}';")) == 0) {
            //     $sql="CREATE PROCEDURE $stored_procedure_name(in id varchar(50), in name varchar(50), in description varchar(250))
            //     BEGIN
            //     if id = '' then set id = uuid();end if;
            //         if not exists(select * from {$table_name} where proj_name COLLATE utf8mb4_0900_ai_ci = name or proj_folder COLLATE utf8mb4_0900_ai_ci = PATH or id COLLATE utf8mb4_0900_ai_ci = proj_id) then
            //         BEGIN
            //             insert into {$table_name}(id, name, description)
            //             values(id,name, description);
            //         END;
            //         else
            //             update {$table_name} as tb set tb.name = name, tb.description = description where id COLLATE utf8mb4_0900_ai_ci = proj_id;
            //         END IF;
            //     END";

            //     $wpdb->query($sql);
            // }
        flush_rewrite_rules();
    }

    public static function deactivate()
    {
        flush_rewrite_rules();
    }
 }