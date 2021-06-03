import React from 'react';
import { Text, Button } from 'react-native';
import { Container } from './styles';
import API from '../../Api';
import { useNavigation } from '@react-navigation/native';

export default () => {
    const navigation = useNavigation();
    const handleLogoutClick = async () => {
        const json = await API.logout();

        navigation.reset({
            routes: [{ name: 'SignIn' }]
        });
    }

    return (
        <Container>
            <Text>Profile</Text>
            <Button title="Sair" onPress={handleLogoutClick} />
        </Container>
    );
}