import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Pin, Coords, LeafletMapProps } from '../../types/types';
import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

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
				>
					<Box
						sx={{
							'.custom-tooltip': {
								backgroundColor: '#000!important',
								padding: '0!important',
							},
						}}
					>
						<Tooltip
							direction='top'
							offset={[-18, -18]}
							opacity={1}
							permanent={false}
							className='custom-tooltip'
						>
							<Card
								sx={{
									width: '160px',
								}}
							>
								<CardMedia
									component='img'
									height='100'
									image={p.images && p.images.length > 0 ? p.images[0] : '/no-image.jpg'}
									alt={p.title}
									sx={{
										objectFit: 'cover',
									}}
								/>
								<CardContent sx={{ p: 1 }}>
									<Typography
										variant='subtitle1'
										fontWeight='bold'
										noWrap
										sx={{
											marginBottom: '0',
											lineHeight: '1.3',
										}}
									>
										{p.title}
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
										noWrap
										style={{
											fontSize: '10px',
										}}
									>
										{p.category}
									</Typography>
								</CardContent>
							</Card>
						</Tooltip>
					</Box>
				</Marker>
			))}
		</MapContainer>
	);
}
