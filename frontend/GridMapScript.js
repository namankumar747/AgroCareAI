const map = L.map('map').setView([22.558664, 88.416415], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

let cornerPoints = [];
let fieldPolygon = null;
let gridId = 1;

map.on('click', function (e) {
    if (cornerPoints.length < 4) {
    cornerPoints.push([e.latlng.lat, e.latlng.lng]);
    L.marker(e.latlng).addTo(map).bindPopup(`Corner ${cornerPoints.length}`).openPopup();

    if (cornerPoints.length === 4) {
        drawFieldPolygon(cornerPoints);
    }
    }
});

function drawFieldPolygon(corners) {
    if (fieldPolygon) map.removeLayer(fieldPolygon);

    fieldPolygon = L.polygon(corners, {
    color: 'green',
    fillOpacity: 0.3,
    weight: 2
    }).addTo(map);

    map.fitBounds(fieldPolygon.getBounds());

    // Convert to Turf.js polygon (with closed ring)
    const turfPolygon = turf.polygon([[...corners.map(([lat, lng]) => [lng, lat]), [corners[0][1], corners[0][0]]]]);

    // Draw 6x6 grid
    dividePolygonIntoGrid(fieldPolygon.getBounds(), 6, 6, turfPolygon);
}

function dividePolygonIntoGrid(bounds, rows, cols, turfPolygon) {
    const latMin = bounds.getSouthWest().lat;
    const latMax = bounds.getNorthEast().lat;
    const lngMin = bounds.getSouthWest().lng;
    const lngMax = bounds.getNorthEast().lng;

    const latStep = (latMax - latMin) / rows;
    const lngStep = (lngMax - lngMin) / cols;

    for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const lat1 = latMin + i * latStep;
        const lat2 = latMin + (i + 1) * latStep;
        const lng1 = lngMin + j * lngStep;
        const lng2 = lngMin + (j + 1) * lngStep;

        const center = [(lng1 + lng2) / 2, (lat1 + lat2) / 2];
        const pt = turf.point(center);

        if (turf.booleanPointInPolygon(pt, turfPolygon)) {
        const corners = [
            [lat1, lng1],
            [lat1, lng2],
            [lat2, lng2],
            [lat2, lng1]
        ];

        const grid = L.polygon(corners, {
            color: 'orange',
            fillOpacity: 0.3,
            weight: 1
        }).addTo(map);

        const label = `G${gridId++}`;
        grid._gridId = label;

        grid.on('click', () => {
            const b = grid.getBounds();
            grid.bindPopup(`Grid ID: ${grid._gridId}<br>
            SW: (${b.getSouthWest().lat.toFixed(5)}, ${b.getSouthWest().lng.toFixed(5)})<br>
            NE: (${b.getNorthEast().lat.toFixed(5)}, ${b.getNorthEast().lng.toFixed(5)})`).openPopup();
        });

        // Label marker
        const centerLat = (lat1 + lat2) / 2;
        const centerLng = (lng1 + lng2) / 2;
        L.marker([centerLat, centerLng], {
            icon: L.divIcon({
            className: 'grid-label',
            html: `<b>${label}</b>`,
            iconSize: [20, 20]
            })
        }).addTo(map);
        }
    }
    }
}

let fieldCoordinates = [];

let savedGrids = [];

function savegrid() {
    savedGrids = []; // Clear previous data

    map.eachLayer(layer => {
        if (layer instanceof L.Polygon && layer._gridId) {
            const bounds = layer.getBounds();
            const gridInfo = {
                id: layer._gridId,
                SW: {
                    lat: bounds.getSouthWest().lat.toFixed(6),
                    lng: bounds.getSouthWest().lng.toFixed(6)
                },
                NE: {
                    lat: bounds.getNorthEast().lat.toFixed(6),
                    lng: bounds.getNorthEast().lng.toFixed(6)
                }
            };
            savedGrids.push(gridInfo);
        }
    });

    alert("Grids Saved Sucessfully");
}

let analysedGridData = [];

function getSeverity(diseases) {
  const count = diseases.length;

  if (count >= 3) return "severe";
  else if (count === 2) return "moderate";
  else return "less";
}

async function analyse() {
  analysedGridData = []; // reset

  const container = document.getElementById('grid-container');
  container.innerHTML = ""; // clear previous results

  for (const grid of savedGrids) {
    const minLat = parseFloat(grid.SW.lat);
    const maxLat = parseFloat(grid.NE.lat);
    const minLng = parseFloat(grid.SW.lng);
    const maxLng = parseFloat(grid.NE.lng);

    const diseasesInGrid = fieldCoordinates
      .filter(point =>
        point.lat >= minLat &&
        point.lat <= maxLat &&
        point.lon >= minLng &&
        point.lon <= maxLng
      )
      .map(point => point.disease);

    if (diseasesInGrid.length > 0) {
      analysedGridData.push({
        grid: grid.id,
        diseases: diseasesInGrid
      });

      const severity = getSeverity(diseasesInGrid);

      let color;
      if (severity === "severe") color = "red";
      else if (severity === "moderate") color = "yellow";
      else color = "green";

      const div = document.createElement("div");
      div.style.border = "1px solid black";
      div.style.padding = "10px";
      div.style.margin = "0 auto 10px auto";     // center horizontally
      div.style.backgroundColor = color;
      div.style.width = "calc(100% - 20px)";     // prevents overflow from padding
      div.style.boxSizing = "border-box";
      div.style.overflowWrap = "break-word";     // wrap long disease names
      div.style.overflow = "auto";               // allow internal scroll if needed
      div.style.maxWidth = "800px";

      div.innerHTML = `
        <strong>Grid:</strong> ${grid.id} <br>
        <strong>SW:</strong> (${grid.SW.lat}, ${grid.SW.lng})<br>
        <strong>NE:</strong> (${grid.NE.lat}, ${grid.NE.lng})<br>
        <strong>Diseases:</strong> ${diseasesInGrid.join(', ')}<br>
        <strong>Severity:</strong> ${severity}
      `;

      container.appendChild(div);
    }
  }

  // Show the raw result in alert for debug
  alert("Analysis complete. Check the grid-container for visual output.");
}

async function fetchAnalysisData() {
    try {
        const response = await fetch("http://localhost:8000/analysis/");
        const data = await response.json();
        fieldCoordinates = data; // Save to global JS array
        console.log(fieldCoordinates); // Print the array
        alert("Data fetched successfully.");

        fieldCoordinates.forEach((point, i) => {
          if (point.lat && point.lon) {
            L.circleMarker([point.lat, point.lon], {
              radius: 2,             // size of the dot
              color: 'red',          // border color
              fillColor: 'red',      // fill color
              fillOpacity: 1         // solid fill
            })
            .addTo(map)
            .bindPopup(`<b>Lat:</b> ${point.lat}<br><b>Lon:</b> ${point.lon}`);
          }
        });


    } catch (error) {
        alert("Error fetching analysis data: " + error);
    }
}