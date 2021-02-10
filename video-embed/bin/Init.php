<?php
/**
 * @package video-embed
 */

namespace bin;

final class Init
 {
     /**
      * Store all classes inside an array.
      * @return an array full list of classes  
      */
     public static function get_services()
     {
         return [
             
            app_start\Activation::class,
            app_start\Enqueue::class,
            modules\Dashboard::class,
            modules\AdminController::class,
        ];
     }

     /**
      * Loop through the classes, initialize them and call the register() method
      */
    public static function init_services()
    {
        foreach (self::get_services() as $class) {
            $service = self::instantiate($class);
            if(method_exists($service, 'register')){
                $service->register();
            }
        }
    }

    /**
     * Initialize the class
     * @param class from the services array
     * @return new class instance.
     */
    private static function instantiate($class)
    {
        return new $class();
    }
 }