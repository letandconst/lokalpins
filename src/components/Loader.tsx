import { CircularProgress, Box } from '@mui/material';

const Loader = () => {
	return (
		<Box
			sx={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000000',
			}}
		>
			<CircularProgress size={80} />
		</Box>
	);
};

export default Loader;
