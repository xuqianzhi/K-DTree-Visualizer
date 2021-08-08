import React, { Component } from 'react';
import '../View/NeighborFindingVisualizer.css';
import KDTree, { Dot, Line, TreeNode } from '../Model/KDTree.js';
import Popup from 'reactjs-popup';
import questionmark from '../questionmark.png';

const ANIMATION_LAG = 1500;
const LINE_DISPLAY_LAG = 200;
const ucblat = 37.871416963460454;
const ucblng = -122.26007750513202;

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class NeighborFindingVisualizer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tree_nodes: [], // {node, is_dot_displayed, is_line_displayed}
            searching_bound: { x_bound: { min: 0, max: window.innerWidth }, y_bound: { min: 0, max: window.innerHeight } },
            animation_speed: 2,
            radar_radius: 20,
            radar_direction: 'up',
            running_status: 'constructing' // allowed status: constructing, searching, none
        }
    }

    componentDidMount() {
        const markers = window.mapData.markers;
        const dots = this.markerToPixelDots(markers);
        const kdtree = this.getKDTree(dots);
        this.KDTree = kdtree;
        const nodes = kdtree.iterateTree();
        const tree_nodes = [];
        nodes.forEach((node) => {
            tree_nodes.push({
                node: node,
                is_dot_displayed: false,
                is_line_displayed: false,
                drawing_line_length: 0
            })
        });
        this.setState({ tree_nodes: tree_nodes });
        setTimeout(() => {
            this.displaySearchingAnimation();
        }, 1000);
    }

    markerToPixelDots(markers) {
        /* 
        This function get pixel coordinate of markers on screen, 
        so DOM elements can be drawn on the position of markers without google map instance available 
        # Parameter markers: array of google.Maps.markers
        # Return: array of pixel coordinate {x, y} (AKA {left, top})
        */
        const map = window.mapData.map;
        if (!map) { return; }
        var scale = Math.pow(2, map.getZoom());
        var nw = new window.google.maps.LatLng(
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getSouthWest().lng()
        );
        var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
        var result = [];
        markers.forEach((marker) => {
            if (marker) {
                var worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
                var pixelOffset = {
                    x: Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
                    y: Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
                }
                result.push(new Dot(pixelOffset));
            }
        })
        return result;

        /**
         * For testing purpose, get 20 random dots on the screen
         */
        // var result = [];
        // for (let i = 0; i < 20; i++) {
        //     var position = {
        //         x: Math.floor(randomIntFromInterval(150, window.screen.width - 150)),
        //         y: Math.floor(randomIntFromInterval(150, window.innerHeight - 150))
        //     }
        //     result.push(new Dot(position));
        // }
        // return result
    }

    getLatLngFromPixelOffset(position) {
        const map = window.mapData.map;
        if (!map) { return; }
        var scale = Math.pow(2, map.getZoom());
        var nw = new window.google.maps.LatLng(
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getSouthWest().lng()
        );
        var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw); // in pixel
        const x = position.x / scale;
        const y = position.y / scale;
        const point = new window.google.maps.Point(x + worldCoordinateNW.x, y + worldCoordinateNW.y);
        const result = map.getProjection().fromPointToLatLng(point);
        return {
            lat: result.lat(),
            lng: result.lng()
        }
    }

    getUCBDot() {
        const ucb_marker = [window.mapData.ucb_marker];
        const ucb_dot = this.markerToPixelDots(ucb_marker)[0];
        var position = ucb_dot.getPosition();
        return new Dot(position);

        // var testPosition = { x: 700, y: 400 }
        // return new Dot(testPosition);
    }

    getKDTree(dots) {
        // The root coordinate is sorted by x value and cut the hyperplane vertically
        dots.sort((dot1, dot2) => {
            const x1 = dot1.getPosition().x;
            const x2 = dot2.getPosition().x;
            if (x1 < x2) { return -1; }
            if (x1 > x2) { return 1; }
            return 0;
        });
        const x_bound = { min: 0, max: window.innerWidth };
        const y_bound = { min: 0, max: window.innerHeight };
        const kdtree = new KDTree(dots, x_bound, y_bound);
        return kdtree;
    }

    drawBoundAnimatedly(animation_begin_time, time_interval, from_bound, to_bound) {
        /** 
         * Redraw the bound animatedly
         * Return: time elasped from the animation
         */
        const num_intervals = 25;
        const searching_bound = from_bound;
        var x_bound_min = from_bound.x_bound.min;
        var x_bound_max = from_bound.x_bound.max;
        var y_bound_min = from_bound.y_bound.min;
        var y_bound_max = from_bound.y_bound.max;

        const to_x_bound = to_bound.x_bound;
        const to_y_bound = to_bound.y_bound;
        // calculate difference
        const x_bound_min_diff = to_x_bound.min - x_bound_min;
        const x_bound_max_diff = to_x_bound.max - x_bound_max;
        const y_bound_min_diff = to_y_bound.min - y_bound_min;
        const y_bound_max_diff = to_y_bound.max - y_bound_max;
        // inner loop to make the bound drawing process animated
        for (let j = 0; j < num_intervals; j++) {
            const local_xmin = x_bound_min + x_bound_min_diff * ((j + 1) / num_intervals);
            const local_xmax = x_bound_max + x_bound_max_diff * ((j + 1) / num_intervals);
            const local_ymin = y_bound_min + y_bound_min_diff * ((j + 1) / num_intervals);
            const local_ymax = y_bound_max + y_bound_max_diff * ((j + 1) / num_intervals);
            setTimeout(() => {
                searching_bound.x_bound = {
                    min: local_xmin,
                    max: local_xmax
                }
                searching_bound.y_bound = {
                    min: local_ymin,
                    max: local_ymax
                }
                this.setState({ searching_bound: searching_bound });
            }, animation_begin_time + time_interval * (j / num_intervals));
        }
    }

    drawLineAnimatedly(animation_begin_time, time_interval, length, direction) {
        const num_intervals = 20;
        for (let j = 0; j < num_intervals; j++) {
            setTimeout(() => {
                var displayed_length = 0;
                displayed_length += length * ((j + 1) / num_intervals);
                this.setState({ radar_radius: displayed_length, radar_direction: direction, running_status: 'searching' });
            }, animation_begin_time + time_interval * (j / num_intervals));
        }
    }

    drawColoredDotAtTime(animation_begin_time, dotID, prevDotID, prevDotColor) {
        setTimeout(() => {
            document.getElementById(dotID).style.backgroundColor = 'crimson';
            if (prevDotID) {
                document.getElementById(prevDotID).style.backgroundColor = prevDotColor
            }
        }, animation_begin_time);
    }

    drawLine(start_x, start_y, length, thickness, color, direction, display, border_radius) {
        const isVertical = (direction == 'up' || direction == 'down') ? true : false;
        if (direction === 'right' || direction == 'down') {
            // drawing from left to right or top to bottom => specify left and top
            return (
                <div
                    className='line'
                    style={isVertical ?
                        {
                            left: `${start_x}px`, top: `${start_y}px`, backgroundColor: color, borderRadius: `${border_radius}px`,
                            height: `${length}px`, display: display, width: `${thickness}px`
                        } :
                        {
                            left: `${start_x}px`, top: `${start_y}px`, backgroundColor: color, borderRadius: `${border_radius}px`,
                            width: `${length}px`, display: display, height: `${thickness}px`
                        }}>
                </div>
            )
        } else {
            // drawing from right to left or bottom to top => specify right and bottom
            return (
                <div
                    className='line'
                    style={isVertical ?
                        {
                            right: `${window.innerWidth - start_x - thickness + 1}px`, bottom: `${window.innerHeight - start_y}px`,
                            height: `${length}px`, display: display, width: `${thickness}px`,
                            backgroundColor: color, borderRadius: `${border_radius}px`,
                        } :
                        {
                            right: `${window.innerWidth - start_x}px`, bottom: `${window.innerHeight - start_y - thickness + 1}px`,
                            width: `${length}px`, display: display, height: `${thickness}px`,
                            backgroundColor: color, borderRadius: `${border_radius}px`,
                        }}>
                </div>
            )
        }
    }

    displaySearchingAnimation() {
        /** 
         * Get UCB dot position, perform insertion
         */
        const animation_speed = 1 / (2 ** (this.state.animation_speed));
        var tree_nodes = this.state.tree_nodes;
        tree_nodes.forEach((tree_node) => {
            tree_node.is_dot_displayed = false;
            tree_node.is_line_displayed = false;
        })
        this.setState({
            tree_nodes: tree_nodes,
            running_status: 'constructing'
        })
        // animate KDTree construction
        for (let i = 0; i < tree_nodes.length; i++) {
            const tree_node = tree_nodes[i];
            setTimeout(() => {
                tree_node.is_dot_displayed = true;
                this.setState({ tree_nodes: tree_nodes })
            }, ANIMATION_LAG * animation_speed * i);
            setTimeout(() => {
                tree_node.is_line_displayed = true;
                this.setState({ tree_nodes: tree_nodes })
            }, ANIMATION_LAG * animation_speed * i + LINE_DISPLAY_LAG);
        }
        var time_elapsed = ANIMATION_LAG * animation_speed * tree_nodes.length + LINE_DISPLAY_LAG;
        // prepare for insertion animatoin
        const ucb_dot = this.getUCBDot();
        const ucb_pos = { x: ucb_dot.getPosition().x, y: ucb_dot.getPosition().y }

        const insertion_animation = this.KDTree.getNodeTraversedAfterInsertion(ucb_pos);
        const obj = this.KDTree.performNearestSearching(ucb_pos);
        const nearest = obj.nearest; // class TreeNode
        const bound_animation = obj.bound_animation;
        const crossing_animation = obj.crossing_animation;
        const nearest_id = nearest.getID();
        // animate insertion process
        var bound = this.state.searching_bound;
        for (let i = 0; i < insertion_animation.length; i++) {
            const node = insertion_animation[i];
            const to_bound = {
                x_bound: node.getXBound(),
                y_bound: node.getYBound()
            }
            const animation_begin_time = time_elapsed + ANIMATION_LAG * animation_speed * i;
            const time_interval = ANIMATION_LAG * animation_speed;
            this.drawBoundAnimatedly(animation_begin_time, time_interval, bound, to_bound);
            bound = to_bound;
        }
        var time_elapsed = time_elapsed + ANIMATION_LAG * animation_speed * (insertion_animation.length + 1);
        // animate searching process
        setTimeout(() => {
            this.setState({ running_status: 'searching' })
        }, time_elapsed);
        let prevBestNodeID; let prevBestNodeColor; // animation purpose
        for (let i = 0; i < bound_animation.length; i++) {
            const node = bound_animation[i];
            const line_info = crossing_animation[i];
            const line_length = line_info.length;
            const line_direction = line_info.direction;
            // draw the animated line
            const line_animation_begin_time = time_elapsed + ANIMATION_LAG * animation_speed * 2 * i;
            const time_interval = ANIMATION_LAG * animation_speed;
            this.drawLineAnimatedly(line_animation_begin_time, time_interval, line_length, line_direction);
            if (node) {
                // redraw the bound
                const bound_animation_begin_time = time_elapsed + ANIMATION_LAG * animation_speed * (2 * i + 1);
                const to_x_bound = {
                    min: Math.min(bound.x_bound.min, node.getXBound().min),
                    max: Math.max(bound.x_bound.max, node.getXBound().max)
                }
                const to_y_bound = {
                    min: Math.min(bound.y_bound.min, node.getYBound().min),
                    max: Math.max(bound.y_bound.max, node.getYBound().max)
                }
                const to_bound = {
                    x_bound: to_x_bound,
                    y_bound: to_y_bound
                }
                this.drawBoundAnimatedly(bound_animation_begin_time, time_interval, bound, to_bound);
                bound = to_bound;
            }
        }
        time_elapsed += ANIMATION_LAG * animation_speed * bound_animation.length * 2;
        setTimeout(() => {
            if (prevBestNodeID) {
                document.getElementById(prevBestNodeID).style.backgroundColor = prevBestNodeColor;
            }
            this.setState({ running_status: 'none' })
            const nearest_dot = document.getElementById(nearest_id);
            nearest_dot.style.backgroundColor = 'crimson';
            nearest_dot.style.opacity = 1;
            const lines = document.getElementsByClassName('line');
            for (let k = 0; k < lines.length; k++) { lines[k].style.opacity = 0.3 }
        }, time_elapsed + LINE_DISPLAY_LAG);
        setTimeout(() => {
            const nearest_position = nearest.getPosition();
            const nearest_latlng = this.getLatLngFromPixelOffset(nearest_position);
            window.mapData.nearest_position = nearest_latlng;
            this.props.KDTreeToMap();
        }, time_elapsed + LINE_DISPLAY_LAG + 1500);
    }

    render() {
        const ucb_dot = this.getUCBDot();
        const tree_nodes = this.state.tree_nodes;
        const searching_x_min = this.state.searching_bound.x_bound.min;
        const searching_x_max = this.state.searching_bound.x_bound.max;
        const searching_y_min = this.state.searching_bound.y_bound.min;
        const searching_y_max = this.state.searching_bound.y_bound.max;
        const bound_thickness = 5;
        const radar_radius = this.state.radar_radius;
        const radar_direction = this.state.radar_direction;
        const running_status = this.state.running_status;
        const is_radar_displayed = running_status == 'searching' ? 'inline-block' : 'none';
        const popUpContent = () => {
            if (running_status === 'constructing') {
                return <div className='popup-container'> Constructing K-D Tree </div>
            }
            else if (running_status === 'searching') {
                return (
                    <div className='popup-container' style={{ textAlign: 'left' }}>
                        <div> Searching... </div>
                        <div style={{ marginTop: '5px', marginBottom: '10px' }}> * Yellow bar: best distance found so far </div>
                        <div
                            style={{
                                backgroundColor: 'gold', borderRadius: `${2}px`,
                                width: `${100}px`, height: `${5}px`
                            }}>
                        </div>
                        <div style={{ height: '10px' }}></div>
                    </div>
                )
            }
            else {
                return <div className='popup-container'> Nearest neighbor found </div>
            }
        }
        const infoPopUp = () => (
            <Popup
                trigger={
                    <button style={{
                        right: '4px', bottom: '4px', width: '35px', height: '35px', position: 'absolute', borderRadius: '5px',
                        backgroundImage: `url(${questionmark})`, opacity: 0.5,
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }}>
                    </button>
                }
                position={'top right'}
                on={['hover', 'focus']}
                arrow={true}
            >
                {popUpContent()}
            </Popup>
        );
        return (
            <div className='visualizer-container'>
                {infoPopUp()}
                <div
                    className='bound'
                    id='bound-top'
                    style={{ height: `${bound_thickness}px`, left: searching_x_min, top: searching_y_min, width: searching_x_max - searching_x_min, marginTop: `${-bound_thickness / 2}px` }} />
                <div
                    className='bound'
                    id='bound-bottom'
                    style={{ height: `${bound_thickness}px`, left: searching_x_min, top: searching_y_max, width: searching_x_max - searching_x_min, marginTop: `${-bound_thickness / 2}px` }} />
                <div
                    className='bound'
                    id='bound-left'
                    style={{ width: `${bound_thickness}px`, left: searching_x_min, top: searching_y_min, height: searching_y_max - searching_y_min, marginLeft: `${-bound_thickness / 2}px` }} />
                <div
                    className='bound'
                    id='bound-right'
                    style={{ width: `${bound_thickness}px`, left: searching_x_max, top: searching_y_min, height: searching_y_max - searching_y_min, marginLeft: `${-bound_thickness / 2}px` }} />
                <div className='dot' style={{ left: `${ucb_dot.getPosition().x}px`, top: `${ucb_dot.getPosition().y}px`, backgroundColor: 'blue' }} />
                {this.drawLine(
                    ucb_dot.getPosition().x - bound_thickness / 2, ucb_dot.getPosition().y - bound_thickness / 2,
                    radar_radius, bound_thickness, 'gold', radar_direction, is_radar_displayed, 4)}
                {tree_nodes.map((obj, idx) => {
                    const node = obj.node;
                    const dot = node.getDot();
                    const line = node.getLine();
                    let is_dot_displayed = obj.is_dot_displayed;
                    let is_line_displayed = obj.is_line_displayed;
                    const node_id = node.getID();
                    if (running_status == 'none') { is_dot_displayed = false }
                    // display info
                    const isVertical = line.getIsVertical();
                    const x = line.getPosition().x;
                    const y = line.getPosition().y;
                    const x_bound = line.getXBound();
                    const y_bound = line.getYBound();
                    const dot_opacity = is_dot_displayed ? 1 : 0.3;
                    const line_display = is_line_displayed ? 'inline-block' : 'none';
                    const line_color = isVertical ? 'rgb(187, 145, 248)' : 'mediumaquamarine';
                    const dot_color = is_dot_displayed ? line_color : 'crimson';
                    const start_x = isVertical ? x - 1 : x_bound.min;
                    const start_y = isVertical ? y_bound.min : y - 1;
                    const length = isVertical ? y_bound.max - y_bound.min : x_bound.max - x_bound.min;
                    const direction = isVertical ? 'down' : 'right';
                    return (
                        <div>
                            {/* draw dot */}
                            <div
                                className='dot'
                                id={node_id}
                                style={{ left: x, top: y, opacity: dot_opacity, backgroundColor: dot_color }}>
                            </div>
                            {/* draw line */}
                            {this.drawLine(start_x, start_y, length, 2, line_color, direction, line_display, 1)}
                        </div>
                    )
                })}
            </div>
        )
    }
}
