import React, { Component, version } from 'react';
import Map from './Map.jsx';
import NeighborFindingVisualizer from './NeighborFindingVisualizer.jsx';
import '../View/Display.css';
import Popup from 'reactjs-popup';
import googlemaps from '../googlemaps.jpeg' ;

/* This class is implemented for switching between Map display and Visualizer display */
export default class Display extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewToDisplay: Map,
        }
        this.visualizeKDTree = this.visualizeKDTree.bind(this);
        this.KDTreeToMap = this.KDTreeToMap.bind(this);
    }

    visualizeKDTree() {
        let markers = window.mapData.markers;
        if (!markers || markers.length == 0) {
            alert('Please search some locations before visualization \n \n e.g. McDonalds, Ramen');
            return;
        }
        const map = window.mapData.map;
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                var stylers = [{
                    "stylers": [{
                        "lightness": -50 - (i * 20)
                    }]
                }];
                map.setOptions({
                    styles: stylers
                })
            }, i * 400);
        }
        setTimeout(() => {
            this.setState({ viewToDisplay: NeighborFindingVisualizer });
        }, 3 * 400);
    }

    KDTreeToMap() {
        this.setState({ viewToDisplay: Map });
        document.getElementById('pac-input').style.display = 'none';
        setTimeout(() => {
            if (window.mapData.nearest_position) {
                const google = window.google;
                const markers = window.mapData.markers;
                const ucb_marker = window.mapData.ucb_marker;
                const map = window.mapData.map;
                const nearest_index = window.mapData.nearest_position.index;
                markers.forEach((marker) => {
                    marker.setMap(null);
                })
                // get nearest marker
                const nearest_marker = window.mapData.markers[nearest_index];
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(ucb_marker.getPosition());
                bounds.extend(nearest_marker.getPosition());
                nearest_marker.setAnimation(null);
                nearest_marker.setMap(map);
                map.fitBounds(bounds);
                // info window
                const infowindow = window.mapData.nearestInfowindow;
                infowindow.open({
                    anchor: nearest_marker,
                    map,
                    shouldFocus: false,
                });
            }
        }, 3000);
    }

    render() {
        const ViewToDisplay = this.state.viewToDisplay;
        const popUpDisplay = window.mapData.shouldPopUpDisplay ? 'inline-block' : 'none';
        window.mapData.shouldPopUpDisplay = false;
        return (
            <div>
                {/* <NeighborFindingVisualizer></NeighborFindingVisualizer> */}

                <Popup position="right center" defaultOpen={true}>
                    <div id='popup-container' style={{display: popUpDisplay}}>
                        <h3 className='popup-h3-text'>Welcome to K-D Tree Visualizer!</h3>
                        <h6 className='popup-h6-text'>K-D Tree is a powerful space-partitioning data structure that is widely used for nearest neighbor searching in map applications.</h6>
                        <h6 className='popup-h6-text'>So, what would it looks like behind the scene if Google Maps uses K-D tree for nearest neighbor searching? This visualizer present you the searching process near UC Berkeley among locations of your choice.</h6>
                        {/* <img width='300px' height='300px' src={process.env.PUBLIC_URL + '/googlemaps.jpeg'}></img> */}
                        <img width='300px' height='300px' src={googlemaps}></img>
                        <p>Click the map to start</p>
                    </div>
                </Popup>
                    <ViewToDisplay
                        visualizeKDTree={this.visualizeKDTree}
                        KDTreeToMap={this.KDTreeToMap} ></ViewToDisplay>
            </div>
                )
    }
}