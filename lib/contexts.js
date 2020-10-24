import { createContext } from 'react';

export const UserContext = createContext(["", () => {}]);
export const LeagueContext = createContext(["", () => {}]);
export const MatchContext = createContext(["", () => {}]);
export const MenuContext = createContext(["", () => {}]);
export const DrawerContext = createContext([false, () => {}]);
