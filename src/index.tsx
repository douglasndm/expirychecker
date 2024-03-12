import 'react-native-gesture-handler';
import React, { useState, useMemo } from 'react';
import { FlatList } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
import { enableFreeze } from 'react-native-screens';
import CodePush from 'react-native-code-push';

import '@expirychecker/Locales';

import StatusBar from '@components/StatusBar';
import AskReview from '@components/AskReview';

import '@services/Firebase/AppCheck';

import '@expirychecker/Services/BackgroundJobs';
import '@expirychecker/Services/Admob';
import '@expirychecker/Services/Analytics';
import '@expirychecker/Services/RemoteConfig';
import DeepLinking from '@expirychecker/Services/DeepLinking';

import '@expirychecker/Functions/ProMode';
import '@expirychecker/Functions/PushNotifications';

// import { getDefaultApp } from '@expirychecker/Utils/Settings/GetSettings';

import BugSnagContainer from '@shared/BugsnagContainer';

import ListContext from '@shared/Contexts/ListContext';

import { AuthProvider } from '@teams/Contexts/AuthContext';
import { TeamProvider } from '@teams/Contexts/TeamContext';

import Routes from '@expirychecker/routes';

import AppOpen from '@expirychecker/Components/Ads/AppOpen';

import AppContext from './appContexts';

enableFreeze(true);

const App: React.FC = () => {
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
		<BugSnagContainer DeepLinking={DeepLinking}>
			<AppContext>
				<PaperProvider>
					<Portal>
						<AuthProvider>
							<TeamProvider>
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
							</TeamProvider>
						</AuthProvider>
					</Portal>
				</PaperProvider>
			</AppContext>
		</BugSnagContainer>
	);
};

export default CodePush(App);
