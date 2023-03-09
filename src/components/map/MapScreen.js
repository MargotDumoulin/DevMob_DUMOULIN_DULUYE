import {View, Text} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {getAllLocationsLight} from "../../api/PokeAPILocation";
import {useEffect, useState} from "react";
import * as Location from 'expo-location';

export const MapScreen = () => {
    const [locations, setLocations] = useState([]);
    const [position, setPosition] = useState();
    const colors = [
        'tomato',
        'orange',
        'green',
        'gold',
        'linen',
        'tan',
        'aqua',
        'violet',
        'purple',
        'indigo',
        'turquoise',
        'navy',
        'plum'
    ];

    useEffect(() => {
        getLocations();
        getPosition();
    }, []);

    const getLocations = async () => {
        setLocations(await getAllLocationsLight());
    };
    const getPosition = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let currentPosition = await Location.getCurrentPositionAsync({});

        console.log(currentPosition);

        setPosition({
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    return (
        <View>
            {position ? <MapView
                style={{minHeight: "100%"}}
                initialRegion={position}>
                <Marker coordinate={{latitude: position?.latitude, longitude: position?.longitude}}
                        pinColor={'plum'}
                        key={'Wam'}/>
                {
                    locations.map(location => {
                        return (
                            <Marker coordinate={{latitude: location.coords.lat, longitude: location.coords.long}}
                                    pinColor={colors[Math.floor((location.name.charCodeAt(0) - 'A'.charCodeAt(0)) / 2)]}
                                    key={location.name}
                                    title={location.name}/>
                        )
                    })
                }
            </MapView> : <Text>Nop</Text>
            }
        </View>
    );
};
