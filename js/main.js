$(document).ready(function(){

/**instagram**/
    
$(function () {
    function r(t) {
        $("#imagesInsta").empty();
        $(".spinner").show();
        $("#search-bar .container .row").hide();
        $.getJSON("https://api.instagram.com/v1/tags/" + t + "/media/recent?callback=?&client_id=" + e, s)
    }

    function s(e) {
        $("#search-bar .container .row").show();
        $(".spinner").hide();
        for (i=0;i<10;i++) {
            var t = e.data[i];
            var n = $("<div/>").addClass("post");
            var r = $("<img/>").addClass("instaImg").attr("src", t.images.standard_resolution.url);
            var s = $("<img/>").addClass("user").attr("src", t.user.profile_picture);
            var o = $("<div/>").addClass("meta-insta").append(s).append("<a target='_blank' href='http://instagram.com/" + t.user.username + "'>" + t.user.full_name + "</a>");
            n.append(o).append(r);
            $("#imagesInsta").append(n)
        }
    }
    var e = "8bc982c812a44945938e672f29b847ef";
    $("#search").on("click", function () {
        var e = $("#tag").val();
        r(e)
        
    });
    var t = {
        lines: 8,
        length: 8,
        width: 4,
        radius: 5,
        corners: 1,
        rotate: 0,
        direction: 1,
        color: "#000",
        speed: 1,
        trail: 60,
        shadow: false,
        hwaccel: false,
        className: "spinner",
        zIndex: 2e9,
        top: "auto",
        left: "auto"
    };
    var n = (new Spinner(t)).spin();
    $(".spinner")[0].appendChild(n.el);
    $("#tag").on("keypress", function (e) {
        if (e.keyCode == 13) {
            var t = $("#tag").val();
            r(t)
            searchSpot()
        }
    })
})

    /**Spotify**/
    function searchSpot(){
        $('#imageSpot').empty();
        var query = $('#tag').val();
        var url = "http://ws.spotify.com/search/1/album.json?q="+query
        $.getJSON(url, findTrack);
    }
    
        $("#search").click(searchSpot);
    

    function findTrack(songData){
        var i =0;
        for (i=0;i<10;i++){
            var raw = songData.albums[i];
            var songUrl = raw.href;
    /**get cover**/   
            var coverUrl = "https://embed.spotify.com/oembed/?callback=?&url="+songUrl
            $.getJSON(coverUrl, getCoverArt);
        }
    }

    
    /**bring cover art**/
    function getCoverArt(coverArt){
        var p = $("<div/>").addClass("post"); 
        var s = $("<img/>").addClass("spotImg").attr("src", coverArt.thumbnail_url);
        var o = $("<div/>").addClass("meta-spot").append(coverArt.title);
        p.append(o).append(s);
        $('#imageSpot').append(p)
    }  
    
    var currentPosts = 0;
    
    $('#next').click(function(){
        currentPosts=currentPosts+1;
        $(".post").hide();
        $($("#spotFeed .post")[currentPosts]).show();
        $($("#instaFeed .post")[currentPosts]).show();
    });
    
    
});
