import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import mapStyles from './map-styles';

const sourceData = './gundata.json';

const scatterplot = () => new ScatterplotLayer({
    id: 'scatter',
    data: sourceData,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 2,
    radiusMaxPixels: 5,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
    pickable: true,
    onHover: ({ object, x, y }) => {
        const el = document.getElementById('tooltip');
        if (object) {
            const { date, n_injured, n_killed, incident_id, notes } = object;
            el.innerHTML = `<strong>ID: ${incident_id} </strong><br>
            <span style="color: rgb(200, 0, 40)">${n_killed}</span> Dead<br>
            <span style="color: rgb(255, 140, 0)">${n_injured}</span> Injured
            <br>Went down on ${date}. ${notes}
            `
            el.style.display = 'block';
            el.style.opacity = 0.9;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        } else {
            el.style.opacity = 0.0;
        }
    },

    onClick: ({ object, x, y }) => {
        window.open(`https://www.gunviolencearchive.org/incident/${object.incident_id}`)
    },
});

const heatmap = () => new HeatmapLayer({
    id: 'heat',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.n_killed + (d.n_injured * 0.5),
    radiusPixels: 60,
});

const hexagon = () => new HexagonLayer({
    id: 'hex',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getElevationWeight: d => (d.n_killed * 2) + d.n_injured,
    elevationScale: 100,
    extruded: true,
    radius: 1609,
    opacity: 0.6,
    coverage: 0.88,
    lowerPercentile: 50
});

window.initMap = () => {
    var styledMapType = new google.maps.StyledMapType(mapStyles, { name: 'Styled Map' });

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.0, lng: -100.0 },
        zoom: 5,
        //styles: mapStyles,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
        }
    });
    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    const overlay = new GoogleMapsOverlay({
        layers: [
            scatterplot(),
            heatmap(),
            hexagon()
        ],
    });

    overlay.setMap(map);

}

