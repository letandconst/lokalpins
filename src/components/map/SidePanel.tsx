import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Stack, Typography, IconButton, Button, Box } from '@mui/material';
import { Close, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import type { Pin } from '../../types/types';
import LikePin from './LikePin';

type SidePanelProps = {
	pin: Pin;
	onClose: () => void;
};

export function SidePanel({ pin, onClose }: SidePanelProps) {
	const [carouselOpen, setCarouselOpen] = useState(false);
	const [sliderIndex, setSliderIndex] = useState(0);
	const [address, setAddress] = useState<string>('Loading...');

	// Fetch reverse geocode
	useEffect(() => {
		const fetchAddress = async () => {
			try {
				const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pin.lat}&lon=${pin.lng}`);
				const data = await res.json();
				setAddress(data.display_name || `${pin.lat}, ${pin.lng}`);
			} catch {
				setAddress(`${pin.lat}, ${pin.lng}`);
			}
		};
		fetchAddress();
	}, [pin]);

	return (
		<>
			<Card
				sx={{
					width: 360,
					height: '100%',
					position: 'absolute',
					left: 0,
					top: 0,
					zIndex: 1000,
					boxShadow: 3,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div style={{ position: 'relative' }}>
					<Box sx={{ position: 'relative', width: '100%', height: 200 }}>
						<CardMedia
							component='img'
							image={pin.images?.[0] || '/no-image.jpg'}
							alt={pin.title}
							sx={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
						{/* Gradient overlay */}
						<Box
							sx={{
								position: 'absolute',
								inset: 0,
								background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
							}}
						/>
					</Box>
					{pin.images && pin.images.length > 1 && (
						<Button
							variant='contained'
							sx={{
								position: 'absolute',
								bottom: 8,
								right: 8,
								opacity: 0,
								transition: 'opacity 0.2s',
								'&:hover': { opacity: 1 },
							}}
							onClick={() => setCarouselOpen(true)}
						>
							See All Photos
						</Button>
					)}

					<IconButton
						size='small'
						onClick={onClose}
						sx={{
							position: 'absolute',
							right: '16px',
							top: '16px',
							backgroundColor: '#000',
							color: '#fff',
							transition: 'background-color 0.2s ease, color: 0.2s ease',

							'&:hover': {
								backgroundColor: '#fff',
								color: '#000',
							},
						}}
					>
						<Close />
					</IconButton>
				</div>

				<CardContent sx={{ flex: 1, overflowY: 'auto' }}>
					<Stack spacing={1}>
						<Stack
							direction='row'
							justifyContent='space-between'
							alignItems='center'
						>
							<Typography variant='h6'>{pin.title}</Typography>

							<LikePin pin={pin} />
						</Stack>
						<Typography variant='body2'>Description: {pin.description}</Typography>
						<Typography
							variant='caption'
							sx={{ fontStyle: 'italic' }}
						>
							Category: {pin.category}
						</Typography>
						<Typography
							variant='caption'
							sx={{ mt: 1 }}
						>
							Address: {address}
						</Typography>
						{pin.author?.name && (
							<Typography
								variant='caption'
								sx={{ opacity: 0.7 }}
							>
								Posted by {pin.author.name}
							</Typography>
						)}
					</Stack>
				</CardContent>
			</Card>

			{/* Carousel overlay */}
			{carouselOpen && pin.images?.length ? (
				<div
					style={{
						position: 'absolute',
						left: 360,
						top: 0,
						height: '100%',
						width: 'calc(100% - 360px)',
						background: 'rgba(0,0,0,0.9)',
						zIndex: 2000,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<img
						src={pin.images[sliderIndex]}
						alt={`Photo ${sliderIndex + 1}`}
						style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
					/>
					<Stack
						direction='row'
						justifyContent='space-between'
						width='80%'
						mt={2}
					>
						<IconButton
							onClick={() => setSliderIndex((i) => Math.max(0, i - 1))}
							disabled={sliderIndex === 0}
							sx={{ color: 'white' }}
						>
							<ArrowBackIos />
						</IconButton>
						<Typography sx={{ color: 'white', alignSelf: 'center' }}>
							{sliderIndex + 1}/{pin.images.length}
						</Typography>
						<IconButton
							onClick={() => setSliderIndex((i) => Math.min(pin.images!.length - 1, i + 1))}
							disabled={sliderIndex === pin.images.length - 1}
							sx={{ color: 'white' }}
						>
							<ArrowForwardIos />
						</IconButton>
					</Stack>
					<IconButton
						sx={{ position: 'absolute', top: 20, right: 20, color: 'white' }}
						onClick={() => setCarouselOpen(false)}
					>
						<Close />
					</IconButton>
				</div>
			) : null}
		</>
	);
}
