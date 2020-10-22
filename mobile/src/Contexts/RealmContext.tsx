import { createContext } from 'react';
import Realm from '../Services/Realm';

const RealmContext = createContext({
    Realm,
});

export default RealmContext;
