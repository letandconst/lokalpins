import { useState, type MouseEvent } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface UserNavProps {
	user: {
		displayName?: string | null;
		photoURL?: string | null;
	};
	logout: () => Promise<void>;
}

const Navigation = ({ user, logout }: UserNavProps) => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	if (!user) return null;

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProfile = () => {
		navigate('/profile');
		handleClose();
	};

	const handleSignOut = async () => {
		await logout();
		handleClose();
	};

	return (
		<>
			<Tooltip title={user.displayName ?? 'Account'}>
				<IconButton
					onClick={handleClick}
					sx={{ p: 0, width: 40, height: 40 }}
				>
					<Avatar
						src={user?.photoURL || '/no-image.png'}
						alt={user.displayName ?? 'User'}
						sx={{ width: 40, height: 40 }}
					/>
				</IconButton>
			</Tooltip>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem onClick={handleProfile}>Profile</MenuItem>
				<MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
			</Menu>
		</>
	);
};

export default Navigation;
