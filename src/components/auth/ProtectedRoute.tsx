import { useAuth } from '../../hooks/useAuth';
import Loader from '../Loader';
import type { JSX } from 'react';

interface ProtectedRouteProps {
	children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user, loading } = useAuth();

	if (!user || loading) return <Loader />;

	return children;
}
