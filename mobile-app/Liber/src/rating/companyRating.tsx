import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    VirtualizedList,
} from "react-native";
import RatingService from "../../api/RatingService";
import colors from "../../styles/colors";
import RatingItem from "./ratingItem";
import { useSelector } from "react-redux";

export default function CompanyRating(): React.JSX.Element {
    const ratingService = new RatingService();
    const companyData = useSelector(state => state.companyData);

    const [companyRatingList, setCompanyRatingList] = useState([]);

    useEffect(() => {
        if (companyData?.uuid)
            loadCompanyRatingList();
    }, [companyData]);

    const loadCompanyRatingList = () => {
        ratingService.companyRatingList({ uuid: companyData?.uuid }).then((response) => {
            console.log(response.data?.data);
            setCompanyRatingList(response.data?.data?.ratings ?? []);
        }).catch((error) => {
            console.error(error);
        });
    };

    const getItem = (_data: unknown, index: number) => companyRatingList[index] ?? 0;
    const getItemCount = (_data: unknown) => companyRatingList?.length ?? 0;

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                initialNumToRender={6}
                renderItem={({ item }) => <RatingItem rating={item} />}
                keyExtractor={item => item.uuid}
                getItemCount={getItemCount}
                getItem={getItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 0,

    },
    item: {
        backgroundColor: colors.PrimaryBlue,
        height: 150,
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 20,
    },
    title: {
        fontSize: 32,
    },
});

