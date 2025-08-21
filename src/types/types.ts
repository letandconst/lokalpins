export type Pin = {
	id: string;
	title: string;
	description: string;
	category: 'Food Trip' | 'Tambayan' | 'Pasyalan' | 'Adventure' | 'Hidden Gem';
	lat: number;
	lng: number;
	images?: string[];
	author?: { uid: string; name: string; photo?: string };
	hearts?: number;
};

export type Coords = {
	lat: number;
	lng: number;
};

export type LeafletMapProps = {
	pins: Pin[];
	center: [number, number];
	placingMode: boolean;
	onLocationSelected: (coords: Coords) => void;
	onPinClick: (pin: Pin) => void;
	selectedPin: Pin | null;
};

export type MapProps = {
	placingMode: boolean;
	onLocationSelected: (coords: Coords) => void;
	showSearch: boolean;
};
