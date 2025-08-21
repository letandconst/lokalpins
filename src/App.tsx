import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Public routes */}
					<Route
						path='/'
						element={<HomePage />}
					/>

					{/* Protected routes */}
					<Route
						path='/profile'
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
};

export default App;
