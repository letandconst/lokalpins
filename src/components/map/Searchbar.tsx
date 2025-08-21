import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { TextField, Paper, List, ListItem, ListItemButton, Typography } from '@mui/material';
import type { Coords } from '../../types/types';

type SearchBarProps = {
	onSelect: (coords: Coords) => void;
};

export function SearchBar({ onSelect }: SearchBarProps) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
	const timeout = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (!query) {
			setResults([]);
			return;
		}

		if (timeout.current) clearTimeout(timeout.current);

		timeout.current = window.setTimeout(async () => {
			try {
				const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
				const data = await res.json();
				setResults(data.slice(0, 5));
			} catch (err) {
				console.error(err);
			}
		}, 500);

		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
		};
	}, [query]);

	const handleSelect = (r: { display_name: string; lat: string; lon: string }) => {
		onSelect({ lat: parseFloat(r.lat), lng: parseFloat(r.lon) });
		setQuery('');
		setResults([]);
	};

	return (
		<Paper
			sx={{
				position: 'absolute',
				top: 16,
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 1100,
				p: 1,
				width: 400,
				borderRadius: 2,
				boxShadow: 3,
				bgcolor: 'background.paper',
			}}
		>
			<TextField
				fullWidth
				placeholder='Search for a location...'
				value={query}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
				variant='outlined'
				size='small'
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: 2,
						bgcolor: 'background.default',
					},
				}}
			/>

			{results.length > 0 && (
				<List
					sx={{
						mt: 1,
						maxHeight: 200,
						overflowY: 'auto',
						borderTop: '1px solid',
						borderColor: 'divider',
					}}
				>
					{results.map((r) => (
						<ListItem
							key={`${r.lat}-${r.lon}`}
							disablePadding
						>
							<ListItemButton onClick={() => handleSelect(r)}>
								<Typography variant='body2'>{r.display_name}</Typography>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			)}
		</Paper>
	);
}
