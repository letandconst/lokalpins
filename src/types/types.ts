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
