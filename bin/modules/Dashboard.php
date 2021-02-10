<?php
/**
 * @package video-embed
 */

namespace bin\modules;

class Dashboard{

    public function register()
    {   
        // adding admin page
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        //adding shortcode
        add_shortcode('video-embed', array($this,'client_page'));
        //adding ajax functions
        add_action('wp_ajax_video_embed_fields_options', array($this, 'video_embed_fields_options'));
        add_action('wp_ajax_select_sanitize', array($this, 'select_sanitize'));
    }

    //admin page function
    public function add_admin_menu()
    {
        add_menu_page('Video Embed', 'Video Embed', 'manage_options', 'video_embed', array($this, 'video_embed_admin_index'),'dashicons-format-video', 110);
    }

    //reference admin plugin page
    public function video_embed_admin_index()
    {
        require_once VIDEO_EMBED_DIR.'bin/views/template.php';
    }

    //reference client plugin page
    public function client_page()
    {
        require_once VIDEO_EMBED_DIR.'bin/views/theme.php';
    }

    public function select_sanitize()
    {
        if(isset($_POST['theme'])) {
            wp_send_json(update_option('video_embed_op', array('theme'=>$_POST['theme'])));
        }
    }

    public function video_embed_fields_options(){
        $path = realpath(VIDEO_EMBED_DIR.'/assets/themes/js');
        $themes = array_diff(scandir($path),array('.','..'));
        $theme = get_option('video_embed_op')['theme'];

        $list = array();

        array_push($list, array('name'=>'Choose an option...','value'=>''));
        foreach ($themes as $value) {
            $val = (strpos(basename($value,'.js'),'_') !== false) ? str_replace('_',' ',basename($value,'.js')) : basename($value,'.js');
            array_push($list,array('name'=>$val,'value'=> basename($value,'.js'), 'selected'=>($theme == $val)));          
        }
        wp_send_json($list);
    }
}