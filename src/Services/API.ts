import axios from 'axios';
import { getBuildNumber, getVersion } from 'react-native-device-info';
import EnvConfig from 'react-native-config';

import { getDeviceId } from '~/Services/DeviceId';

const api = axios.create({
    baseURL: EnvConfig.API_URL,
});

api.interceptors.request.use(async config => {
    config.headers.appbuildnumber = getBuildNumber();
    config.headers.appversion = getVersion();

    const device_id = await getDeviceId();
    config.headers.deviceid = device_id;

    return config;
});

export default api;
