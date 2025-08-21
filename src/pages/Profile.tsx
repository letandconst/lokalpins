import { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, Chip, Divider, CardMedia, IconButton } from '@mui/material';
import { Masonry } from '@mui/lab';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import Loader from '../components/Loader';

import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Pin {
	id: string;
	title: string;
	description: string;
	category: string;
	lat: number;
	lng: number;
	hearts: number;
	images: string[];
	author: {
		uid: string;
		displayName: string;
		photoURL?: string;
	};
}

const ProfilePage = () => {
	const { user, loading } = useAuth();
	const [pins, setPins] = useState<Pin[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;

		const pinsRef = ref(db, 'pins');
		const unsubscribe = onValue(pinsRef, (snapshot) => {
			const data = snapshot.val() ?? {};

			const pinsArr: Pin[] = Object.entries(data)
				.map(([id, val]) => ({
					id,
					...(val as Omit<Pin, 'id'> & { author?: { uid?: string } }),
				}))
				.filter((pin) => pin.author?.uid === user.uid && typeof pin.lat === 'number' && typeof pin.lng === 'number');

			setPins(pinsArr);
		});

		return () => unsubscribe();
	}, [user]);

	if (!user || loading) return <Loader />;

	const totalHearts = pins.reduce((acc, p) => acc + (p.hearts || 0), 0);

	return (
		<Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
			{/* Profile Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
				<IconButton onClick={() => navigate('/')}>
					<ArrowBack />
				</IconButton>

				<Avatar
					src={user.photoURL ?? undefined}
					alt={user.displayName ?? 'User'}
					sx={{ width: 80, height: 80 }}
				/>
				<Box>
					<Typography
						variant='h4'
						fontWeight='bold'
					>
						{user.displayName}
					</Typography>
					<Typography color='text.secondary'>{user.email}</Typography>
					<Typography mt={1}>
						Total Posts: <strong>{pins.length}</strong> | Total Upvotes: <strong>{totalHearts}</strong>
					</Typography>
				</Box>
			</Box>

			<Divider sx={{ mb: 4 }} />

			{/* Pins Section */}
			<Typography
				variant='h5'
				mb={2}
			>
				Your Pins
			</Typography>
			{pins.length === 0 && <Typography color='text.secondary'>You haven't added any pins yet.</Typography>}

			<Masonry
				columns={{ xs: 1, sm: 2, md: 3 }}
				spacing={2}
			>
				{pins.map((p) => (
					<Card
						key={p.id}
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						<CardMedia
							component='img'
							image={p.images && p.images[0] && p.images[0].trim() !== '' ? p.images[0] : '/no-image.jpg'}
							alt={p.title}
							sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
						/>
						<CardContent>
							<Typography
								variant='h6'
								gutterBottom
							>
								{p.title}
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
								gutterBottom
							>
								{p.description}
							</Typography>
							<Chip
								label={p.category}
								size='small'
							/>
							<Typography
								mt={1}
								variant='caption'
								color='text.secondary'
							>
								❤️ {p.hearts}
							</Typography>
						</CardContent>
					</Card>
				))}
			</Masonry>
		</Box>
	);
};

export default ProfilePage;
