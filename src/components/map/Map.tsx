import React, { useState, useEffect } from 'react';
import { Box, Chip, Drawer, IconButton, List, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { LeafletMap } from './LeafletMap';
import { SearchBar } from './Searchbar';
import { SidePanel } from './Drawer/SidePanel';
import PinListItem from './Drawer/PinListItem';

import type { Pin, Coords, MapProps } from '../../types/types';

import { onValue, ref as dbRef } from 'firebase/database';
import { db } from '../../lib/firebase';

export default function Map({ placingMode, onLocationSelected, showSearch }: MapProps) {
	const [pins, setPins] = useState<Pin[]>([]);
	const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

	const [center, setCenter] = useState<[number, number]>([14.5995, 120.9842]);

	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const categories = Array.from(new Set(pins.map((p) => p.category)));

	const filteredPins = pins.filter((p) => !selectedCategory || p.category === selectedCategory);

	const handleLocationSelected = (coords: Coords) => {
		setCenter([coords.lat, coords.lng]);
		onLocationSelected(coords);
	};

	useEffect(() => {
		const r = dbRef(db, 'pins');
		const unsub = onValue(r, (snap) => {
			const val = snap.val() as Record<string, Omit<Pin, 'id'>> | null;
			if (!val) return setPins([]);

			setPins(Object.entries(val).map(([id, data]) => ({ id, ...data })));
		});
		return () => unsub();
	}, [pins]);

	return (
		<div style={{ height: '100%', position: 'relative' }}>
			<Box
				sx={{
					position: 'absolute',
					top: 10,
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					gap: 1,
					bgcolor: 'rgba(255,255,255,0.9)',
					p: 1,
					borderRadius: '16px',
					zIndex: 1000,
					overflowX: 'auto',
					maxWidth: '90%',
				}}
			>
				{categories.map((cat) => (
					<Chip
						key={cat}
						label={cat}
						clickable
						color={selectedCategory === cat ? 'primary' : 'default'}
						onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
					/>
				))}
			</Box>

			{placingMode && showSearch && <SearchBar onSelect={(coords) => handleLocationSelected(coords)} />}

			<LeafletMap
				pins={pins}
				center={center}
				placingMode={placingMode}
				onLocationSelected={handleLocationSelected}
				onPinClick={setSelectedPin}
				selectedPin={selectedPin}
			/>

			{(selectedPin || selectedCategory) && (
				<Drawer
					anchor='left'
					open={true}
					onClose={() => {
						setSelectedPin(null);
						setSelectedCategory(null);
					}}
					sx={{
						'.MuiDrawer-paper': {
							overflow: 'visible',
						},
					}}
				>
					<Box
						sx={{
							width: '400px',
							overflowY: selectedPin ? 'hidden' : filteredPins.length > 7 ? 'scroll' : 'hidden',
						}}
					>
						{selectedPin ? (
							<SidePanel
								pin={selectedPin}
								onClose={() => setSelectedPin(null)}
							/>
						) : (
							<>
								<Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant='h6'>{selectedCategory} </Typography>
									<IconButton
										edge='end'
										onClick={() => {
											setSelectedCategory(null);
											setSelectedPin(null);
										}}
									>
										<Close />
									</IconButton>
								</Box>
								<List
									sx={{
										paddingBottom: '30px',
									}}
								>
									{filteredPins.map((p, index) => (
										<React.Fragment key={index}>
											<PinListItem
												pin={p}
												onClick={(pin: Pin) => {
													setSelectedPin(pin);
												}}
											/>
										</React.Fragment>
									))}
								</List>
							</>
						)}
					</Box>
				</Drawer>
			)}
		</div>
	);
}
