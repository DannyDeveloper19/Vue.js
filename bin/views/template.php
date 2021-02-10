<div class="wrap"> 
    <nav class="navbar bg-light">
        <div class="navbar-brand"><h1>Video Embed<h1></div>
        <nav class="navbar navbar-expand-sm justify-content-end">
            <ul class="navbar-nav">
                <li class="nav-item active"><a class="nav-link" href="?page=video_embed">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="?page=video_embed&view=galeries">Galeries</a></li>
                <li class="nav-item"><a class="nav-link" href="?page=video_embed&view=themes">Themes</a></li>
            </ul>
        </nav>
            </nav>
        <div id="app" class="text-center" style="margin-top: 20px;">
            <?php if(isset($_GET['view'])):?>
            
                <?php if($_GET['view'] === "galeries"):?>

                    <?php if(isset($_GET['new_playlist'])):?>
                        <new_playlist></new_playlist> 
                    <?php elseif(isset($_GET['playlist'])):?>
                        <playlist></playlist>
                    <?php else:?>
                        <table-list></table-list>  
                    <?php endif;?>

                <?php else:?>
                    <theme></theme>
                <?php endif;?>

            <?php else:?>
                <home></home>                
            <?php endif;?>           
        </div> 
</div>