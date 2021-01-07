import auth from '@react-native-firebase/auth';
import Analytics from '@react-native-firebase/analytics';
import { GoogleSignin } from '@react-native-community/google-signin';
import EnvConfig from 'react-native-config';
import { setUserId } from '../User';

GoogleSignin.configure({
    webClientId: EnvConfig.GOOGLE_SIGNIN_CLIENT_ID,
});

export async function isUserSignedIn(): Promise<boolean> {
    try {
        return GoogleSignin.isSignedIn();
    } catch (err) {
        throw new Error(err);
    }
}

export async function getUser(): Promise<IGoogleUser> {
    const isUserSigned = await isUserSignedIn();

    if (!isUserSigned) {
        throw new Error('User is not signed');
    }

    let googleUser = await GoogleSignin.getCurrentUser();

    if (!googleUser) {
        googleUser = await GoogleSignin.signInSilently();
    }

    const returnedUser: IGoogleUser = {
        name: googleUser.user.name || '',
        email: googleUser.user.email,
        photo: googleUser.user.photo,
    };

    return returnedUser;
}

export async function signInWithGoogle(): Promise<IUser> {
    try {
        await Analytics().logEvent('user_started_signin_process');

        const isSignedIn = await GoogleSignin.isSignedIn();

        if (isSignedIn) {
            await GoogleSignin.signOut();
        }

        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const authResult = await auth().signInWithCredential(googleCredential);

        await Analytics().logEvent('user_is_now_signed');

        const user: IUser = {
            displayName: authResult.user.displayName,
            email: authResult.user.email,
            emailVerified: authResult.user.emailVerified,
            photoURL: authResult.user.photoURL,
            providerId: authResult.user.providerId,
            uid: authResult.user.uid,
        };

        return user;
    } catch (err) {
        await Analytics().logEvent('error_while_signing_user');
        throw new Error(err);
    }
}
export async function signOutGoogle(): Promise<void> {
    try {
        const isSignedIn = await GoogleSignin.isSignedIn();

        if (isSignedIn) {
            await GoogleSignin.signOut();
            await setUserId('');

            await Analytics().logEvent('user_is_now_signout');
        }
    } catch (err) {
        throw new Error(err);
    }
}
