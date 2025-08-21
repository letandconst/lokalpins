import React, { type ReactNode, useState, useEffect } from 'react';
import { auth, type User } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthProvider: React.FC<{ children: ReactNode; onAuthChange?: (user: User | null) => void }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = auth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsub();
	}, []);

	const login = async () => {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	};

	const logout = async () => {
		await auth.signOut();

		localStorage.removeItem('userPhoto');
	};
	return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
export default AuthContext;
