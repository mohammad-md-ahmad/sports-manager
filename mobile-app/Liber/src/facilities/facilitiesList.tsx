import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FETCH_RESULTS, useFetchFacility } from '../hooks/useFetchFacility';
import FacilityView from './facilityView';
import Loader from '../common/loader';
import { NewLoader } from '../common/newLoader';
import FacilityCard from '../common/facilityCard';

const FacilitiesList = () => {
    const flatListRef = useRef(null);

    const {
        isLoading: isLoadingTop,
        success: successTop,
        facilities: usersTop,
        errorMessage: errorMessageTop,
        getFacilities: getUsersTop,
    } = useFetchFacility();

    const {
        isLoading: isLoadingBottom,
        success: successBottom,
        facilities: usersBottom,
        errorMessage: errorMessageBottom,
        getFacilities: getUsersBottom,
    } = useFetchFacility();

    const [combinedUsers, setConfirmedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [isTop, setIsTop] = useState(false);

    const loadMoreItem = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setIsTop(true);
        loadMoreItem();
    }, []);

    const scrollToItem = (index) => {
        flatListRef.current.scrollToIndex({ index: index, animated: false });
    };

    useEffect(() => {
        if (isTop) {
            getUsersTop(isTop);
        } else {
            getUsersBottom(isTop);
        }
    }, []);

    useEffect(() => {
        if (successTop) {
            setRefreshing(false);
            setConfirmedUsers(usersTop);

            if (combinedUsers.length > 0) {
                scrollToItem(FETCH_RESULTS - 1);
            }
        }
    }, [successTop]);

    useEffect(() => {
        if (successBottom) {
            setConfirmedUsers(usersBottom);
        }
    }, [successBottom]);

    useEffect(() => {
        console.log({ isLoadingBottom });
    }, [isLoadingBottom]);

    return (
        <View>
            <Text
                style={{
                    textAlign: 'center',
                    paddingVertical: 10,
                    fontSize: 18,
                    fontWeight: '600',
                }}
            >
                Combined Bidirectional FlatList
            </Text>
            {errorMessageTop ? <Text>{errorMessageTop}</Text> : null}
            <FlatList
                ref={flatListRef}
                data={combinedUsers}
                renderItem={({ item }) => <FacilityCard facility={item} />}
                keyExtractor={item => item.uuid}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    // tintColor='red'
                    // colors={['red', 'green', 'blue']}
                    // progressBackgroundColor={'green'}
                    // title='Loading users...'
                    // titleColor='green'
                    // size={'large'}
                    // progressViewOffset={200}

                    // tintColor='transparent'
                    // colors={['transparent']}
                    // style={{ backgroundColor: 'transparent' }}
                    />
                }
                maxToRenderPerBatch={FETCH_RESULTS}
                ListHeaderComponent={<NewLoader isLoading={refreshing} withText={true} />}
                ListFooterComponent={<NewLoader isLoading={isLoadingBottom} />}
                onEndReached={() => {
                    loadMoreItem();
                    setIsTop(false);
                }}
                onEndReachedThreshold={0}
                ListEmptyComponent={<NewLoader isLoading />}
                // initialScrollIndex={0}
                // Layout doesn't know the exact location of the requested element.
                // Falling back to calculating the destination manually
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                    flatListRef.current?.scrollToOffset({
                        offset: index * averageItemLength,
                        animated: true,
                    });
                }}
            />

            {errorMessageBottom ? <Text>{errorMessageBottom}</Text> : null}
        </View>
    );
};

export default FacilitiesList;

const styles = StyleSheet.create({});
