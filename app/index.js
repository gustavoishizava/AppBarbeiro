/**
 * @format
 */
// CUIDA DOS GESTOS DA TELA (EX: ARRASTAR DA ESQUERDA PARA DIREITA VOLTA A TELA);
import 'react-native-gesture-handler';
//
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
