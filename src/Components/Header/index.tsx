import React, { useContext, useMemo } from 'react';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import Header, { RequestProps } from '@components/Header';

const LocalHeader: React.FC<RequestProps> = (props: RequestProps) => {
	const { userPreferences } = useContext(PreferencesContext);

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

	return <Header {...props} title={headerTitle} />;
};

export default LocalHeader;
