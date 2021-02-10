<div id="app">
    <div class="container mt-3">
        <?php if(isset($_GET['playlist'])):?>
            <video_list></video_list> 

        <?php else:?>
            <playlists></playlists>
        <?php endif;?>

        <div class="modal fade" id="myModal" role="dialog">
            <!-- <div class="modal-dialog modal-lg">
                <div class="content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" style="color:#fff; margin:0;">&times;</button>
                        <h4 class="modal-title" style="color:#fff;">{{$store.state.video.name}}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="c-video">
                            <video class="video-player" :src="$store.state.video.link" controls></video>
                        </div>
                    </div>
                </div>
            </div> -->
            <video_player></video_player>
        </div>
    </div>
</div>
<script src="<?php echo VIDEO_EMBED_URI.'assets/js/vue@2.6.11.js';?>"></script>
<script src="<?php echo VIDEO_EMBED_URI.'assets/js/vuex.js';?>"></script>
<script src="<?php echo VIDEO_EMBED_URI.'assets/js/axios.min.js';?>"></script>
<!-- <script src="<?php //echo VIDEO_EMBED_URI.'assets/js/vue-router.js';?>"></script> -->
</div>
