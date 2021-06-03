import React, { useContext } from 'react';
import { Container, LoadingIcon } from './styles';
import AsyncStorage from '@react-native-community/async-storage';

import BarberLogo from '../../assets/barber.svg';
import { useNavigation } from '@react-navigation/native';
import Api from '../../Api';
import { UserContext } from '../../contexts/UserContext';

// TELA RESPONSÁVEL POR VALIDAR O JWT
export default () => {
  const navigation = useNavigation();
  const { dispatch: userDispatch } = useContext(UserContext);

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        let json = await Api.checkToken(token);
        if (json.token) {
          await AsyncStorage.setItem('token', json.token);
          userDispatch({
            type: 'setAvatar',
            payload: {
              avatar: json.data.avatar
            }
          });

          navigation.reset({
            routes: [{ name: 'MainTab' }]
          });
        } else {
          navigation.navigate('SignIn');
        }
      } else {
        navigation.navigate('SignIn');
      }
    }

    checkToken();
  }, []);

  return (
    <Container>
      <BarberLogo width="100%" height="160" />
      <LoadingIcon size="large" color="#FFF" />
    </Container>
  );
};
