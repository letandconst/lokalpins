import { useEffect, useState } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { ref, onValue, runTransaction, set, remove } from 'firebase/database';
import { db } from '../../lib/firebase';
import type { Pin } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';

const LikePin = ({ pin }: { pin: Pin }) => {
	const { user } = useAuth();
	const [userLiked, setUserLiked] = useState(false);

	const [livePin, setLivePin] = useState<Pin>(pin);

	useEffect(() => {
		if (!pin?.id) return;

		const pinRef = ref(db, `pins/${pin.id}`);

		const unsubscribe = onValue(pinRef, (snapshot) => {
			if (snapshot.exists()) {
				setLivePin({ id: pin.id, ...(snapshot.val() as Omit<Pin, 'id'>) });
			}
		});

		return () => unsubscribe();
	}, [pin?.id]);

	useEffect(() => {
		if (!user) return;
		const likeRef = ref(db, `userHearts/${user.uid}/${pin.id}`);
		const unsubscribe = onValue(likeRef, (snap) => {
			setUserLiked(snap.exists());
		});
		return () => unsubscribe();
	}, [user, pin.id]);

	const handleHeartClick = async () => {
		if (!user) return;

		if (pin.author?.uid === user.uid) return;

		const heartsRef = ref(db, `pins/${pin.id}/hearts`);
		const userHeartRef = ref(db, `userHearts/${user.uid}/${pin.id}`);

		if (userLiked) {
			// 👎 unlike
			await runTransaction(heartsRef, (current) => {
				return (current || 0) - 1;
			});
			await remove(userHeartRef);
		} else {
			// ❤️ like
			await runTransaction(heartsRef, (current) => {
				return (current || 0) + 1;
			});
			await set(userHeartRef, true);
		}
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
			<IconButton
				color={pin.author?.uid === user?.uid ? 'error' : userLiked ? 'error' : 'default'}
				onClick={pin.author?.uid === user?.uid ? undefined : handleHeartClick}
				disabled={pin.author?.uid === user?.uid}
			>
				{pin.author?.uid === user?.uid || userLiked ? <Favorite /> : <FavoriteBorder />}
			</IconButton>

			<Typography variant='body2'>{livePin.hearts || 0}</Typography>
		</Box>
	);
};

export default LikePin;
