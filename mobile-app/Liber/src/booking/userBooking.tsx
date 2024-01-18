import React, { Component, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Agenda, DateData, AgendaEntry } from 'react-native-calendars';
import calendarIDs from './calendarIDs';
import { useFocusEffect } from '@react-navigation/native';
import ScheduleService from '../../api/ScheduleService';
import colors from '../../styles/colors';
import { Button } from 'react-native-elements';
import globalStyles from '../../styles/styles';
import { BookingStatus, SlotStatus, UserType } from '../../helpers/constants';
import { getUserData } from '../../helpers/userDataManage';
import BookingService from '../../api/BookingService';
import { date } from 'yup';
import fonts from '../../styles/fonts';

export default function UserBooking(): React.JSX.Element {

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
    let currentMonth = getMonth(currentDate);
    const formattedDate = formatDate(currentDate);

    // Calculate the date 30 days ago
    var thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Calculate the date 30 days from now
    var thirtyDaysFromNow = new Date(currentDate);
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    var formattedThirtyDaysAgo = formatDate(thirtyDaysAgo);
    var formattedThirtyDaysFromNow = formatDate(thirtyDaysFromNow);


    const slotsKeyExtractor = (item, index) => {
        return `${item?.slot?.day}${index}`;
    };

    const [userData, setUserData] = useState({});

    const buildItemsOptions = (data) => {
        let days = {};
        let options = {};

        for (const day in data) {
            let daySlots = data[day]?.data;
            let flags = data[day]?.flags;

            days[day] = daySlots;
            options[day] = { dots: [] }

            let dayIsFullyBooked = flags?.dayIsFullyBooked;
            let hasBookedSlot = flags?.hasBookedSlot;
            let hasAvailableSlot = flags?.hasAvailableSlot;
            let hasPendingSlot = flags?.hasPendingSlot;

            if (dayIsFullyBooked) {
                options[day] = {
                    // disabled: userData?.type == UserType.CustomerUser,
                    dots: [{ color: colors.SecondaryRed }]
                }
            }
            else {
                if (hasAvailableSlot) {
                    // options[day].dots.push({ color: colors.PrimaryGreen, selectedDotColor: colors.White })
                }

                if (userData?.type == UserType.CustomerUser) {
                    if (hasPendingSlot) {
                        options[day].dots.push({ color: colors.Orange })
                    }

                    if (hasBookedSlot) {
                        options[day].dots.push({ color: colors.SecondaryRed })
                    }
                }
            }
        }

        setItems(days);
        setItemsOptions(options);
    };

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
        if (userData.type) {
            loadData();
        }
    }, [userData]);

    const loadItems = (day: DateData) => {
        let month;

        if (items && !items[day.dateString]) {
            items[day.dateString] = [];

            if (!month) {
                month = day.dateString;
            }
        }

        currentMonth = day.year + '-' + String(day.month).padStart(2, '0');

        // loadData(currentMonth);
    };

    function getMonth(date) {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    }

    const loadData = (month) => {
        month = month || currentMonth;

        setItems({});
        setItemsOptions({});

        let requestData = {
            'year_month': month
        };

        if (userData?.type == UserType.CustomerUser) {
            requestData['customer_user_uuid'] = userData?.uuid;
        }

        scheduleService.getSchedule(requestData)
            .then((response) => {
                // let result = {};

                // for (const key in response.data?.data) {
                //     result[key] = response.data?.data[key];
                // }

                // buildItemsOptions(result);
                // setItems(result);

                buildItemsOptions(response.data?.data);
                // setItems(response.data?.data);

            }).catch((error) => {
            });
    }

    const onBookPress = (slot): void => {

        bookingService.bookRequest({ schedule_details_uuid: slot.slot_uuid })
            .then((response) => {
                loadData();
            }).catch((error) => {
            });
    }

    const getStatusColor = (status: any): any => {
        switch (status) {
            case SlotStatus.Available:
                return colors.White
            case SlotStatus.Pending:
                return colors.Orange
            case SlotStatus.Booked:
                return colors.SecondaryRed
            default:
                return colors.White
        };
    }

    const onApprovePress = (slot: AgendaEntry): void => {
        bookingService.bookApprove({ uuid: slot.uuid })
            .then((response) => {
                loadData();
            }).catch((error) => {
            }).finally(() => {
                closeModal();
            })
    }

    const onDeclinePress = (slot: AgendaEntry): void => {
        bookingService.bookDecline({ uuid: slot.uuid })
            .then((response) => {
                loadData();
            }).catch((error) => {
            }).finally(() => {
                closeModal();
            })
    }

    const onViewPress = (slot, booking: AgendaEntry): void => {
        toggleModal(slot, booking);
    }

    const buildBookingBtns = (slot) => {
        let btns = slot?.bookings.map(booking => {
            if (booking?.status === BookingStatus.Pending) {
                return <View style={styles.buttonRow}>
                    <Button
                        onPress={() => onApprovePress(booking)}
                        title="Approve"
                        buttonStyle={styles.approveButton}
                    />
                    <Button
                        onPress={() => onDeclinePress(booking)}
                        title="Reject"
                        buttonStyle={styles.rejectButton}
                    />
                    <Button
                        onPress={() => onViewPress(slot, booking)}
                        title="View"
                        buttonStyle={styles.viewButton}
                    />
                </View>
            } else if (booking?.status === BookingStatus.Pending) {
                return <View style={styles.buttonRow}>
                    <Button
                        onPress={() => onViewPress(slot, booking)}
                        title="View"
                        buttonStyle={styles.viewButton}
                    />
                </View>
            }

            return null;
        });

        return btns;
    }

    const renderItem = (slot: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst && false ? 16 : 14;
        const color = isFirst && false ? 'black' : '#43515c';

        const StatusCircle = ({ color }) => (
            <View style={[styles.circle, { backgroundColor: color }]}></View>
        );

        // if (userData?.type == UserType.CustomerUser && slot.status != SlotStatus.Available) {
        //     return <></>
        // }

        return (
            <TouchableOpacity
                style={[styles.item, { height: slot.height }]}
                onPress={() => toggleModal(slot, slot?.bookings)}
            >

                <View style={styles.row}>
                    <Text style={{ fontSize, color }}>{slot?.company?.name}</Text>
                    <View style={styles.rightContent}>
                        <StatusCircle color={getStatusColor(slot.status)} />
                    </View>
                </View>


                <View style={styles.row}>
                    <Text style={{ fontSize, color }}>{slot?.facility?.name}</Text>
                    <Text style={{ fontSize, color }}>{slot.date_time_from.split(' ')[1] + " - " + slot.date_time_to.split(' ')[1]}</Text>

                </View>

                <View style={styles.row}>
                    <View style={styles.rightContent}>
                        {
                            userData?.type == UserType.CustomerUser ?
                                <Button
                                    onPress={() => onViewPress(slot, slot.booking)}
                                    title="View"
                                    buttonStyle={styles.viewButton}
                                />
                                : <></>
                        }
                    </View>
                </View>

            </TouchableOpacity >
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text style={{ ...globalStyles.text }}>This is empty date!</Text>
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
    const [currentSlot, setCurrentSlot] = useState({});
    const [currentBooking, setCurrentBooking] = useState({});

    const toggleModal = (slot = {}, booking = {}) => {
        setCurrentSlot(slot);
        console.log("slot", slot)
        console.log("booking", booking)
        setCurrentBooking(booking);
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <>
            <Agenda
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
                slotsKeyExtractor={slotsKeyExtractor}
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
                            <Text style={styles.text}>Date: {currentSlot?.date_time_from?.split(' ')[0]}</Text>
                            <Text style={styles.text}>Time: {currentSlot?.date_time_from?.split(' ')[1] + " - " + currentSlot?.date_time_to?.split(' ')[1]}</Text>
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
    text: {
        ...globalStyles.text,
        color: colors.Black,
        fontFamily: fonts.Poppins.regular,
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
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
});
