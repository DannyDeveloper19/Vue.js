<?php
/**
 * @package video-embed
 * 
 * 
 */

 /*
 Plugin Name: Video Embed
 Plugin URI: https://localhost/
 Description: Video Embed is created with the aim of embedding videos, allowing the user to embed videos, both uploaded and coming from youtube and vimeo, in addition to allowing you to interact in a friendly environment appropriate to your expectations. 
 Version: 1.0
 Author: Danny Hernandez Simons
 Author URI: https://github.com/DannyDeveloper19
 License: GPLv2 or later
 Text Domain: video-embed
  */
  /*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Copyright 2005-2015 Automattic, Inc.
*/

define('VIDEO_EMBED_DIR',plugin_dir_path(__FILE__));
define('VIDEO_EMBED_URI', plugin_dir_url(__FILE__));
define('VIDEO_EMBED_NAME', plugin_basename(__FILE__));
define('VIDEO_EMBED',__FILE__);

if (! defined('ABSPATH')) die;

if(file_exists(dirname(VIDEO_EMBED).'/vendor/autoload.php'));
    require_once dirname(VIDEO_EMBED).'/vendor/autoload.php';

    if (class_exists('bin\\Init')) {
      bin\Init::init_services();
  }