import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const OSRM = 'https://router.project-osrm.org/route/v1/driving';

const geocode = async (address) => {
  const res = await fetch(`${NOMINATIM}?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ni`);
  const data = await res.json();
  if (!data.length) throw new Error(`No se encontró: ${address}`);
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name };
};

const OCOTAL_BOUNDS = L.latLngBounds(
  L.latLng(13.55, -86.56),
  L.latLng(13.70, -86.40),
);

const RouteMap = ({ origin, destinations = [], height = 300 }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!origin || destinations.length === 0) return;

    let mapInstance = null;

    const initMap = async () => {
      setLoading(true);
      setError('');

      try {
        const allPoints = [origin, ...destinations];
        const coords = await Promise.all(allPoints.map(geocode));

        if (!containerRef.current) return;

        mapInstance = L.map(containerRef.current, {
          zoomControl: false,
          attributionControl: false,
          maxBounds: OCOTAL_BOUNDS,
          maxBoundsViscosity: 1.0,
          minZoom: 12,
        });

        const coordBounds = L.latLngBounds(coords.map(c => L.latLng(c.lat, c.lon)));
        mapInstance.fitBounds(coordBounds, { padding: [40, 40], maxZoom: 16 });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(mapInstance);

        const redIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        const blueIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        const greenIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        L.marker([coords[0].lat, coords[0].lon], { icon: greenIcon })
          .addTo(mapInstance)
          .bindPopup(`<b>Origen</b><br/>${coords[0].label.substring(0, 60)}`);

        coords.slice(1).forEach((c, i) => {
          const icon = i === coords.length - 2 ? redIcon : blueIcon;
          const label = i === coords.length - 2 ? 'Destino' : `Parada ${i + 1}`;
          L.marker([c.lat, c.lon], { icon })
            .addTo(mapInstance)
            .bindPopup(`<b>${label}</b><br/>${c.label.substring(0, 60)}`);
        });

        try {
          const waypointsStr = coords.map(c => `${c.lon},${c.lat}`).join(';');
          const osrmRes = await fetch(`${OSRM}/${waypointsStr}?geometries=geojson&overview=full`);
          const osrmData = await osrmRes.json();

          if (osrmData.code === 'Ok' && osrmData.routes?.length) {
            const route = osrmData.routes[0];
            const geojson = route.geometry;

            L.geoJSON(geojson, {
              style: { color: '#F4C414', weight: 4, opacity: 0.8 },
            }).addTo(mapInstance);

            const routeBounds = L.geoJSON(geojson).getBounds();
            mapInstance.fitBounds(routeBounds, { padding: [30, 30], maxZoom: 16 });

            const distKm = (route.distance / 1000).toFixed(1);
            const timeMin = Math.round(route.duration / 60);

            const info = L.control({ position: 'bottomleft' });
            info.onAdd = () => {
              const div = L.DomUtil.create('div', 'bg-white shadow-md px-3 py-1.5 text-xs font-medium');
              div.innerHTML = `📍 ${distKm} km · ⏱ ${timeMin} min`;
              return div;
            };
            info.addTo(mapInstance);
          }
        } catch {
          setError('No se pudo calcular la ruta, pero las ubicaciones están marcadas.');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el mapa');
      }
      setLoading(false);
    };

    initMap();

    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, [origin, ...destinations]);

  return (
    <div className="relative border border-gray-200">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {destinations.length > 1 ? 'Ruta estratégica' : 'Ruta'}
        </p>
        {loading && <span className="text-xs text-gray-400">Cargando mapa...</span>}
      </div>
      <div ref={containerRef} style={{ height: `${height}px`, width: '100%' }} />
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 px-4 py-2">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
