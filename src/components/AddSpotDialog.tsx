import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack, Typography, LinearProgress } from '@mui/material';
import { useState, useMemo, useCallback, type FormEvent } from 'react';
import { db } from '../lib/firebase';
import { ref as dbRef, push, set, serverTimestamp } from 'firebase/database';
import { type User } from 'firebase/auth';

interface AddPinDialogProps {
	open: boolean;
	onClose: () => void;
	coords: Coords | null;
	user: User;
	onSuccess: () => void;
}

type Coords = { lat: number; lng: number };
type Category = (typeof categories)[number];
const categories = ['Food Trip', 'Tambayan', 'Pasyalan', 'Adventure', 'Hidden Gem'] as const;

const AddPinDialog = ({ open, onClose, coords, user, onSuccess }: AddPinDialogProps) => {
	const [form, setForm] = useState({
		title: '',
		desc: '',
		category: 'Food Trip' as Category,
		files: [] as File[],
	});
	const [saving, setSaving] = useState(false);

	const coordsText = useMemo(() => (coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : ''), [coords]);

	const handleChange = useCallback((field: keyof typeof form, value: string | File[]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fl = Array.from(e.target.files ?? []);

		// Filter only image files
		const imageFiles = fl.filter((file) => file.type.startsWith('image/'));

		if (imageFiles.length === 0) {
			alert('Please select valid image files.');
			return;
		}

		// Limit to 10
		const limitedFiles = imageFiles.slice(0, 10);

		if (imageFiles.length > 10) {
			alert('You can upload a maximum of 10 images.');
		}

		handleChange('files', limitedFiles);
	};

	const uploadToCloudinary = async (file: File): Promise<string> => {
		const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!);

		const res = await fetch(url, { method: 'POST', body: formData });
		if (!res.ok) throw new Error('Upload failed');
		const data = await res.json();
		return data.secure_url as string;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!coords || !form.title.trim() || !form.desc.trim()) return;

		setSaving(true);
		try {
			const pinsRef = dbRef(db, 'pins');
			const newPinRef = push(pinsRef);

			const urls: string[] = [];
			for (let i = 0; i < form.files.length; i++) {
				try {
					const url = await uploadToCloudinary(form.files[i]);
					if (url) urls.push(url);
				} catch (err) {
					console.error('Upload failed for file', form.files[i].name, err);
				}
			}

			await set(newPinRef, {
				title: form.title.trim(),
				description: form.desc.trim(),
				category: form.category,
				lat: coords.lat,
				lng: coords.lng,
				images: urls.length > 0 ? urls : [], // ✅ always store images key
				hearts: 0,
				author: {
					uid: user.uid,
					name: user.displayName ?? 'Anonymous',
					photo: user.photoURL ?? undefined,
				},
				createdAt: serverTimestamp(),
			});

			setForm({ title: '', desc: '', category: 'Food Trip', files: [] });
			onClose();
			onSuccess();
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={saving ? undefined : onClose}
			fullWidth
			maxWidth='sm'
		>
			<DialogTitle>Recommend a Spot</DialogTitle>
			<DialogContent>
				{saving && (
					<Stack sx={{ my: 1 }}>
						<LinearProgress />
					</Stack>
				)}
				<Stack
					component='form'
					onSubmit={handleSubmit}
					spacing={2}
					sx={{ mt: 1 }}
				>
					<TextField
						label='Title'
						value={form.title}
						onChange={(e) => handleChange('title', e.target.value)}
						required
						fullWidth
					/>
					<TextField
						label='Description / short note'
						value={form.desc}
						onChange={(e) => handleChange('desc', e.target.value)}
						required
						fullWidth
						multiline
						minRows={2}
					/>
					<TextField
						select
						label='Category'
						value={form.category}
						onChange={(e) => handleChange('category', e.target.value as Category)}
						fullWidth
					>
						{categories.map((c) => (
							<MenuItem
								key={c}
								value={c}
							>
								{c}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label='Selected location'
						value={coordsText}
						disabled
						fullWidth
					/>
					<Stack>
						<Typography
							variant='body2'
							sx={{ mb: 0.5 }}
						>
							Photo upload (max 10)
						</Typography>
						<input
							type='file'
							accept='image/*'
							multiple
							onChange={handleFileChange}
						/>
						<Typography
							variant='caption'
							sx={{ opacity: 0.7 }}
						>
							{form.files.length}/10 selected
						</Typography>
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					disabled={saving}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={saving || !coords}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddPinDialog;
