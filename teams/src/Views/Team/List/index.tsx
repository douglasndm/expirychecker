import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { logoutFirebase } from '~/Functions/Auth/Firebase';
import { getUserTeams } from '~/Functions/Team/Users';
import { setSelectedTeam } from '~/Functions/Team/SelectedTeam';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Button from '~/Components/Button';

import {
    Container,
    Title,
    ListCategories,
    TeamItemContainer,
    TeamItemTitle,
    TeamItemRole,
} from './styles';

const List: React.FC = () => {
    const { navigate, reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [teams, setTeams] = useState<Array<IUserRoles>>([]);

    const loadData = useCallback(async () => {
        try {
            if (userPreferences.selectedTeam) {
                const response = await getUserTeams();

                if ('error' in response) {
                    if (response.status === 401 || response.status === 403) {
                        await logoutFirebase();
                        reset({
                            routes: [{ name: 'Login' }],
                        });
                    }
                    return;
                }

                setTeams(response);
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [reset, userPreferences.selectedTeam]);

    const handleSetTeam = useCallback(
        async (teamId: string) => {
            const selectedTeam = teams.find(t => t.team.id === teamId);

            if (!selectedTeam) {
                throw new Error('Team not found');
            }

            await setSelectedTeam(selectedTeam);
            setUserPreferences({
                ...userPreferences,
                enableDrawerMenu: true,
                selectedTeam,
            });

            reset({
                routes: [{ name: 'Home' }],
            });
        },
        [teams, setUserPreferences, reset, userPreferences]
    );

    const handleNavigateToEnterCode = useCallback(
        (userRole: IUserRoles) => {
            navigate('EnterTeam', { userRole });
        },
        [navigate]
    );

    interface renderProps {
        item: IUserRoles;
    }

    const renderCategory = useCallback(
        ({ item }: renderProps) => {
            const teamToNavigate = item.team.id;

            return (
                <>
                    <TeamItemContainer
                        isPending={item.status.trim() === 'Pending'}
                        onPress={() =>
                            item.status.trim() !== 'Pending'
                                ? handleSetTeam(teamToNavigate)
                                : handleNavigateToEnterCode(item)
                        }
                    >
                        <TeamItemTitle>{item.team.name}</TeamItemTitle>
                        <TeamItemRole>
                            {item.status === 'Pending'
                                ? item.status.toUpperCase()
                                : item.role.toUpperCase()}
                        </TeamItemRole>
                    </TeamItemContainer>
                </>
            );
        },
        [handleNavigateToEnterCode, handleSetTeam]
    );

    const handleNavigateCreateTeam = useCallback(() => {
        navigate('CreateTeam');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container>
            <Title>{translate('View_TeamList_PageTitle')}</Title>

            {teams.length > 0 && (
                <ListCategories
                    data={teams}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={renderCategory}
                />
            )}

            <Button
                text={translate('View_TeamList_Button_CreateTeam')}
                onPress={handleNavigateCreateTeam}
            />
        </Container>
    );
};

export default List;
