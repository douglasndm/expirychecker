import { createContext, useContext } from 'react';

const DrawerContext = createContext({
	toggleDrawer: () => {},
	setDrawerOpen: (_: boolean) => {},
});

export default DrawerContext;

export const useDrawer = () => {
	return useContext(DrawerContext);
};
