import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { Platform, RefreshControl } from 'react-native';
import Api from '../../Api';
import BarberItem from '../../components/BarberItem';

import {
    Container,
    Scroller,
    HeaderArea,
    HeaderTitle,
    SearchButton,

    LocationArea,
    LocationInput,
    LocationFinder,

    LoadingIcon,
    ListArea
} from './styles';

import SearchIcon from '../../assets/search.svg';
import MyLocationIcon from '../../assets/my_location.svg';

export default () => {
    const navigation = useNavigation();

    const [locationText, setLocationText] = useState('');
    const [coords, setCoords] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [list, setList] = useState([]);

    const handleLocationFinder = async () => {
        setCoords(null);

        // PEDIR PERMISSÃO
        let result = await request(
            Platform.OS === 'ios' ?
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                :
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );

        if (result === 'granted') {
            setLoading(true);
            setLocationText('');
            setList([]);

            Geolocation.getCurrentPosition((info) => {
                setCoords(info.coords);
                getBarbers();
            });

        }
    }

    const getBarbers = async () => {
        setLoading(true);
        setList([]);

        let lat = null;
        let lng = null;
        if (coords) {
            lat = coords.latitude;
            lng = coords.longitude;
        }

        const json = await Api.getBarbers(lat, lng, locationText);

        if (!json.error) {
            if (json.loc) {
                setLocationText(json.loc);
            }
            setList(json.data);

        } else {
            alert("Erro: " + json.error);
        }

        setLoading(false);
    }

    React.useEffect(() => {
        getBarbers();
    }, []);

    const onRefresh = () => {
        setRefreshing(false);

        getBarbers();
    }

    const handleLocationSearch = () => {
        setCoords(null);
        getBarbers();
    }

    return (
        <Container>
            <Scroller refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <HeaderArea>
                    <HeaderTitle numberOfLines={2}>Encontre o seu barbeiro favorito</HeaderTitle>
                    <SearchButton onPress={() => navigation.navigate('Search')}>
                        <SearchIcon width="26" height="26" fill="#fff" />
                    </SearchButton>
                </HeaderArea>

                <LocationArea>
                    <LocationInput
                        placeholder="Onde você está?"
                        placeholderTextColor="#fff"
                        value={locationText}
                        onChangeText={t => setLocationText(t)}
                        onEndEditing={handleLocationSearch} />
                    <LocationFinder onPress={handleLocationFinder}>
                        <MyLocationIcon width="24" height="24" fill="#fff" />
                    </LocationFinder>
                </LocationArea>

                {loading && <LoadingIcon size="large" color="#fff" />}

                <ListArea>
                    {list.map((item, k) => (
                        <BarberItem key={k} data={item} />
                    ))}
                </ListArea>

            </Scroller>
        </Container>
    );
}