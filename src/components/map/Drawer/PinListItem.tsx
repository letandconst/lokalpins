import { Box, Divider, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useAddress } from '../../../hooks/useAddress';
import type { Pin } from '../../../types/types';

interface PinListItemProps {
	pin: Pin;
	onClick: (pin: Pin) => void;
}

const PinListItem = ({ pin, onClick }: PinListItemProps) => {
	const address = useAddress(pin.lat, pin.lng);

	return (
		<>
			<ListItem
				disablePadding
				sx={{
					gap: '12px',
				}}
			>
				<ListItemButton onClick={() => onClick(pin)}>
					<ListItemText
						primary={pin.title}
						secondary={
							<>
								<Typography
									variant='body2'
									color='text.secondary'
									component='span'
								>
									{pin.description}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
									display='block'
									component='span'
								>
									{address}
								</Typography>
							</>
						}
					/>
					<Box
						component='img'
						src={pin.images?.[0] || '/no-image.jpg'}
						alt={pin.title}
						sx={{
							minWidth: 100,
							height: 80,
							objectFit: 'cover',
							borderRadius: 1,
							ml: 2,
						}}
					/>
				</ListItemButton>
			</ListItem>
			<Divider />
		</>
	);
};

export default PinListItem;
