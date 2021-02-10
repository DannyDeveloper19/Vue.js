window.addEventListener('load', function() {

    //store tabs variables
    // var root = this.location.search.split('&')[0];
    // var tabs = document.querySelectorAll("ul.navbar-nav > li > a");
    // for (let i = 0; i < tabs.length; i++) {
    //     var href = root + tabs[i].getAttribute('href');
    //     tabs[i].setAttribute('href', href);
    // }

    if (document.querySelector('.form-table') !== null) {
        var form_table = document.querySelector('.form-table');
        form_table.style.margin = '0.2em 0 0 0';
        var ft_th = document.querySelector('.form-table th');
        ft_th.style.width = '120px';
    }


})