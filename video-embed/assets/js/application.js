/**
 * Alert child Component
 */
Vue.component('alert', {
    template: `
        <div>
            <div id="message2" v-if="message.msg !== ''" :class="{'error notice is-dismissible': message.type === 'error', 'updated notice is-dismissible': message.type !== 'error'}">
                <p style="text-align: initial;">{{message.msg}}</p>
                <button type="button" class="notice-dismiss" @click="clear_message"><span class="screen-reader-text">Dismiss this notice.</span></button>
            </div>
        </div>
    `,
    methods: {
        ...Vuex.mapMutations(['alert_message']),
        clear_message() {
            this.alert_message({ msg: '', type: '' });
        }
    },
    computed: {
        ...Vuex.mapState(['message']),
    },
})

/**
 * Themes view
 */
Vue.component('theme', {
    template: `
        <div>
            <div class="row">
                <div class="col-12 col-md-12 col-sm-12">
                    <alert></alert>            
                </div>
                <div class="col-3"></div>
                <div class="col-6 col-md-6 col-sm-12" style="border: #dbdbdb 1px solid;border-radius: 10px;background: #f8f9fa!important;">
                        <div class="form-row" style="padding: 15px 0 10px;">
                            <div class="col-3">
                                <label for="email"><b>Themes Options</b></label>
                            </div>
                            <div class="col-6">
                                <select class="browser-default custom-select custom-select-sm" name="theme" v-model="theme" @change="change_theme">
                                    <option v-for="(item, index) of themes" :key="item.value" :value="item.value" :disabled="index==0">{{item.name}}</option>
                                </select>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-primary" @click="update_theme">Save Theme</button>
                            </div>
                        </div>
                </div>
                <div class="col-3"></div>
            
                <div class="col-lg-4 col-md-4 col-sm-12">
                    
                </div>
                <div class="col-lg-8 col-md-8 col-sm-12" style="height:100vh;background:#f8f9fa; margin-top:10px;"></div>
            </div>
        </div>
    `,
    data() {
        return {
            theme: '',
        }
    },
    methods: {
        ...Vuex.mapActions(['get_themes', 'update_theme']),
        ...Vuex.mapMutations(['set_current_theme', 'get_current_theme']),
        get_theme() {
            this.theme = this.current_theme;
        },
        change_theme() {
            if (this.theme != '')
                this.set_current_theme(this.theme);
        }
    },
    computed: {
        ...Vuex.mapState(['themes', 'current_theme'])
    },
    created() {
        this.get_themes();
    },
    beforeUpdate() {
        this.change_theme();
    },
    updated() {
        this.get_themes();
        this.get_theme();
    },
})

/**
 * View Home
 */
Vue.component('home', {
    template: `
        <div>
            <h1>Welcome</h1> 

            <div>
            <span>Copy this shortcode in the page <code>[video-embed]</code></span>        
            </div>
        </div>
    `,
    data() {
        return {

        }
    },
});

/**
 * Component table
 */
Vue.component('table-list', {
    template: `
        <div>  
            <alert></alert>        
            <ul class="nav nav-pills">
                <li class="nav-item" v-for="(item, index) of options_playlist"><button :class="{'btn btn-primary': index === 0, 'btn btn-link': index !== 0}" :id="item.name.toLowerCase()" :disabled="item.quantity == 0" @click="by_state(item.state)">{{item.name}} ({{item.quantity}})</button></li>
            </ul>
            <div class=" mb-4">
                <div class="float-left mr-3">
                    <button class="btn btn-outline-primary" @click="new_list">Create new list</button>
                </div>
                <div class="float-left mr-3">
                    <select name="actions" class="custom-select" v-model="action" id="options">
                        <option v-for="(item, index) of actions" :key="item.value" v-if="item.value !== 'trash' && state == 3 || state !== 3 && item.value !== 'delete'" :value="item.value" :selected="index === 0" :disabled="index === 0 || index === 1 && selectAll && selected.length > 1 || index === 1 && selected.length > 1">{{item.name}}</option>
                    </select>
                </div>
                <div class="float-left mr-3">                
                    <button class="btn btn-outline-primary" @click="apply">Apply</button>
                </div>
                <form class="form-inline float-right my-2 my-lg-2">
                    <div>
                        <input type="search" class="form-control" v-model="filter_playlists" name="search" placeholder="Search">
                    <div>
                </form>
            </div>
            <table class="table table-hover">
                <thead v-if="cols.length > 0" class="thead-dark">
                    <tr>
                        <th>
                            <div class="custom-control custom-checkbox checkbox checkbox-primary">
                                <input type="checkbox" class="custom-control-input" id="select_all" v-model="selectAll">
                                <label class="custom-control-label" for="select_all"></label>
                            </div>
                        </th>
                        <th v-for="col of cols" :key="col" v-if=" col !== 'id' && col !== 'state'">
                            <span>{{col}}</span>
                        </th>
                    </tr>
                </thead>
                <thead class="thead-dark" v-else>
                    <th>
                        <div class="custom-control custom-checkbox checkbox checkbox-primary">
                            <input type="checkbox" class="custom-control-input" id="select_all" disabled>
                            <label class="custom-control-label" for="select_all"></label>
                        </div>
                    </th>
                    <th>
                        <span>name</span>
                    </th>
                    <th>
                        <span>description</span>
                    </th>
                    <th>
                        <span>videos</span>
                    </th>
                </thead>
                <tbody v-if="rows.length > 0">
                    <tr class="table-light" v-for="row of rows" :key="row.id">
                        <td>
                            <div class="custom-control custom-checkbox checkbox checkbox-primary">
                                <input type="checkbox" class="custom-control-input" :id="row.id" v-on:click="isSelected(row.id, row.name, event)">
                                <label class="custom-control-label" :for="row.id""></label>
                            </div>
                        </td>
                        <td v-for="col of cols" :key="col" v-if=" col !== 'id' && col !== 'state'">{{row[col]}}</td>
                    <tr>                        
                </tbody>
                <tbody v-else><tr class="table-light"><td colspan="5">No playlists found.</td></tr></tbody>
                <tfoot v-if="cols.length > 0" class="thead-dark">
                    <tr>
                        <th>
                            <div class="custom-control custom-checkbox checkbox checkbox-primary">
                                <input type="checkbox" class="custom-control-input" id="select_all" v-model="selectAll">
                                <label class="custom-control-label" for="select_all"></label>
                            </div>
                        </th>
                        <th v-for="col of cols" :key="col" v-if=" col !== 'id' && col !== 'state'">
                            <span>{{col}}</span>
                        </th>
                    </tr>
                </tfoot>
                <tfoot v-else class="thead-dark">
                    <th>
                        <div class="custom-control custom-checkbox checkbox checkbox-primary">
                            <input type="checkbox" class="custom-control-input" id="select_all" disabled>
                            <label class="custom-control-label" for="select_all"></label>
                        </div>
                    </th>
                    <th>
                        <span>name</span>
                    </th>
                    <th>
                        <span>description</span>
                    </th>
                    <th>
                        <span>videos</span>
                    </th>
                </tfoot>
            </table>
        </div> 
    `,
    data() {
        return {
            filter_playlists: '',
            selected: [],
            action: '',
            playlist_id: '',
            playlist_name: '',
            actions: [
                { name: 'Choose an action...', value: 'none' },
                { name: 'Edit', value: 'edit' },
                { name: 'Move to Trash', value: 'trash' },
                { name: 'Delete', value: 'delete' },
            ],
            state: 0
        };
    },
    methods: {
        ...Vuex.mapMutations(['current_playlist']),
        ...Vuex.mapActions(['get_list', 'update_state', 'delete_playlist']),
        new_list() {
            location.href += '&new_playlist=';
        },
        apply() {
            var value = this.action
            if (value != undefined) {
                switch (value) {
                    case 'edit':
                        if (this.selected.length == 1) {
                            var id = window.btoa(unescape(encodeURIComponent(this.playlist_id)));
                            this.current_playlist({ id: this.playlist_id, name: this.playlist_name });
                            location.href += '&playlist=' + id;
                        } else {
                            alert('You can\'t edit more than one playlist at the time.');
                        }
                        break;
                    case 'trash':
                        if (this.selected.length > 0) {
                            this.update_state({ params: this.selected, state: 3 });
                            this.unmark_selected();
                        } else {
                            alert('You must select at least a playlist.')
                        }
                        break;
                    case 'delete':
                        if (this.selected.length > 0) {
                            this.delete_playlist({ params: this.selected });
                        } else {
                            alert('You must select at least a playlist.')
                        }
                        break;
                    default:
                        this.action = 'none';
                        break;
                }
            } else {
                alert('You must select an action and at least a playlist.')
            }

        },
        isSelected(id, name, event) {
            if (event.target.checked) {
                this.selected.push(id)
                this.playlist_id = id;
                this.playlist_name = name
            } else {
                this.selected.splice(this.selected.indexOf(id), 1);
                this.playlist_id = '';
                this.playlist_name = ''
            }
        },
        by_state(state) {
            var option = this.options_playlist.filter(e => e.state == state);
            if (option[0].quantity == 0) {
                this.state = 0;
                var btn_p = document.querySelector('.btn-primary');
                btn_p.className = 'btn btn-link';
                var btn_f = document.getElementById('all');
                btn_f.className = 'btn btn-primary';
            } else {
                this.state = state;
                var id = option[0].name.toLowerCase();
                var btn_p = document.querySelector('.btn-primary');
                btn_p.className = 'btn btn-link';
                var btn_f = document.getElementById(id);
                btn_f.className = 'btn btn-primary';
            }
        },
        unmark_selected() {
            if (this.selected.length > 0) {
                for (var item of this.rows) {
                    if (this.selected.includes(item.id)) {
                        this.selected.splice(this.selected.indexOf(item.id), 1);
                        document.getElementById(item.id).checked = this.selected.includes(item.id);
                    }
                }
            }
            this.action = '';
        }
    },
    computed: {
        ...Vuex.mapState(['playlists', 'options_playlist']),
        selectAll: {
            get: function() {
                if (this.selected.length > 0) {
                    var counter = 0;
                    for (var item of this.rows) {
                        if (this.selected.includes(item.id)) {
                            if (document.getElementById(item.id) != null)
                                document.getElementById(item.id).checked = this.selected.includes(item.id);
                            counter++;
                        }
                    }
                    return this.rows.length == counter;
                }
            },
            set: function(value) {
                if (!value) {
                    if (this.selected.length > 0) {
                        for (var item of this.rows) {
                            if (this.selected.includes(item.id)) {
                                this.selected.splice(this.selected.indexOf(item.id), 1);
                                document.getElementById(item.id).checked = this.selected.includes(item.id);
                            }
                        }
                    }
                } else {
                    this.rows.forEach(element => {
                        if (this.state == 0) {
                            this.selected.push(element.id)
                        } else if (element.state == this.state) {
                            this.selected.push(element.id)
                        }
                    });
                }
            }
        },

        select: {
            get: function() {
                var answer = this.playlists ? this.selected.length == this.playlists.length : false;
                return answer;

            }
        },
        cols: function() { return this.playlists.length >= 1 ? Object.keys(this.playlists[0]) : []; },
        rows: function() {
            if (!this.playlists.length) {
                return [];
            }

            return this.playlists.filter(item => {
                let props = (this.filter_playlists.toLowerCase()) ? [item['name'].toLowerCase()] : (this.state) ? [item['state']] : Object.values(item);
                var filtered = props.some(prop => this.filter_playlists.toLowerCase() ? prop.includes(this.filter_playlists.toLowerCase()) : this.state ? prop.includes(this.state) : prop.toString(10).includes(this.filter_playlists.toLowerCase()));
                return filtered;
            });
        }
    },
    created() {
        this.get_list({ action: 'get_playlists', id: '', option: '' });
    },
    beforeUpdate() {
        this.get_list({ action: 'get_playlists', id: '', option: '' });
        this.by_state(this.state);
    },
});

/**
 * View New Playlist
 */

Vue.component('new_playlist', {
    template: `
        <div>
        <h1>Create new playlist</h1>            
        
        <div class="row">
            <div class="col-lg-4 col-sm-4"></div>
            <div class="col-lg-4 col-sm-4">
            <div class="alert alert-danger" role="alert" v-show=" errors.length > 0">
            <div v-for="error of errors" class="text-left"> <h6 class="alert-heading">{{error}}</h6></div>
        </div>
                <form >
                <fieldset class="form-group">
                    <label for="list_name">Name of the videos list</label>
                    <input type="text" class="form-control"  v-model="playlist_name">
                </fieldset>

                <fieldset class="form-group">
                    <label for="description">Description</label>
                    <textarea rows="10" cols="10" class="form-control" v-model="description"></textarea>
                </fieldset>
                <button type="button" class="btn btn-success" @click="submit">Submit</button>
                <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
                </form>
            </div>  
            <div class="col-lg-4 col-sm-4"></div>          
        </div>
        <div>
    `,
    data() {
        return {
            errors: [],
            playlist_name: '',
            description: ''
        }
    },
    methods: {
        ...Vuex.mapMutations(['current_playlist']),
        validateForm: function(e) {
            if (this.playlist_name && this.description) {
                return true;
            }

            this.errors = [];
            if (!this.playlist_name) {
                this.errors.push('You must enter a name!');
            }
            if (!this.description) {
                this.errors.push('You must describe your playlist!')
            }
            e.preventDefault();

        },
        submit() {
            let self = this;
            if (this.validateForm()) {
                let data = new FormData();
                data.append('action', 'new_playlist');
                data.append('name', this.playlist_name);
                data.append('description', this.description);
                axios({
                    method: 'post',
                    url: admin.ajax_url,
                    data: data,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                }).then(function(response) {
                    if (response.data) {
                        var aux = response.data.substr(-1, 1);
                        var id = (response.data.substr(-1, 1) == "0") ? response.data.substr(0, response.data.length - 1) : response.data;
                        self.current_playlist({ id: id, name: self.playlist_name });
                        self.playlist_name = '';
                        self.description = '';
                        id = window.btoa(unescape(encodeURIComponent(id)));
                        //id = (id.includes("==")) ? id.replace("==", "") : id;
                        location.href = location.href.split('&').splice(0, location.href.split('&').length - 1).join('&') + '&playlist=' + id;
                    }
                }).catch(function(response) {
                    console.log(response)
                });

            }

        },
        cancel() {
            location.href = location.href.split('&').splice(0, location.href.split('&').length - 1).join('&');
        }
    },
    computed: {
        ...Vuex.mapState(['playlist']),
    },
})

/**
 * View Playlist
 */
Vue.component('playlist', {
    template: `
        <div>
        <alert></alert>
        <nav class="navbar navbar-expand-lg" style="margin:24px 0;">
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item" v-for="(item, index) of options_videos"><button :class="{'btn btn-primary': index === 0, 'btn btn-link': index !== 0}" :id="item.name.toLowerCase()" :disabled="item.quantity == 0" @click="by_state(item.state)">{{item.name}} ({{item.quantity}})</button></li>
                </ul>
                <ul class="nav justify-content-end">
                    <li class="nav-item mr-1">
                        <button class="btn btn-outline-light text-dark" @click="switch_draft">Switch to Draft</button>
                    </li>
                    <li class="nav-item mr-1">
                        <button class="btn btn-primary" @click="publish">Publish</button>
                    </li>
                    <li class="nav-item mr-1">
                        <button class="btn btn-secondary" @click="save">Done</button>
                    </li>
                </ul>
            </div>            
        </nav>    
            <div class=" mb-4">                
                <div class="float-left mr-3">
                    <select name="actions" class="custom-select" v-model="action">
                        <option v-for="(item, index) of actions" :key="item.value" v-if="item.value === 'delete' || item.value === '' && state == 0 || item.value !== 'show' && state == 1 || item.value !== 'hide' && state == 2" v-bind:value="{value:item.value}" :selected="index === 0" :disabled="index === 0 || selected.length < 1">{{item.name}}</option>
                    </select>
                </div>
                <div class="float-left mr-3">                
                    <button class="btn btn-outline-primary" @click="apply">Apply</button>
                </div>
                <div class="float-left mr-3">
                    <button class="btn btn-outline-primary" data-toggle="modal" data-target="#insert_video"><i class="fas fa-plus"></i></button>
                </div>                
                <form class="form-inline float-right my-2 my-lg-2">
                    <div>
                        <input type="search" v-model="filter_playlist" class="form-control" name="search" placeholder="Search">
                    <div>
                </form>
            </div>
            <table class="table table-hover">
                <thead v-if="cols.length > 0" class="thead-dark">
                   <th>
                            <div class="custom-control custom-checkbox checkbox checkbox-primary">
                                <input type="checkbox" class="custom-control-input" id="select_all" v-model="selectAll">
                                <label class="custom-control-label" for="select_all"></label>
                            </div>
                        </th>
                        <th v-for="col of cols" :key="col" v-if=" col !== 'publish' && col !== 'playlist_id' && col !== 'id'">
                            <span>{{col}}</span>
                        </th>
                </thead>
                <thead class="thead-dark" v-else>
                    <th class="check-column">
                        <div class="custom-control custom-checkbox checkbox checkbox-primary">
                            <input type="checkbox" class="custom-control-input" id="select_all" disabled>
                            <label class="custom-control-label" for="select_all"></label>
                        </div>
                    </th>
                    <th>
                        <span>name</span>
                    </th>
                    <th>
                        <span>uploaded</span>
                    </th>
                    <th>
                        <span>link</span>
                    </th>
                </thead>
                <tbody v-if="videos.length > 0">
                    <tr class="table-light" v-for="row of rows" :key="row.id">
                        <th>
                            <div class="custom-control custom-checkbox checkbox checkbox-primary">
                                <input type="checkbox" class="custom-control-input" :id="row.id" v-on:click="isSelected(row.id, row.name, event)">
                                <label class="custom-control-label" :for="row.id""></label>
                            </div>
                        </th>
                        <td v-for="col of cols" :key="col" v-if=" col !== 'link' && col !== 'publish' && col !== 'playlist_id' && col !== 'id'">{{row[col]}}</td>
                        <td v-for="col of cols" :key="col" v-if="col === 'link'">{{row[col].substr(0,50)}}...</td>
                    <tr>                        
                </tbody>
                <tbody v-else><tr class="table-light"><td colspan="5">No playlists found.</td></tr></tbody>
                <tfoot v-if="cols.length > 0" class="thead-dark">
                    <th>
                        <div class="custom-control custom-checkbox checkbox checkbox-primary">
                            <input type="checkbox" class="custom-control-input" id="select_all" v-model="selectAll">
                            <label class="custom-control-label" for="select_all"></label>
                        </div>
                    </th>
                    <th v-for="col of cols" :key="col" v-if=" col !== 'publish' && col !== 'playlist_id' && col !== 'id'">
                        <span>{{col}}</span>
                    </th>
                </tfoot>
                <tfoot v-else class="thead-dark">
                    <th>
                        <div class="custom-control custom-checkbox checkbox checkbox-primary">
                            <input type="checkbox" class="custom-control-input" id="select_all" disabled>
                            <label class="custom-control-label" for="select_all"></label>
                        </div>
                    </th>
                    <th>
                        <span>name</span>
                    </th>
                    <th>
                        <span>uploaded</span>
                    </th>
                    <th>
                        <span>link</span>
                    </th>
                </tfoot>
            </table>
            <div ref="insert_video" class="modal fade" id="insert_video" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Insert video in {{playlist.name}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" role="alert" v-show=" errors.length > 0">
                            <div v-for="error of errors" class="text-center"> <span class="alert-heading" style="font-weight: bold;">{{error}}</span></div>
                        </div>
                        <form>
                        <fieldset class="form-group">
                            <label for="video_name">Name</label>
                            <input type="text" class="form-control"  v-model="video_name">
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="video_name">Link</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <button class="btn btn-primary" @click="upload_video"><i class="fas fa-cloud-upload-alt"></i></button>
                                </div>
                                <input type="text" class="form-control"  v-model="video_link">
                            </div>
                            <small class="d-block alert alert-warning">If you want to embed a video from <b>Youtube</b> or <b>Vimeo</b>, you should copy the link and paste into the link field.  </small>
                        </fieldset>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="insert">Insert</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="clear">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            video_name: '',
            video_link: '',
            action: '',
            actions: [
                { name: 'Choose an action...', value: '' },
                { name: 'Show', value: 'show' },
                { name: 'Hide', value: 'hide' },
                { name: 'Delete', value: 'delete' },
            ],
            filter_playlist: '',
            selected: [],
            errors: [],
            state: 0,
        }
    },
    methods: {
        ...Vuex.mapActions(['get_list', 'update_state', 'delete_video', 'hide_show_video', 'insert_video']),
        clear() {
            this.errors = [];
            this.video_name = '';
            this.video_link = '';

        },
        isSelected(id, name, event) {
            if (event.target.checked) {
                this.selected.push(id)
                this.playlist_id = id;
                this.playlist_name = name
            } else {
                this.selected.splice(this.selected.indexOf('id'), 1);
                this.playlist_id = '';
                this.playlist_name = ''
            }
        },
        save() {
            location.href = location.href.split('&').splice(0, location.href.split('&').length - 1).join('&');
        },
        publish() {
            this.update_state({ params: [this.playlist.id], state: 1 })
            location.href = location.href.split('&').splice(0, location.href.split('&').length - 1).join('&');
        },
        switch_draft() {
            this.update_state({ params: [this.playlist.id], state: 2 })
            location.href = location.href.split('&').splice(0, location.href.split('&').length - 1).join('&');
        },
        by_state(state) {
            var option = this.options_videos.filter(e => e.state == state);
            if (option[0].quantity == 0) {
                this.state = 0;
                var btn_p = document.querySelector('.btn-primary');
                btn_p.className = 'btn btn-link';
                var btn_f = document.getElementById('all');
                btn_f.className = 'btn btn-primary';
            } else {
                this.state = state;
                var id = option[0].name.toLowerCase();
                var btn_p = document.querySelector('.btn-primary');
                btn_p.className = 'btn btn-link';
                var btn_f = document.getElementById(id);
                btn_f.className = 'btn btn-primary';
            }
        },
        apply() {
            var value = this.action.value
            if (value != undefined && this.playlist_id != '') {
                switch (value) {
                    case 'hide':
                        if (this.selected.length > 0) {
                            this.hide_show_video({ params: this.selected, state: 2 });
                            this.unmark_selected();
                        } else {
                            alert('Select videos to hide');
                        }
                        break;
                    case 'show':
                        if (this.selected.length > 0) {
                            this.hide_show_video({ params: this.selected, state: 1 });
                            this.unmark_selected();
                        } else {
                            alert('Select videos to hide');
                        }
                        break;
                    case 'delete':
                        if (this.selected.length > 0) {
                            this.delete_video({ params: this.selected });
                        } else {
                            alert('Select videos to remove');
                        }
                        break;
                }
            }

        },
        upload_video(e) {
            e.preventDefault()
            let self = this;
            var file_frame = wp.media.frames.file_frame = wp.media({
                title: 'Select or Upload an Image',
                library: {
                    type: 'video' // mime type
                },
                button: {
                    text: 'Select Image'
                },
                multiple: false
            });

            file_frame.on('select', function() {
                var attachment = file_frame.state().get('selection').first().toJSON();
                self.video_name = attachment.title;
                self.video_link = attachment.url;
            });

            file_frame.open();

        },
        insert() {
            this.errors = [];
            if (!this.video_name) {
                this.errors.push("Video name is required.");
            }

            if (!this.video_link) {
                this.errors.push("Video url is required.");
            } //else if (!/^(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.|\/)[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(this.video_link)) {
            //     this.errors.push("Please enter a valid url.");
            // }

            if (this.errors.length == 0) {
                this.insert_video({ name: this.video_name, link: this.video_link, playlist_id: this.playlist.id });
                this.clear();
                alert(this.message.msg);
            }
        },
        unmark_selected() {
            if (this.selected.length > 0) {
                for (var item of this.rows) {
                    if (this.selected.includes(item.id)) {
                        this.selected.splice(this.selected.indexOf(item.id), 1);
                        document.getElementById(item.id).checked = this.selected.includes(item.id);
                    }
                }
            }
            this.action = '';
        }
    },
    computed: {
        ...Vuex.mapState(['playlist', 'videos', 'options_videos', 'message']),
        cols: function() { return this.videos.length >= 1 ? Object.keys(this.videos[0]) : []; },
        rows: function() {
            if (!this.videos.length) {
                return [];
            }

            return this.videos.filter(item => {
                let props = (this.filter_playlist) ? [item['name']] : (this.state) ? [item['publish']] : Object.values(item);
                props.forEach(element => {
                    element = element.toLowerCase();
                });
                var filtered = props.some(prop => this.filter_playlist ? prop.includes(this.filter_playlist.toLowerCase()) : this.state ? prop.includes(this.state) : prop.toString(10).includes(this.filter_playlist.toLowerCase()));
                return filtered;
            });
        },
        selectAll: {
            get: function() {
                if (this.selected.length > 0) {
                    var counter = 0;
                    for (var item of this.rows) {
                        if (this.selected.includes(item.id)) {
                            if (document.getElementById(item.id) != null)
                                document.getElementById(item.id).checked = this.selected.includes(item.id);
                            counter++;
                        }
                    }
                    return this.rows.length == counter;
                }
            },
            set: function(value) {
                if (!value) {
                    if (this.selected.length > 0) {
                        for (var item of this.rows) {
                            if (this.selected.includes(item.id)) {
                                this.selected.splice(this.selected.indexOf(item.id), 1);
                                document.getElementById(item.id).checked = this.selected.includes(item.id);
                            }
                        }
                    }
                } else {
                    this.rows.forEach(element => {
                        if (this.state == 0) {
                            this.selected.push(element.id)
                        } else if (element.publish == this.state) {
                            this.selected.push(element.id)
                        }
                    });
                }
            }
        },
    },
    mounted() {
        $(this.$refs.insert_video).on("hidden.bs.modal", this.clear)
    },
    created() {
        var id = decodeURIComponent(escape(window.atob(location.search.split('&')[location.search.split('&').length - 1].split('=')[1])));
        this.playlist.id = id;
        this.get_list({ action: 'get_playlist_by_id', id: id, option: 'videos' });
        console.log(this.$refs);
    },
    beforeUpdate() {
        var id = this.playlist.id;
        this.get_list({ action: 'get_playlist_by_id', id: id, option: 'videos' });
        this.by_state(this.state);
    },
})


const store = new Vuex.Store({
    state: {
        playlist: {
            id: '',
            name: ''
        },
        playlists: [],
        videos: [],
        options_playlist: [
            { name: 'All', state: 0, quantity: 0 },
            { name: 'Published', state: 1, quantity: 0 },
            { name: 'Draft', state: 2, quantity: 0 },
            { name: 'Trash', state: 3, quantity: 0 }
        ],
        options_videos: [
            { name: 'All', state: 0, quantity: 0 },
            { name: 'Visible', state: 1, quantity: 0 },
            { name: 'Hidden', state: 2, quantity: 0 },
        ],
        themes: [],
        current_theme: '',
        message: { msg: '', type: '' },
    },
    mutations: {
        fill_playlist(state, object) {
            state.playlists = [];
            state.videos = [];

            if (object.option == 'videos') {
                state.videos = object.list;
                state.options_videos.forEach(element => {
                    element.quantity = 0
                });
                state.options_videos[0].quantity = state.videos.length;
                state.videos.forEach(item => {
                    switch (item.publish) {
                        case '1':
                            state.options_videos[1].quantity += 1;
                            break;
                        case '2':
                            state.options_videos[2].quantity += 1;
                            break;
                    }
                });

            } else {
                state.playlists = object.list;

                state.options_playlist.forEach(element => {
                    element.quantity = 0
                });

                state.options_playlist[0].quantity = state.playlists.length;
                state.playlists.forEach(item => {
                    switch (item.state) {
                        case '1':
                            state.options_playlist[1].quantity += 1;
                            break;
                        case '2':
                            state.options_playlist[2].quantity += 1;
                            break;
                        case '3':
                            state.options_playlist[3].quantity += 1;
                            break;
                        default:
                            break;
                    }
                });
            }

        },
        current_playlist(state, object) {
            state.playlist = object
        },
        get_themes_list(state, list) {
            state.themes = list;
            var selected = list.filter(e => e.selected);
            this.commit('set_current_theme', selected[0].value);
        },
        set_current_theme(state, value) {
            state.current_theme = value;
        },
        get_current_theme(state) {
            return state.current_theme;

        },
        alert_message(state, obj) {
            state.message = obj;
        }
    },
    actions: {
        get_list: async function({ commit }, object) {
            let data = new FormData();
            data.append('action', object.action)
            if (object.id != undefined) data.append('id', object.id)
            await axios({
                method: 'POST',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {
                commit('fill_playlist', { list: res.data, option: object.option });
            }).catch(error => {
                console.log(error)
            })
        },
        update_state: async function({ commit }, obj) {
            let data = new FormData();
            data.append('action', 'update_playlist_state');
            data.append('data', JSON.stringify(obj.params));
            data.append('state', obj.state);
            await axios({
                method: 'POST',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {
                if (res.data)
                    commit('alert_message', { msg: 'Playlist(s) state updated.', type: 'success' });
            }).catch(error => {
                commit('alert_message', { msg: 'There was an problem updating playlist(s) state.', type: 'error' });
                console.log(error)
            })
        },
        delete_video: async function({ commit }, obj) {
            let data = new FormData();
            data.append('action', 'delete_video');
            data.append('data', JSON.stringify(obj.params));
            await axios({
                method: 'POST',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {
                if (res.data)
                    commit('alert_message', { msg: 'Video deleted.', type: 'success' });
            }).catch(error => {
                commit('alert_message', { msg: 'There was an problem deleting the video.', type: 'error' });
                console.log(error)
            })
        },
        hide_show_video: async function({ commit }, obj) {
            let data = new FormData();
            data.append('action', 'hide_show_video');
            data.append('data', JSON.stringify(obj.params));
            data.append('state', obj.state);
            await axios({
                method: 'POST',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {}).catch(error => {
                console.log(error)
            })
        },
        insert_video: async function({ commit }, obj) {
            let data = new FormData();
            data.append('action', 'insert_video_in_playlist');
            data.append('video', obj.name);
            data.append('link', obj.link);
            data.append('playlist_id', obj.playlist_id);
            axios({
                method: 'post',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function(response) {
                if (response.data) {
                    commit('alert_message', { msg: 'Video inserted.', type: 'success' });
                }
            }).catch(function(response) {
                commit('alert_message', { msg: 'There was an problem inserting the video.', type: 'error' });
                console.log(response)
            });
        },
        delete_playlist: async function({ commit }, obj) {
            let data = new FormData();
            data.append('action', 'delete_playlist');
            data.append('data', JSON.stringify(obj.params));
            await axios({
                method: 'POST',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {
                if (res.data)
                    commit('alert_message', { msg: 'Playlist deleted.', type: 'success' });
            }).catch(error => {
                commit('alert_message', { msg: 'There was an problem deleting the playlist.', type: 'error' });
                console.log(error)
            })
        },
        get_themes: async function({ commit, state }, payload) {
            let data = new FormData();
            data.append('action', 'video_embed_fields_options');
            await axios({
                method: 'POST',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {
                commit('get_themes_list', res.data);
            }).catch(error => {
                console.log(error)
            })
        },
        update_theme: async function({ commit, state }) {
            let data = new FormData();
            data.append('action', 'select_sanitize');
            data.append('theme', state.current_theme);
            this.themes = [];
            await axios({
                method: 'POST',
                url: admin.ajax_url,
                data: data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(res => {
                if (res.data)
                    commit('alert_message', { msg: 'Theme changed.', type: 'success' });
            }).catch(error => {
                commit('alert_message', { msg: 'There was an problem changing the theme.', type: 'error' });
                console.log(error)
            })
        }
    }
})


const vue = new Vue({
    el: '#app',
    store: store
});

/**
 * Encode Uri:  window.btoa(unescape(encodeURIComponent(str)));
 */

/**
 * Decode Uri: decodeURIComponent(escape(window.atob(str)));
 */