import 'react-native-gesture-handler';
import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
import * as Sentry from '@sentry/react-native';

import '@shared/Locales';

import '@services/Firebase/AppCheck';
import '@services/Notifications/Local';
import '@services/Notifications/ClearBadge';
import { reactNavigationIntegration } from '@services/Sentry';

import '@expirychecker/Services/Notifications';
import '@expirychecker/Services/Backup';
import '@expirychecker/Services/BackgroundJobs';
import '@expirychecker/Services/Admob';
import '@expirychecker/Services/Analytics';
import DeepLinking from '@expirychecker/Services/DeepLinking';

import '@expirychecker/Functions/ProMode';
import '@expirychecker/Functions/PushNotifications';

import ListContext from '@shared/Contexts/ListContext';

import Routes from '@expirychecker/routes';

import StatusBar from '@components/StatusBar';
import AskReview from '@components/AskReview';

import RenderErrors from '@views/Information/Errors/Render';

import AppOpen from '@expirychecker/Components/Ads/AppOpen';

import AppContext from './appContexts';

const App: React.FC = () => {
	const containerRef = React.useRef();

	const [currentList, setCurrentList] = useState<React.RefObject<
		FlatList<IProduct>
	> | null>(null);

	const list = useMemo(() => {
		return {
			currentList,
			setCurrentList,
		};
	}, [currentList]);

	return (
		<NavigationContainer
			linking={DeepLinking}
			onReady={() =>
				reactNavigationIntegration.registerNavigationContainer(
					containerRef
				)
			}
		>
			<Sentry.ErrorBoundary fallback={<RenderErrors />}>
				<AppContext>
					<PaperProvider>
						<Portal>
							<StatusBar />
							<AppOpen />
							<ListContext.Provider value={list}>
								<Routes />
							</ListContext.Provider>
							<AskReview />
							<FlashMessage
								duration={7000}
								statusBarHeight={50}
							/>
						</Portal>
					</PaperProvider>
				</AppContext>
			</Sentry.ErrorBoundary>
		</NavigationContainer>
	);
};

export default App;
