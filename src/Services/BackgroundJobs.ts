import BackgroundJob from 'react-native-background-job';

import { getAllProductsNextToExp } from '../Functions/ProductsNotifications';

// REGISTRA O SERVIÇO QUE VAI RODAR AS NOTIFICAÇÕES
const backgroundJob = {
    jobKey: 'backgroundNotification',
    job: () => {
        getAllProductsNextToExp();
    },
};
BackgroundJob.register(backgroundJob);

const backgroundSchedule = {
    jobKey: 'backgroundNotification',
    period: __DEV__ ? 900000 : 86400000,
    allowExecutionInForeground: true,
};

BackgroundJob.schedule(backgroundSchedule)
    .then(() => console.log('Success'))
    .catch((err) => {
        throw new Error(err);
    });
