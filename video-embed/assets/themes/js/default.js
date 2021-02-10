Vue.component('playlists', {
    template: `
        <ul class="list-group">
                <li class="list-group-item-site-border-out" v-for="(item,index) of playlist_array" :key="item.id" @click="get_videos_list(item.id)"  style="cursor:pointer;">
                    <div class="row">
                        <div class="col-sm-12 col-md-3 col-lg-3 text-center">
                            <div class="playlist"></div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 text-center">
                            <h3><span>{{item.name}}</span></h3>
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 text-center">
                            <span class="badge badge-info badge-pill">{{item.videos}}</span>
                        </div>
                    </div>
                </li>
            </ul>
    `,
    data() {
        return {

        }
    },
    methods: {
        ...Vuex.mapMutations(['current_playlist', 'clear_list']),
        ...Vuex.mapActions(['get_playlist']),
        get_videos_list(id) {
            var list = this.playlist_array.filter(item => {
                return (item['id'] == id) ? item : null;
            });
            if (list != null) {
                this.current_playlist({ id: list[0].id, name: list[0].name });
            }
            location.href = location.href + '?playlist=' + window.btoa(unescape(encodeURIComponent(id)));
        }
    },
    computed: {
        ...Vuex.mapState(['playlist_array', 'playlist']),
    },
    created() {
        this.clear_list();
        this.get_playlist({ action: 'get_playlists', id: '' })
    },
});

Vue.component('video_list', {
    template: `
            <ul class="list-group">
                <li class="list-group-item-site-border-out-2 list-group-item-action" v-for="(item,index) of playlist_array" :key="item.id">
                    <div class="row">
                        <div class="col-sm-12 col-md-2 col-lg-2 text-center">
                            <div class="video"></div>
                        </div>
                        <div class="col-sm-12 col-md-7 col-lg-7 text-center">
                            <span>{{item.name}}</span>
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 text-center">
                            <button id="toggle-btn" class="btn btn-outline-danger" @click="play_video(item.name, item.link)"><i class="fas fa-play"></i> Watch</button>
                        </div>
                    </div>
                </li>
            </ul>           
    `,
    data() {
        return {}
    },
    methods: {
        ...Vuex.mapMutations(['current_playlist', 'clear_list']),
        ...Vuex.mapActions(['get_playlist']),
        play_video(name, link) {
            this.video.name = name;
            this.video.link = link;
            $("#myModal").modal();
        }
    },
    computed: {
        ...Vuex.mapState(['playlist_array', 'playlist', 'video']),
    },
    created() {
        this.clear_list();
        var id = decodeURIComponent(escape(window.atob(location.search.split("=")[1])));
        this.playlist.id = id;
        this.get_playlist({ action: 'get_playlist_by_id', id: this.playlist.id })
    },
})

Vue.component('video_player', {
    template: `
        <div class="modal-dialog modal-lg">
            <!-- Modal content-->
            <div class="content">
                <div class="modal-header">
                    <button type="button" @click="close_player" class="close" style="color:#fff; margin:0;">&times;</button>
                    <h4 class="modal-title" style="color:#fff;">{{video.name}}</h4>
                </div>
                <div class="modal-body">
                    <div class="c-video" v-if="check_link(video.link)">
                    <iframe class="video-player" height="432" :src="video.link" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="c-video" v-else>
                        <video class="video-player" :src="video.link" controls></video>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            vimeo_youtube: false,
        }
    },
    methods: {
        close_player() {
            var player = document.querySelector('.video-player');
            if (player.localName == 'iframe') {
                var src = player.src;
                player.src = src;
            } else
                player.pause();

            $("#myModal").modal('hide');
        },
        check_link(link) {
            var provider = link.match(new RegExp(/https:\/\/(?:www.)?(?:(player.vimeo).com\/(.*)|(youtube).com\/(.*))/));
            return provider;
        }
    },
    computed: {
        ...Vuex.mapState(['video']),
    },
    beforeCreate() {
        // this.vimeo_youtube = this.video.link.match(/(?:http:|https:&)\/\/(?:www.)?(?:(vimeo).com\/(.*)|(youtube).com\/watch\?v=(.*?)&)/);
        // console.log(this.vimeo_youtube);
    },
    created() {
        // this.vimeo_youtube = this.video.link.match(/(?:http:|https:&)\/\/(?:www.)?(?:(vimeo).com\/(.*)|(youtube).com\/watch\?v=(.*?)&)/);
        // console.log(this.vimeo_youtube);
    },
})