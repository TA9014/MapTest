// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 13.828523, lng: 100.5284507 },
        zoom: 15,
    });
    // const card = document.getElementById("pac-card");*****
    const input = document.getElementById("pac-input");
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);*****
    const autocomplete = new google.maps.places.Autocomplete(input);
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);
    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);
    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });
    console.log(`this is marker ${marker}`);
    autocomplete.addListener("place_changed", () => {
        infowindow.close();
        marker.setVisible(false);
        const place = autocomplete.getPlace();
        console.log(`this is place ${place}`);
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
        let lat1 = place.geometry.location.lat();
        let lng1 = place.geometry.location.lng();
        
        console.log(typeof(lat1));
        console.log(lng1);
        

        let request = {
            location: {lat: lat1, lng: lng1},
            radius: '500',
            type: ['restaurant']
    };
    let service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);


    let address = "";

    if (place.address_components) {
        address = [
            (place.address_components[0] &&
                place.address_components[0].short_name) ||
            "",
            (place.address_components[1] &&
                place.address_components[1].short_name) ||
            "",
            (place.address_components[2] &&
                place.address_components[2].short_name) ||
            "",
        ].join(" ");
    }
    infowindowContent.children["place-icon"].src = place.icon;
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = address;
    infowindow.open(map, marker);
});

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
function setupClickListener(id, types) {
    const radioButton = document.getElementById(id);
    radioButton.addEventListener("click", () => {
        autocomplete.setTypes(types);
    });
}
setupClickListener("changetype-all", []);
setupClickListener("changetype-address", ["address"]);
setupClickListener("changetype-establishment", ["establishment"]);
setupClickListener("changetype-geocode", ["geocode"]);
document.getElementById("use-strict-bounds")
    .addEventListener("click", function () {
        console.log("Checkbox clicked! New state=" + this.checked);
        autocomplete.setOptions({ strictBounds: this.checked });
    });  
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name);
        infowindow.open(map);
    });
}



