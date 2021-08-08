import logo from './logo.svg';
import './App.css';
import Display from './Controller/Display.jsx';

function App() {
    window.mapData = {
        map: null,
        searchBox: null,
        ucb_marker: null,
        markers: [],
        nearest_position: null,
        nearestInfowindow: null,
        shouldPopUpDisplay: true
    }
    return (
        <Display></Display>
    );
}

export default App;