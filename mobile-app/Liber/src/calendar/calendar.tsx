import React, { Component, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import testIDs from './testIDs';
import { useFocusEffect } from '@react-navigation/native';
import ScheduleService from '../../api/ScheduleService';
import colors from '../../styles/colors';
import { Button } from 'react-native-elements';
import globalStyles from '../../styles/styles';
import { BookingStatus, UserType } from '../../helpers/constants';
import { getUserData } from '../../helpers/userDataManage';



export default function AgendaScreen(): React.JSX.Element {

    const scheduleService = new ScheduleService();
    const [items, setItems] = useState(undefined);
    const [itemsOptions, setItemsOptions] = useState({});



    const formatDate = (date) => {
        var yyyy = date.getFullYear();
        var mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
        var dd = String(date.getDate()).padStart(2, '0');
        return yyyy + '-' + mm + '-' + dd;
    }

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    // Calculate the date 30 days ago
    var thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Calculate the date 30 days from now
    var thirtyDaysFromNow = new Date(currentDate);
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    var formattedThirtyDaysAgo = formatDate(thirtyDaysAgo);
    var formattedThirtyDaysFromNow = formatDate(thirtyDaysFromNow);


    const reservationsKeyExtractor = (item, index) => {
        return `${item?.reservation?.day}${index}`;
    };

    const [userData, setUserData] = useState({});

    const buildItemsOptions = (items) => {
        let options = {}
        for (const key in items) {
            options[key] = { dots: [] }

            let currentItem = items[key];
            let dayIsFullyBooked = true;
            let hasReservedSlot = false;
            let hasAvailableSlot = false;
            let hasPendeingSlot = false;

            currentItem.forEach(slot => {
                dayIsFullyBooked = dayIsFullyBooked && slot.status == BookingStatus.Reserverd;
                hasReservedSlot = hasReservedSlot || slot.status == BookingStatus.Reserverd || true;
                hasAvailableSlot = hasAvailableSlot || slot.status == BookingStatus.Available || true;
                hasPendeingSlot = hasPendeingSlot || slot.status == BookingStatus.Pending || true;
            });

            if (dayIsFullyBooked || key == '2023-11-10' || key == '2023-11-06' || key == '2023-11-07') {
                options[key] = {
                    disabled: userData?.type == UserType.CompanyUser ? false : true,
                    dots: [{ color: colors.SecondaryRed }]
                }
            }
            else {
                if (hasAvailableSlot) {
                    options[key].dots.push({ color: colors.PrimaryGreen, selectedDotColor: colors.White })
                }

                if (userData?.type == UserType.CompanyUser) {
                    if (hasPendeingSlot) {
                        options[key].dots.push({ color: colors.Orange })
                    }

                    if (hasReservedSlot) {
                        options[key].dots.push({ color: colors.SecondaryRed })
                    }
                }
            }
        }

        setItemsOptions(options);
    }


    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            getUserData().then((data: string | null) => {
                setUserData(data === null ? null : JSON.parse(data));
            });

        }, [])
    );

    useEffect(() => {
        if (userData.type)
            scheduleService.getCompanySchedule({})
                .then((response) => {
                    const result = {};
                    for (const key in response.data?.data) {
                        //response.data?.data[key].marked = true;
                        result[key] = [response.data?.data[key], response.data?.data[key], response.data?.data[key], response.data?.data[key]];
                    }
                    buildItemsOptions(result);
                    setItems(result);

                    // setItems(response.data?.data);

                }).catch((error) => {
                });
    }, [userData]);


    const loadItems = (day: DateData) => {
        if (items && !items[day.dateString]) {
            items[day.dateString] = [];
        }
    };


    const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst && false ? 16 : 14;
        const color = isFirst && false ? 'black' : '#43515c';

        const StatusCircle = ({ color }) => (
            <View style={[styles.circle, { backgroundColor: color }]}></View>
        );


        function onBookPress(reservation): void {
            scheduleService.bookRequest({ uuid: reservation.uuid })
                .then((response) => {

                }).catch((error) => {
                });
        }

        function getStatusColor(status: any): any {
            switch (status) {
                case BookingStatus.Available:
                    return colors.White
                case BookingStatus.Pending:
                    return colors.Orange
                case BookingStatus.Reserverd:
                    return colors.SecondaryRed
                default:
                    return colors.White
            };
        }

        if (userData?.type == UserType.CustomerUser && reservation.status != BookingStatus.Available) {
            return <></>
        }

        return (
            <TouchableOpacity
                testID={testIDs.agenda.ITEM}
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.date_time_from)}
            >
                <View style={styles.row}>
                    <Text style={{ fontSize, color }}>{reservation.date_time_from.split(' ')[1] + " - " + reservation.date_time_to.split(' ')[1]}</Text>
                    <View style={styles.rightContent}>
                        <StatusCircle color={getStatusColor(reservation.status)} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.rightContent}>
                        {
                            userData?.type == UserType.CustomerUser ? <Button
                                onPress={() => onBookPress(reservation)}
                                title="Book"
                                buttonStyle={styles.button}
                            /> : <></>
                        }
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name !== r2.name;
    };

    const timeToString = (time: number) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }


    return (
        <Agenda
            testID={testIDs.agenda.CONTAINER}
            items={items}
            loadItemsForMonth={loadItems}
            selected={formattedDate}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
            showClosingKnob={true}
            //onDayChange={loadItems}
            markingType={'multi-dot'}
            markedDates={
                itemsOptions
                //     {
                //     //     '2023-11-08': { color: 'green' },
                //     '2023-11-10': { dots: [{ color: colors.SecondaryRed }, { color: colors.PrimaryGreen, selectedDotColor: colors.White }] },
                //     '2023-11-11': { disabled: true, dots: [{ color: colors.PrimaryGreen, selectedDotColor: colors.White }, { color: colors.SecondaryRed }] },
                //     '2023-11-12': { dots: [{ color: colors.Orange }] },
                //     //     '2012-11-10': { disabled: true },
                //     //     //     '2023-11-08': { color: 'red' },
                //     //     //     '2023-11-09': { color: 'red' },
                //     //     //     // '2023-10-14': { startingDay: true, endingDay: true, color: 'blue' },
                //     //     //     // '2023-10-21': { startingDay: true, color: 'blue' },
                //     //     //     // '2023-10-22': { endingDay: true, color: 'gray' },
                //     //     //     // '2023-10-24': { startingDay: true, color: 'gray' },
                //     //     //     // '2023-10-25': { color: 'gray' },
                //     //     //     // '2023-10-26': { endingDay: true, color: 'gray' }
                // }
            }
            //monthFormat={'yyyy'}
            theme={{ agendaKnobColor: colors.PrimaryGreen, selectedDayBackgroundColor: colors.PrimaryGreen, todayTextColor: colors.PrimaryGreen }}
            //renderDay={this.renderDay}
            //hideExtraDays={false}
            //showOnlySelectedDayItems
            disableAllTouchEventsForDisabledDays
            minDate={formattedThirtyDaysAgo}
            maxDate={formattedThirtyDaysFromNow}
            reservationsKeyExtractor={reservationsKeyExtractor}
        />
    );

}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: 'green'
    },
    dayItem: {
        marginLeft: 34
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rightContent: {
        alignItems: 'flex-end', // Move the circle to the right
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    button: {
        ...globalStyles.button,
        width: 100,
    },
});