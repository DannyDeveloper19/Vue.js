<?php
/**
 * @package video-embed
 */

namespace bin\app_start;

class Enqueue{
    public function register()
    {
        //Admin site
        if(isset($_GET['page']) && $_GET['page'] === 'video_embed'){
            add_action('admin_enqueue_scripts',array($this, 'admin_enqueue'));
            add_filter('plugin_action_links_'.VIDEO_EMBED_NAME, array($this, 'settings_link'));
        }
        
        //Client site
        add_action('wp_enqueue_scripts',array($this, 'client_enqueue'));
    }

    function admin_enqueue()
    {
        wp_enqueue_script( 'media-upload' );
		wp_enqueue_media();
        wp_enqueue_style('ve_bootstrap', VIDEO_EMBED_URI.'assets/css/bootstrap.min.css');
        wp_enqueue_style('ve_bootstrap_vue', VIDEO_EMBED_URI.'assets/css/bootstrap.checkbox.css');
        wp_enqueue_style('ve_fontawesome',VIDEO_EMBED_URI.'assets/fontawesome/css/all.css');

        wp_enqueue_script('ve_vuescript', VIDEO_EMBED_URI.'assets/js/vue@2.6.11.js',array('jquery'),'0',true);
        wp_enqueue_script('ve_vuexscript', VIDEO_EMBED_URI.'assets/js/vuex.js',array('jquery'),'0',true);
        // wp_enqueue_script('ve_vue_router', VIDEO_EMBED_URI.'assets/js/vue-router.js',array('jquery'),'0',true);
        wp_enqueue_script('ve_axios_js', VIDEO_EMBED_URI.'assets/js/axios.min.js',array('jquery'),'0',true);
        wp_enqueue_script('ve_bootstrap_js', VIDEO_EMBED_URI.'assets/js/bootstrap.min.js',array('jquery'),'1',true);
        // wp_enqueue_script('base64_js', VIDEO_EMBED_URI.'assets/js/base64.js',array('jquery'),'1',true);
        wp_enqueue_script('ve_pluginscript',VIDEO_EMBED_URI.'assets/js/index.js',array('jquery'),'1',true);
        wp_enqueue_script('ve_vuepluginscript',VIDEO_EMBED_URI.'assets/js/application.js',array('jquery'),'1',true);
        wp_localize_script('ve_vuepluginscript', 'admin', array('ajax_url' => admin_url('admin-ajax.php')));
    }

    function client_enqueue()
    {
        wp_enqueue_style('ve_bootstrap', VIDEO_EMBED_URI.'assets/css/bootstrap.min.css');
        // wp_enqueue_style('bootstrap_vue', VIDEO_EMBED_URI.'assets/css/bootstrap-vue.min.css');
        wp_enqueue_style('ve_bootstrap_check', VIDEO_EMBED_URI.'assets/css/bootstrap.checkbox.css');
        wp_enqueue_style('ve_fontawesome',VIDEO_EMBED_URI.'assets/fontawesome/css/all.css');
        wp_enqueue_script('ve_jquery_js', VIDEO_EMBED_URI.'assets/js/jquery.js',array('jquery'),'0',true);
        wp_enqueue_script('ve_bootstrap_js', VIDEO_EMBED_URI.'assets/js/bootstrap.min.js',array('jquery'),'1',true);
        //wp_enqueue_style('index', VIDEO_EMBED_URI.'assets/css/index.css');
        $theme = get_option('video_embed_op');
        wp_enqueue_style('ve_theme_style',VIDEO_EMBED_URI.'assets/themes/css/'.$theme['theme'].'.css');
        wp_enqueue_script('ve_theme_script', VIDEO_EMBED_URI.'assets/themes/js/'.$theme['theme'].'.js',array('jquery'),'0',true);

        wp_enqueue_script('ve_theme_logic', VIDEO_EMBED_URI.'assets/js/client_main.js',array('jquery'),'1',true);
        wp_localize_script('ve_theme_logic', 'theme', array('ajax_url'=>VIDEO_EMBED_URI.'bin/modules/ClientController.php'));
    }
    
    public function settings_link($links)
    {
        //add custom setting link
        $settings_links = '<a href="admin.php?page=video_embed">Settings</a>';
        array_push($links, $settings_links);
        return $links;
    }
}