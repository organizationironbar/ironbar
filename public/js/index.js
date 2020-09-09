<<<<<<< HEAD
"use strict";
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {
      lat: -34.397,
      lng: 150.644
    }
  });
  const geocoder = new google.maps.Geocoder();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("address").value;
  geocoder.geocode(
    {
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
        var latlngval = (results[0].geometry.location + '').slice(1,-1).split(',')
        latlong.value = [latlngval[0], latlngval[1]]
        
      } else {
        alert(
          "No se ha encontrado la dirección"
        );
      }
    }
  );
} 


// document.querySelectorAll("[data-enable]").forEach(el => {
//   el.addEventListener("click", function() {
//     const target = document.getElementById(this.dataset.enable)

//     target.disabled = !target.disabled

//     if (target.type === "file") {
//       target.closest("form").enctype = target.disabled ? "application/x-www-form-urlencoded" : "multipart/form-data"
//     }

//     if (!target.disabled) {
//       target.click()
//     }
//   })
// })

document.querySelectorAll("[data-score-stablishment]").forEach(el => {
  el.addEventListener("click", function () {
    axios.post(`/user/${this.dataset.scoreStablishment}/score/${this.dataset.scoreValue}`)
      .then(response => {
        response
        // const scoreContainer = this.querySelector(".score-count")

        // scoreContainer.innerText = Number(scoreContainer.innerText) + response.data.like
      })
  })
})

var $star_rating = $('.star-rating .fa');

var SetRatingStar = function() {
  return $star_rating.each(function() {
    if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
      return $(this).removeClass('fa-star-o').addClass('fa-star');
    } else {
      return $(this).removeClass('fa-star').addClass('fa-star-o');
    }
  });
};

$star_rating.on('click', function() {
  $star_rating.siblings('input.rating-value').val($(this).data('rating'));
  return SetRatingStar();
});

SetRatingStar();
$(document).ready(function() {

});
=======
"use strict";
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {
      lat: -34.397,
      lng: 150.644
    }
  });
  const geocoder = new google.maps.Geocoder();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("address").value;
  geocoder.geocode(
    {
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
        var latlngval = (results[0].geometry.location + '').slice(1,-1).split(',')
        latlong.value = [latlngval[0], latlngval[1]]
        
      } else {
        alert(
          "No se ha encontrado la dirección"
        );
      }
    }
  );
} 


document.querySelectorAll("[data-enable]").forEach(el => {
  el.addEventListener("click", function() {
    const target = document.getElementById(this.dataset.enable)

    target.disabled = !target.disabled

    if (target.type === "file") {
      target.closest("form").enctype = target.disabled ? "application/x-www-form-urlencoded" : "multipart/form-data"
    }

    if (!target.disabled) {
      target.click()
    }
  })
})

document.querySelectorAll("[data-like-stablishment]").forEach(el => {
  el.addEventListener("click", function () {
    axios.post(`/stablishments/${this.dataset.likeStablishment}/like`)
      .then(response => {
        const likesContainer = this.querySelector(".likes-count")

        likesContainer.innerText = Number(likesContainer.innerText) + response.data.like
      })
  })
})

// var $star_rating = $('.star-rating .fa');

// var SetRatingStar = function(event) {
//   console.log(event)
//   var star = event.currentTarget
//   var starParent = event.currentTarget.parentNode
//   var nodeListStars = starParent.querySelectorAll('.fa')
//   var starsArr = Array.from(nodeListStars);
//   var starValue =  star.dataset.scoreValue
//   var  a = 0
//   starsArr.forEach((element) => {
//     console.log(element)
    
        
//     if ( parseInt(starParent.querySelector('input.rating-value').value) >= starValue ) {
//       console.log(parseInt(starParent.querySelector('input.rating-value').value))
//       element.classList.remove('fa-star-o').classList.add('fa-star');
//     } else {
//       console.log('else')
//        element.classList.remove('fa-star').classList.add('fa-star-o');
//     }
//   });
// };

// $star_rating.on('click', function(event) {
//   $star_rating.siblings('input.rating-value').val($(this).data('scoreValue'));
  
//   return SetRatingStar(event);
// });

// SetRatingStar();
// $(document).ready(function() {

// });



>>>>>>> d00c7af6041aec4dd2fb03c8804c456080d60cb9
