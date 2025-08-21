import { useState, useEffect } from 'react';
import { LeafletMap } from './LeafletMap';
import { SearchBar } from './Searchbar';
import { SidePanel } from './SidePanel';
import type { Pin, Coords } from '../../types/types';

import { onValue, ref as dbRef } from 'firebase/database';
import { db } from '../../lib/firebase';

type MapProps = {
	placingMode: boolean;
	onLocationSelected: (coords: Coords) => void;
	showSearch: boolean;
};

export default function Map({ placingMode, onLocationSelected, showSearch }: MapProps) {
	const [pins, setPins] = useState<Pin[]>([]);
	const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

	const [center, setCenter] = useState<[number, number]>([14.5995, 120.9842]);

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
			{placingMode && showSearch && <SearchBar onSelect={(coords) => handleLocationSelected(coords)} />}

			<LeafletMap
				pins={pins}
				center={center}
				placingMode={placingMode}
				onLocationSelected={handleLocationSelected}
				onPinClick={setSelectedPin}
			/>

			{selectedPin && (
				<SidePanel
					pin={selectedPin}
					onClose={() => setSelectedPin(null)}
				/>
			)}
		</div>
	);
}
