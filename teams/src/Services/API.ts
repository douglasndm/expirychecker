import axios from 'axios';
import EnvConfig from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import RefreshTokens from './API/RefreshTokens';
import errorsHandler from './API/Errors';

const api = axios.create({
    baseURL: __DEV__ ? 'http://192.168.1.3:3213' : EnvConfig.API_URL,
});

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(api, RefreshTokens, {
    statusCodes: [403],
});

api.interceptors.request.use(async config => {
    const token = await messaging().getToken();
    config.headers.deviceid = token;

    return config;
});

api.interceptors.response.use(response => {
    return response;
}, errorsHandler);

export default api;
