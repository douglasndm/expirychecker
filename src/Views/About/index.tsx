import React from 'react';

import strings from '@shared/Locales';

import About from '@views/About';

const AboutContainer: React.FC = () => {
	return <About appName={strings.AppName_FullName} />;
};

export default AboutContainer;
