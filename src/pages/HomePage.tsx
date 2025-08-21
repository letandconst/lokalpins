import { useEffect, useState } from 'react';
import { Fab, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../hooks/useAuth';
import AddSpotDialog from '../components/AddSpotDialog';
import Map from '../components/map/Map';
import Navigation from '../components/Navigation';
import NotificationSnackbar from '../components/Notification';

type Coords = { lat: number; lng: number };

type SnackbarData = {
	open: boolean;
	message: string;
	severity: 'success' | 'info' | 'warning' | 'error';
	onCloseCallback?: () => void;
};

const HomePage = () => {
	const { user, login, loading, logout } = useAuth();

	const [placingMode, setPlacingMode] = useState<boolean>(false);
	const [selected, setSelected] = useState<Coords | null>(null);
	const [addOpen, setAddOpen] = useState<boolean>(false);
	const [loginOpen, setLoginOpen] = useState<boolean>(false);
	const [showSearch, setShowSearch] = useState<boolean>(false);

	const [snackbar, setShowSnackbar] = useState<SnackbarData>({
		open: false,
		message: '',
		severity: 'info',
	});

	const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info', duration = 2000, onCloseCallback?: () => void) => {
		setShowSnackbar({ open: true, message, severity, onCloseCallback });

		setTimeout(() => {
			setShowSnackbar((prev) => ({ ...prev, open: false }));
			if (onCloseCallback) onCloseCallback();
		}, duration);
	};

	const handleFabClick = () => {
		if (!user) {
			setLoginOpen(true);
			return;
		}
		setPlacingMode(true);
		showSnackbar('Tap the map to select or search for a location for your spot recommendation.', 'info', 3000, () => setShowSearch(true));
	};

	const handleLogout = async () => {
		await logout();
		showSnackbar('You have logged out successfully.', 'info');
	};

	const handleLocationSelected = (coords: Coords) => {
		setSelected(coords);
		setPlacingMode(false);
		setAddOpen(true);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setPlacingMode(false);
				setShowSearch(false);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<div style={{ height: '100vh', width: '100%', position: 'relative' }}>
			{user && !loading && (
				<Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
					<Navigation
						user={user}
						logout={handleLogout}
					/>
				</Box>
			)}

			<Map
				placingMode={placingMode}
				onLocationSelected={handleLocationSelected}
				showSearch={showSearch}
			/>

			{/* Floating + button */}
			<Fab
				color='primary'
				onClick={handleFabClick}
				sx={{ position: 'absolute', bottom: 20, right: 20 }}
				aria-label='add spot'
			>
				<AddIcon />
			</Fab>

			{/* Add Spot Form */}
			{user && selected && (
				<AddSpotDialog
					open={addOpen}
					onClose={() => setAddOpen(false)}
					coords={selected}
					user={user}
					onSuccess={() => {
						setTimeout(() => showSnackbar('Spot successfully added!', 'success'), 1000);
					}}
				/>
			)}

			{/* Login required dialog */}
			<Dialog
				open={loginOpen}
				onClose={() => setLoginOpen(false)}
			>
				<DialogTitle>Sign in required</DialogTitle>
				<DialogContent>You need to sign in with Google to add a recommendation.</DialogContent>
				<DialogActions>
					<Button onClick={() => setLoginOpen(false)}>Cancel</Button>
					<Button
						variant='contained'
						onClick={async () => {
							await login();
							setLoginOpen(false);

							setTimeout(() => {
								showSnackbar('Login successful!', 'success');
							}, 1000);
						}}
					>
						Login with Google
					</Button>
				</DialogActions>
			</Dialog>

			<NotificationSnackbar
				open={snackbar.open}
				message={snackbar.message}
				severity={snackbar.severity}
				onClose={() => setShowSnackbar((prev) => ({ ...prev, open: false }))}
			/>
		</div>
	);
};

export default HomePage;
