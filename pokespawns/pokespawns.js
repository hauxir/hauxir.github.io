$(function() {
    var map = L.map('map').setView([64.1334904,-21.8524424,12], 12);
    var googleLayer = new L.Google('ROADMAP');
    map.addLayer(googleLayer);

    $.get("pokemon-list.json",function(pokemons) {
        var markers = L.markerClusterGroup();
        map.addLayer(markers);

        for(var i in pokemons) {
            var pokemon = pokemons[i];
            $("#pokemon-list")
            .append($("<option></option>")
            .attr("value",pokemon.id).data("thumb",pokemon.ThumbnailImage)
            .text(pokemon.name)); 
        }

        if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)  ) {
            $("#pokemon-list").select2({'width':'100%'});
        } else {
            $(".leaflet-control-zoom").hide();
        }

        $("#pokemon-list").on("select2:select", function (e) {
            $.get("pokelocations/" + parseInt($("#pokemon-list").val()) + ".json",function(mons) {
                markers.clearLayers();
                var thumb = $("#pokemon-list option:selected").data('thumb');
                var icon = L.icon({iconUrl: thumb, iconSize: [30,30]});
                for(var i in mons) {
                    var mon = mons[i];
                    var latlng = L.latLng(mon.x, mon.y);
                    var marker = L.marker(latlng, {'icon':icon});
                    var d = new Date(mon.d*1000);
                    var ds = moment(d).format('DD-MM-YYYY [kl.] HH:mm');
                    marker.bindPopup('Fannst ' + ds);
                    markers.addLayer(marker);
                }
            },"json").error(function() {
                markers.clearLayers();
            });
        }).trigger("select2:select");

        $("#pokemon-list").change(function() {
            $("#pokemon-list").trigger("select2:select");
        })

    });

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)
    },i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-55048703-3', 'auto');
    ga('send', 'pageview');
});
