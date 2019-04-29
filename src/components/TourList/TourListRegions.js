import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItemRegion from "../ListItem/ListItemRegion";

const tourListRegion = props => {
    return (
        <FlatList
            style={styles.listContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={props.tours}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(info) =>
                (
                    <ListItemRegion
                        tourName={info.item.name}
                        tourImage={info.item.images}
                        onItemPressed={() => props.onItemSelected(info.item)}
                    />
                )
            }
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        width: "100%"
    }
});

export default tourListRegion;
