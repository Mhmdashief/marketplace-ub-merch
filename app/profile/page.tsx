import ProfileClient from './ProfileClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Profile | UB Merchandise',
    description: 'Manage your personal archive and profile details.',
};

export default function ProfilePage() {
    return <ProfileClient />;
}
