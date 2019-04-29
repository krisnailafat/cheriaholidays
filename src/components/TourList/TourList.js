import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItem from "../ListItem/ListItem";

const tourList = props => {
    return (
        <FlatList
            style={styles.listContainer}
            data={props.tours}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(info) =>
                (
                    <ListItem
                        point={info.item.poin}
                        tourName={info.item.name}
                        tourImage={info.item.images}
                        day={info.item.day_duration}
                        night={info.item.night_duration}
                        price_adult={info.item.price_adult}
                        currency={info.item.currency}
                        onItemPressed={() => props.onItemSelected(info.item)}
                    />
                )}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        width: "100%"
    }
});

export default tourList;
