import AsyncStorage from '@react-native-async-storage/async-storage';

async function getDefaultApp(): Promise<'expiry_tracker' | 'expiry_teams'> {
	const setting = await AsyncStorage.getItem('defaultApp');

	if (setting === 'expiry_teams') {
		return 'expiry_teams';
	}

	return 'expiry_tracker';
}

export { getDefaultApp };
