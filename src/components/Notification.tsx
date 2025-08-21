import { Snackbar, Alert } from '@mui/material';

interface NotificationSnackbarProps {
	open: boolean;
	message: string;
	severity?: 'success' | 'info' | 'warning' | 'error';
	onClose: () => void;
}

export default function NotificationSnackbar({ open, message, severity = 'info', onClose }: NotificationSnackbarProps) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={1000}
			onClose={onClose}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<Alert
				severity={severity}
				sx={{ width: '100%' }}
				onClose={onClose}
			>
				{message}
			</Alert>
		</Snackbar>
	);
}
