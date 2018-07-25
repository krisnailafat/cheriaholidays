import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItemCategory from "../ListItem/ListItemCategory";

const tourList = props => {
    return (
        <FlatList
            style={styles.listContainer}
            data={props.tours}
            keyExtractor={(item, index) => index}
            renderItem={(info) =>
                (
                <ListItemCategory
                    tourName={info.item.name}
                    tourImage={info.item.images}
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
