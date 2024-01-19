import React, { useContext, useMemo } from 'react';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';
import { useDrawer } from '@expirychecker/Contexts/Drawer';

import Header, { RequestProps } from '@components/Header';

const LocalHeader: React.FC<RequestProps> = (props: RequestProps) => {
	const { userPreferences } = useContext(PreferencesContext);
	const { setDrawerOpen } = useDrawer();

	const headerTitle = useMemo(() => {
		const { title } = props;
		if (title) {
			return title;
		}

		if (!title && userPreferences.isPRO) {
			return strings.AppName_ProVersion;
		}

		return strings.AppName;
	}, [props, userPreferences.isPRO]);

	return (
		<Header
			{...props}
			title={headerTitle}
			onMenuPress={() => setDrawerOpen(true)}
		/>
	);
};

export default LocalHeader;
