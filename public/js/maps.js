function initMap() {
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: {
            lat: 41,
            lng: -3.4
        }
    });

    if (window.points) {
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 11,
            center: {
                lat: parseFloat(window.points[0].lat),
                lng: parseFloat(window.points[0].lng)
            }
        });
        window.points.forEach(function(stablishment) {
            console.log("abcdef")
            console.log(stablishment)
            var position = new google.maps.LatLng({
                lat: parseFloat(stablishment.lat),
                lng: parseFloat(stablishment.lng)
            })
            new google.maps.Marker({
                position: {
                    lat: parseFloat(stablishment.lat),
                    lng: parseFloat(stablishment.lng)
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