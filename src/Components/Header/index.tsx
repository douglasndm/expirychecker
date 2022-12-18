import React, { useContext, useMemo } from 'react';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Header, { RequestProps} from '@components/Header';

const LocalHeader: React.FC<RequestProps> = (props) => {
    const { userPreferences } = useContext(PreferencesContext);

    const title = useMemo(() => {
        if(props.title) {
            return props.title;
        }

        if(!props.title && userPreferences.isPRO) {
            return strings.AppName_ProVersion;
        }

        return strings.AppName;
    }, [])

    return <Header {...props} title={title} />
}

export default LocalHeader;
