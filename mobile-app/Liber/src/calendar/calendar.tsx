import React, { Component, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Agenda, DateData, AgendaEntry } from 'react-native-calendars';
import testIDs from './testIDs';
import { useFocusEffect } from '@react-navigation/native';
import ScheduleService from '../../api/ScheduleService';
import colors from '../../styles/colors';
import { Button } from 'react-native-elements';
import globalStyles from '../../styles/styles';
import { BookingStatus, UserType } from '../../helpers/constants';
import { getUserData } from '../../helpers/userDataManage';
import BookingService from '../../api/BookingService';



export default function AgendaScreen(): React.JSX.Element {

    const scheduleService = new ScheduleService();
    const bookingService = new BookingService();
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
            let hasBookedSlot = false;
            let hasAvailableSlot = false;
            let hasPendeingSlot = false;

            currentItem.forEach(slot => {
                dayIsFullyBooked = dayIsFullyBooked && slot.status == BookingStatus.Booked;
                hasBookedSlot = hasBookedSlot || slot.status == BookingStatus.Booked;
                hasAvailableSlot = hasAvailableSlot || slot.status == BookingStatus.Available;
                hasPendeingSlot = hasPendeingSlot || slot.status == BookingStatus.Pending;
            });

            if (dayIsFullyBooked) {
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

                    if (hasBookedSlot) {
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
            loadData();
    }, [userData]);


    const loadItems = (day: DateData) => {
        if (items && !items[day.dateString]) {
            items[day.dateString] = [];
        }
    };

    const loadData = () => {
        setItems({});
        scheduleService.getCompanySchedule({})
            .then((response) => {
                let result = {};
                for (const key in response.data?.data) {
                    result[key] = [response.data?.data[key], response.data?.data[key], response.data?.data[key]];
                }
                buildItemsOptions(result);
                setItems(result);

                // buildItemsOptions(response.data?.data);
                // setItems(response.data?.data);

            }).catch((error) => {
            });
    }

    const onBookPress = (reservation): void => {

        bookingService.bookRequest({ schedule_details_uuid: reservation.uuid })
            .then((response) => {
                console.log('booking', response)
                loadData();
            }).catch((error) => {
                console.log(error);
            });
    }

    const getStatusColor = (status: any): any => {
        switch (status) {
            case BookingStatus.Available:
                return colors.White
            case BookingStatus.Pending:
                return colors.Orange
            case BookingStatus.Booked:
                return colors.SecondaryRed
            default:
                return colors.White
        };
    }

    const onApprovePress = (reservation: AgendaEntry): void => {
        console.log(reservation);
        bookingService.bookApprove({ schedule_details_uuid: reservation.uuid })
            .then((response) => {
                loadData();
            }).catch((error) => {
                console.log(error);
            });
    }

    const onDeclinePress = (reservation: AgendaEntry): void => {
        bookingService.bookDecline({ schedule_details_uuid: reservation.uuid })
            .then((response) => {
                console.log('onDeclinePress', response)
                loadData();
            }).catch((error) => {
                console.log(error);
            });
    }

    const onViewPress = (reservation: AgendaEntry): void => {
        toggleModal(reservation);
    }

    const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst && false ? 16 : 14;
        const color = isFirst && false ? 'black' : '#43515c';

        const StatusCircle = ({ color }) => (
            <View style={[styles.circle, { backgroundColor: color }]}></View>
        );

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
                            /> :
                                reservation.status == BookingStatus.Pending ?
                                    <View style={styles.buttonRow}>
                                        <Button
                                            onPress={() => onApprovePress(reservation)}
                                            title="Approve"
                                            buttonStyle={styles.approveButton}
                                        />
                                        <Button
                                            onPress={() => onDeclinePress(reservation)}
                                            title="Reject"
                                            buttonStyle={styles.rejectButton}
                                        />
                                        <Button
                                            onPress={() => onViewPress(reservation)}
                                            title="View"
                                            buttonStyle={styles.viewButton}
                                        />
                                    </View>
                                    : <></>
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

    const [isModalVisible, setModalVisible] = useState(false);
    const [currentReservation, setCurrentReservation] = useState({});


    const toggleModal = (reservation = {}) => {
        setCurrentReservation(reservation);
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <>
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
                }
                //monthFormat={'yyyy'}
                theme={{
                    agendaKnobColor: colors.PrimaryGreen,
                    selectedDayBackgroundColor: colors.PrimaryGreen,
                    todayTextColor: colors.PrimaryGreen
                }}
                //renderDay={this.renderDay}
                //hideExtraDays={false}
                //showOnlySelectedDayItems
                disableAllTouchEventsForDisabledDays
                minDate={formattedThirtyDaysAgo}
                maxDate={formattedThirtyDaysFromNow}
                reservationsKeyExtractor={reservationsKeyExtractor}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPressOut={closeModal}
                >
                    <View style={styles.modalContent}>
                        <View>
                            <Text>{currentReservation?.date_time_from?.split(' ')[0]}</Text>
                            <Text>{currentReservation?.date_time_from?.split(' ')[1] + " - " + currentReservation?.date_time_to?.split(' ')[1]}</Text>
                        </View>
                        <View style={styles.buttonRow}>
                            <Button
                                onPress={() => onApprovePress(currentReservation)}
                                title="Approve"
                                buttonStyle={styles.approveButton}
                            />
                            <Button
                                onPress={() => onDeclinePress(currentReservation)}
                                title="Reject"
                                buttonStyle={styles.rejectButton}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
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
        marginHorizontal: 5,
    },
    approveButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
    },
    rejectButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
        backgroundColor: colors.SecondaryRed,
    },
    viewButton: {
        ...globalStyles.button,
        width: 80,
        marginHorizontal: 5,
        backgroundColor: colors.Orange,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Adjust this to control the spacing between buttons
        alignItems: 'center',
        marginTop: 20,
    },


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        height: '50%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

});

