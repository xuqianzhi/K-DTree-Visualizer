import React, { Component } from 'react';
import '../View/Map.css';
import Display, { visualizeKDTree } from './Display.jsx';

const ucblat = 37.871416963460454;
const ucblng = -122.26007750513202;

function getMarkerPixelCoordinate(marker) {
    /* 
    This function calculate pixel coordinate of the input marker, 
    # Parameter marker: google.Maps.markers
    # Return: pixel coordinate {x, y} (AKA {left, top})
    */
    const map = window.mapData.map;
    if (!map || !marker) { return; }
    var scale = Math.pow(2, map.getZoom());
    var nw = new window.google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
    var pixelOffset = {
        x: Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        y: Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    }
    return pixelOffset;
}

export default class Map extends Component {

    constructor(props) {
        super(props);
        this.visualizeKDTree = this.props.visualizeKDTree;
        this.state = {}
    }

    componentDidMount() {
        this.fetchGoogleMapsAPIScript();
    }

    fetchGoogleMapsAPIScript() {
        this.initMap = this.initMap.bind(this);
        var script = document.createElement('script');
        script.setAttribute('id', "loadmap-script");
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
        script.type = "text/javascript";
        script.onload = this.initMap;
        document.getElementById('map-container').appendChild(script);
    }

    initMap() {
        const google = window.google;
        window.mapData.nearestInfowindow = new window.google.maps.InfoWindow({
            content: 'Nearest Search Result',
        });
        var stylers = [{
            "stylers": [{
                "lightness": 0
            }]
        }];
        const ucBerkeleyPos = new google.maps.LatLng(ucblat, ucblng);
        let map = new google.maps.Map(document.getElementById("map"), {
            center: ucBerkeleyPos,
            zoom: 14,
            mapTypeId: "roadmap",
            mapTypeControl: false,
            fullscreenControl: false,
            styles: stylers
        });
        // button for KDTree visualization
        const visualizationButton = document.createElement("button");
        visualizationButton.setAttribute('id', "visualization-button");
        if (!window.mapData.nearest_position) {
            // start visualization button
            visualizationButton.textContent = "Visualize K-D Tree";
            visualizationButton.onclick = this.visualizeKDTree;
        } else {
            // restart button
            visualizationButton.textContent = "Restart";
            visualizationButton.onclick = () => { this.restartButtonClicked() };
        }
        map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(visualizationButton);
        // add UC Berkeley on map
        const ucb_icon = {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35),
        };
        const ucb_marker = new google.maps.Marker({
            map,
            icon: ucb_icon,
            title: 'UC Berkeley',
            position: ucBerkeleyPos,
        });
        // Create the search box and link it to the UI element.
        const input = document.getElementById("pac-input");
        let searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        // Bias the SearchBox results towards current map's viewport.
        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        });
        // handle markers
        let curr_markers = window.mapData.markers;
        let markers = [];
        if (curr_markers.length != 0) {
            // returned from KDTree visualizer
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(ucb_marker.getPosition());
            const bestIndex = this.findNearestMarker(curr_markers);
            if (bestIndex || bestIndex === 0) { window.mapData.nearest_position.index = bestIndex }
            for (let i = 0; i < curr_markers.length; i++) {
                const marker = curr_markers[i];
                let animation = null;
                if (i == bestIndex) { animation = google.maps.Animation.BOUNCE }
                marker.setMap(null);
                const icon = {
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25),
                };
                const position = {
                    lat: marker.getPosition().lat(),
                    lng: marker.getPosition().lng()
                }
                const title = marker.getTitle();
                // Re-create a marker for each place.
                markers.push(
                    new google.maps.Marker({
                        map,
                        icon,
                        title: title,
                        position: position,
                        animation: animation
                    })
                );
                bounds.extend(position);
            }
            map.fitBounds(bounds);
        }
        window.mapData.markers = markers;
        window.mapData.searchBox = searchBox;
        window.mapData.ucb_marker = ucb_marker;
        window.mapData.map = map;
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener("places_changed", () => {
            // first clearout previous visualization left overs
            window.mapData.nearest_position = null;
            window.mapData.nearestInfowindow = null;
            const button = document.getElementById("visualization-button");
            button.textContent = "Visualize K-D Tree";
            button.onclick = this.visualizeKDTree;
            // handle search box
            const places = searchBox.getPlaces();
            if (places.length == 0) { return; }
            // Clear out the old markers.
            markers.forEach((marker) => {
                marker.setMap(null);
            });
            markers = [];
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(ucBerkeleyPos);
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                const icon = {
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25),
                };
                // Create a marker for each place.
                markers.push(
                    new google.maps.Marker({
                        map,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    })
                );
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
                // alert when there's only 1 result returned
                if (places.length == 1) {
                    alert('Only 1 place is found, which will display trivial visualization \n \n Try search general terms to display more places, e.g. Mcdonalds, Ramen')
                }
            });
            console.log('reach here');
            window.mapData.markers = markers;
            map.fitBounds(bounds);
        });

        // reset the viewport if any marker goes out of viewport
        const resetBound = () => {
            // if nearest position is not null, searching is complete, simply return
            if (window.mapData.nearest_position) { return }
            const ucb_marker = window.mapData.ucb_marker;
            let displayed_markers = window.mapData.markers.slice();
            displayed_markers.push(ucb_marker);
            let need_to_reset = false;
            for (let i = 0; i < displayed_markers.length; i++) {
                const m = displayed_markers[i];
                const pixel_pos = getMarkerPixelCoordinate(m);
                const x = pixel_pos.x;
                const y = pixel_pos.y;
                if (x <= 0 || y <= 0 || x >= window.innerWidth || y >= window.innerHeight) {
                    need_to_reset = true;
                    break;
                }
            }
            if (need_to_reset) {
                alert('You are about to drag or zoom some marker out of view port, which will affect neighbor searching visualization');
                if (displayed_markers.length == 1) {
                    // only UCB marker, reset the entire map
                    map.setZoom(14);
                    map.setCenter(ucBerkeleyPos);
                } else {
                    // query marker exist, fit bound   
                    const bounds = new google.maps.LatLngBounds();
                    displayed_markers.forEach((m) => {
                        bounds.extend(m.getPosition());
                    })
                    map.fitBounds(bounds);
                }
            }
        }
        google.maps.event.addListener(map, 'bounds_changed', resetBound);
    }

    restartButtonClicked() {
        window.mapData.nearest_position = null;
        window.mapData.nearestInfowindow = null;
        const button = document.getElementById("visualization-button");
        button.textContent = "Start Visualization";
        button.onclick = this.visualizeKDTree;
        // reset map
        const google = window.google;
        const map = window.mapData.map;
        const markers = window.mapData.markers;
        const ucBerkeleyPos = new google.maps.LatLng(ucblat, ucblng);
        // clear all markers
        console.log('marker is ', markers);
        markers.forEach((marker) => {
            marker.setMap(null);
        })
        window.mapData.markers = [];
        // reset zoom and center
        map.setZoom(14);
        map.setCenter(ucBerkeleyPos);
        document.getElementById('pac-input').style.display = 'inline-block';
    }

    findNearestMarker(markers) {
        // return the index of markers that is closest to nearestPos
        const nearestPos = window.mapData.nearest_position;
        if (!nearestPos) { return }
        let bestDist = Number.MAX_VALUE;
        let bestIndex = null;
        if (!markers || markers.length == 0) { return }
        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            const markerPos = marker.getPosition();
            const currDist = (markerPos.lat() - nearestPos.lat) ** 2 + (markerPos.lng() - nearestPos.lng) ** 2;
            if (currDist <= bestDist) {
                bestDist = currDist;
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    render() {
        return (
            <div id='map-container'>
                <div>
                    <input
                        id="pac-input"
                        class="controls"
                        type="text"
                        placeholder="Search Google Maps"
                    />
                    <div id='map'></div>
                </div>
            </div>
        )
    }
}

export class Marker {
    constructor(position, title) {
        this.position = position;
        this.title = title;
    }

    getPosition() { return this.position }

    getTitle() { return this.title }
}