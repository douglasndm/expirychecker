import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
import { getEnableProVersion } from '../Functions/Settings';

async function prepareAds() {
    if (!(await getEnableProVersion())) {
        admob().setRequestConfiguration({
            // Update all future requests suitable for parental guidance
            maxAdContentRating: MaxAdContentRating.PG,

            // Indicates that you want your content treated as child-directed for purposes of COPPA.
            tagForChildDirectedTreatment: false,

            // Indicates that you want the ad request to be handled in a
            // manner suitable for users under the age of consent.
            tagForUnderAgeOfConsent: true,
        });
    }
}

prepareAds();
