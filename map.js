// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// build leaflet map
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 12,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)
		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},

    //add business markers
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker( [
                this.business[i].lat,
                this.business[i].long,
            ])
            .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
            .addTo(this.map)
        }
    },
}

        //get coordinates via geolocation api
        async function getCoords(){
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            });
            return [pos.coords.latitude, pos.coords.longitude]
        }

        //get foursquare businesses
        async function fourSquare(business) {
            const options = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'fsq3UVrk1POEDX9+b3ed6q1nK9ymiccdlVLQdliSRr5mdnM='
                }
            }
            let limit = 5
            let lon = myMap.coordinates[1]
            let lat = myMap.coordinates[0]
            let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
            let data = await response.text()
            let parsedData = JSON.parse(data)
            let businesses = parsedData.results
        
            return businesses
        }
        
        function mapBusinesses(object) {
            let businesses = object.map((element) => {
                let location = {
                    name: element.name,
                    icon: element.icon,
                    lat: element.geocodes.main.latitude,
                    long: element.geocodes.main.longitude,
                    address: element.location.address
                };
                console.log(location)
                return location
            })
            return businesses
        }

        //process foursquare array
        function processBusinesses(data) {
            let businesses = data.map((element) => {
                let location = {
                    name: element.name,
                    lat: element.geocodes.main.latitude,
                    long: element.geocodes.main.longitude
                };
                return location
            })
            return businesses
        }

        //event handlers
        //window load
        window.onload = async () => {
            const coords = await getCoords()
            console.log(coords)
            myMap.coordinates = coords
            myMap.buildMap()
        }

        //business submit button
        document.getElementById('submit').addEventListener('click', async (event) => {
            event.preventDefault()
            let business = document.getElementById('business').value 
            let data = await getFoursquare(business)
            myMap.businesses = processBusinesses(data)
            myMap.addMarkers()
        })


    // const redPin = L.icon({
    //     iconUrl: './assets/red-pin.png',
    //     iconSize: [38, 38],
    //     iconAnchor: [19, 38],
    //     popupAnchor: [0, -38],
    // })

   