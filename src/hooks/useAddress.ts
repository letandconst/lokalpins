import { useEffect, useState } from 'react';

export const useAddress = (lat: number, lng: number) => {
	const [address, setAddress] = useState<string>('');

	useEffect(() => {
		if (!lat || !lng) return;

		const fetchAddress = async () => {
			try {
				const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
				const data = await res.json();
				setAddress(data.display_name || `${lat}, ${lng}`);
			} catch {
				setAddress(`${lat}, ${lng}`);
			}
		};

		fetchAddress();
	}, [lat, lng]);

	return address;
};
