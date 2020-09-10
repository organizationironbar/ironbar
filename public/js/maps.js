function initMap() {
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: {
            lat: 41,
            lng: -3.4
        }
    });
    console.log(window.points)
    if (window.points) {
        console.log("hola")
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 11,
            center: {
                lat: parseFloat(window.points[0].location.lat),
                lng: parseFloat(window.points[0].location.lng)
            }
        });
        window.points.forEach(function(stablishment) {
            var position = new google.maps.LatLng({
                lat: parseFloat(window.points[0].location.lat),
                lng: parseFloat(window.points[0].location.lng)
            })
            console.log("JSONNNNNN : " + JSON.stringify(position))
            new google.maps.Marker({
                position: {
                    lat: parseFloat(window.points[0].location.lat),
                    lng: parseFloat(window.points[0].location.lng)
                },
                map: map
            })
        })
    } else {

        const geocoder = new google.maps.Geocoder();
        document.getElementById("submit").addEventListener("click", () => {
            geocodeAddress(geocoder, map);
        });
    }
}

function geocodeAddress(geocoder, resultsMap) {
    const address = document.getElementById("address").value;
    geocoder.geocode({
            address: address
        },
        (results, status) => {
            if (status === "OK") {
                resultsMap.setCenter(results[0].geometry.location);
                console.log(`RESULTADO DEL MAPA: ${JSON.stringify(results[0].formatted_address)}`)
                new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location
                    }

                );
                let addressInput = document.getElementById('addressnew')
                addressInput.value = results[0].formatted_address
                let latlong = document.getElementById('latlong')
                var latlngval = (results[0].geometry.location + '').slice(1, -1).split(',')
                latlong.value = [latlngval[0], latlngval[1]]

            } else {
                alert(
                    "No se ha encontrado la dirección"
                );
            }
        }
    );
}