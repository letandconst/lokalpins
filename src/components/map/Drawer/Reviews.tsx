import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Rating, Stack, TextField, Typography } from '@mui/material';
import { getDatabase, onValue, push, ref } from 'firebase/database';
import { type User } from '../../../lib/firebase';

interface Review {
	id: string;
	userId: string;
	userName?: string;
	userPhoto?: string;
	rating: number;
	description?: string;
	createdAt: number;
}

interface ReviewsProps {
	pinId: string;
	user: User | null;
}

export function Reviews({ pinId, user }: ReviewsProps) {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [open, setOpen] = useState(false);
	const [rating, setRating] = useState<number | null>(null);
	const [description, setDescription] = useState('');

	useEffect(() => {
		const db = getDatabase();
		const reviewsRef = ref(db, `reviews/${pinId}`);

		return onValue(reviewsRef, (snapshot) => {
			const data = snapshot.val() || {};
			const loaded: Review[] = Object.keys(data).map((key) => ({
				id: key,
				...data[key],
			}));
			setReviews(loaded.sort((a, b) => b.createdAt - a.createdAt));
		});
	}, [pinId]);

	const handleSubmit = async () => {
		if (!rating || !user) return;

		const db = getDatabase();
		const reviewsRef = ref(db, `reviews/${pinId}`);

		await push(reviewsRef, {
			userId: user.uid,
			userName: user.displayName,
			userPhoto: user.photoURL,
			rating,
			description,
			createdAt: Date.now(),
		});

		setRating(null);
		setDescription('');
		setOpen(false);
	};

	const { avg, count } = useMemo(() => {
		if (reviews.length === 0) return { avg: 0, count: 0 };
		const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
		return { avg: sum / reviews.length, count: reviews.length };
	}, [reviews]);

	return (
		<Box
			mt={2}
			pt={2}
			sx={{ borderTop: '1px solid #6b6868' }}
		>
			<Typography variant='subtitle1'>Reviews</Typography>

			{/* Average rating summary */}
			{count > 0 && (
				<Stack
					direction='row'
					spacing={1}
					alignItems='center'
					mt={1}
					mb={2}
				>
					<Rating
						value={avg}
						precision={0.1}
						readOnly
						size='small'
					/>
					<Typography
						variant='body2'
						fontWeight='bold'
					>
						{avg.toFixed(1)}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
					>
						({count} review{count > 1 ? 's' : ''})
					</Typography>
				</Stack>
			)}

			{/* Reviews list */}
			<Stack spacing={0}>
				{reviews.length > 0 ? (
					reviews.map((r, index) => (
						<Box
							key={r.id}
							sx={{ py: 2 }}
						>
							{/* User info row */}
							<Stack
								direction='row'
								spacing={1.5}
								alignItems='center'
							>
								<Avatar
									src={r.userPhoto || undefined}
									sx={{ width: 32, height: 32 }}
								/>
								<Box>
									<Typography
										variant='body2'
										fontWeight='bold'
									>
										{r.userName || 'Anonymous'}
									</Typography>
									<Typography
										variant='caption'
										color='text.secondary'
									>
										{new Date(r.createdAt).toLocaleString()}
									</Typography>
								</Box>
							</Stack>

							{/* Rating + Review text */}
							<Box sx={{ pl: 5, mt: 0.5 }}>
								<Rating
									value={r.rating}
									readOnly
									size='small'
								/>
								{r.description && (
									<Typography
										variant='body2'
										sx={{ mt: 0.5 }}
									>
										{r.description}
									</Typography>
								)}
							</Box>

							{/* Divider after each review except last */}
							{index < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
						</Box>
					))
				) : (
					<Typography
						variant='body2'
						color='text.secondary'
					>
						No reviews yet.
					</Typography>
				)}
			</Stack>

			{/* Show button only for logged-in users */}
			{user && (
				<Button
					variant='outlined'
					sx={{ mt: 2 }}
					onClick={() => setOpen(true)}
				>
					Write a Review
				</Button>
			)}

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				fullWidth
			>
				<DialogTitle>Write a Review</DialogTitle>
				<DialogContent>
					<Stack
						spacing={2}
						mt={1}
					>
						<Rating
							value={rating}
							onChange={(_, value) => setRating(value)}
						/>
						<TextField
							label='Optional description'
							multiline
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							fullWidth
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						onClick={handleSubmit}
						variant='contained'
						disabled={!rating}
					>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
