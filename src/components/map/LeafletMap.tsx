import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Pin, Coords, LeafletMapProps } from '../../types/types';
import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

export function ClickToPlace({ placingMode, onSelect }: { placingMode: boolean; onSelect: (coords: Coords) => void }) {
	useMapEvents({
		click(e) {
			if (placingMode) onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
		},
	});
	return null;
}

export function MapUpdater({ center, placingMode, selectedPin }: { center: [number, number]; placingMode: boolean; selectedPin: Pin | null }) {
	const map = useMap();

	useEffect(() => {
		if (placingMode && center) {
			map.setView(center, map.getZoom());
		}
	}, [placingMode, center, map]);

	useEffect(() => {
		if (selectedPin) {
			map.setView([selectedPin.lat, selectedPin.lng], 16, { animate: true });
		}
	}, [selectedPin, map]);

	return null;
}

export function LeafletMap({ pins, center, placingMode, onLocationSelected, onPinClick, selectedPin }: LeafletMapProps) {
	const defaultIcon = useMemo(() => new L.Icon.Default(), []);

	return (
		<MapContainer
			center={center}
			zoom={12}
			style={{ height: '100%', width: '100%' }}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				attribution='© OpenStreetMap contributors'
			/>
			<ClickToPlace
				placingMode={placingMode}
				onSelect={onLocationSelected}
			/>
			<MapUpdater
				center={center}
				placingMode={placingMode}
				selectedPin={selectedPin}
			/>

			{pins.map((p) => (
				<Marker
					key={p.id}
					position={[p.lat, p.lng]}
					icon={defaultIcon}
					eventHandlers={{ click: () => onPinClick(p) }}
				/>
			))}
		</MapContainer>
	);
}
