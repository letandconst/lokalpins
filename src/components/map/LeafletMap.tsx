import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Pin, Coords } from '../../types/types';
import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

export function ClickToPlace({ placingMode, onSelect }: { placingMode: boolean; onSelect: (coords: Coords) => void }) {
	useMapEvents({
		click(e) {
			if (placingMode) onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
		},
	});
	return null;
}

export function MapUpdater({ center }: { center: [number, number] }) {
	const map = useMap();
	map.setView(center, map.getZoom());
	return null;
}

type LeafletMapProps = {
	pins: Pin[];
	center: [number, number];
	placingMode: boolean;
	onLocationSelected: (coords: Coords) => void;
	onPinClick: (pin: Pin) => void;
};

export function LeafletMap({ pins, center, placingMode, onLocationSelected, onPinClick }: LeafletMapProps) {
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
			<MapUpdater center={center} />

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
