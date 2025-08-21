import { useState } from 'react';
import { useAuth } from './useAuth'; // your auth context

export const useAuthGuard = () => {
	const { user, login } = useAuth();
	const [loginOpen, setLoginOpen] = useState(false);

	const requireAuth = async (action: () => void) => {
		if (user) {
			action();
		} else {
			setLoginOpen(true);
		}
	};

	const handleLogin = async () => {
		await login();
		setLoginOpen(false);
	};

	return { user, loginOpen, setLoginOpen, requireAuth, handleLogin };
};
