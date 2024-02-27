import AsyncStorage from '@react-native-async-storage/async-storage';

async function setDefaultApp(
	value: 'expiry_tracker' | 'expiry_teams'
): Promise<void> {
	await AsyncStorage.setItem('defaultApp', value);
}

export { setDefaultApp };
