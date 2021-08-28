import AsyncStorage from '@react-native-async-storage/async-storage';
import uuidGenerator from 'react-native-uuid-generator';

export async function getDeviceId(): Promise<string | null> {
    const deviceid = await AsyncStorage.getItem('device_id');

    return deviceid;
}

async function genereteDeviceId(): Promise<void> {
    const device_id = await getDeviceId();

    if (!device_id) {
        const uuid = await uuidGenerator.getRandomUUID();

        await AsyncStorage.setItem('device_id', uuid);
    }
}

genereteDeviceId();
