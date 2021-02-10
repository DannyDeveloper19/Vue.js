// const router = new VueRouter({
//     mode: 'history',
//     base: location.pathname + location.search,
//     routes: [
//         { path: '/', Name: 'Playlists', component: Home, menu: true },
//         { path: '/playlist=:id', Name: 'Videos', component: Videos, menu: true }
//     ]
// });

const store = new Vuex.Store({
    state: {
        playlist_array: [],
        playlist: {
            id: '',
            name: ''
        },
        video: {
            name: '',
            link: ''
        }
    },
    mutations: {
        clear_list(state) {
            state.playlist_array = [];
            state.playlist_array.length = 0;
        },
        fill_playlist_arr(state, playlist) {
            state.playlist_array = [];
            state.playlist_array = playlist;
        },
        current_playlist(state, object) {
            state.playlist = object;
        }
    },
    actions: {
        get_playlist: async function({ commit }, object) {
            let data = new FormData();
            data.append('action', object.action)
            if (object.id != undefined) data.append('id', object.id)
            await axios({
                method: 'POST',
                url: theme.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {
                commit('fill_playlist_arr', res.data);
            }).catch(error => {
                console.log(error)
            })
        },
    }
})

const vue = new Vue({
    el: '#app',
    store: store,
});