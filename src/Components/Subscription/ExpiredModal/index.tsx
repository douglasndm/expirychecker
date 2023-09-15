import React, { useCallback, useContext } from 'react';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import Modal from '@components/Subscription/ExpiredModal';

const ExpiredModal: React.FC = () => {
	const { userPreferences, setUserPreferences } =
		useContext(PreferencesContext);

	const onSubscribe = useCallback(() => {
		setUserPreferences({
			...userPreferences,
			isPRO: true,
		});
	}, [setUserPreferences, userPreferences]);

	return <Modal onSubcribe={onSubscribe} />;
};

export default ExpiredModal;
