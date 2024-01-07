import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Agenda, DateData, AgendaEntry } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ScheduleService from '../../api/ScheduleService';
import colors from '../../styles/colors';
import { Button, Icon } from 'react-native-elements';
import globalStyles from '../../styles/styles';
import { BookingStatus, Screens, SlotStatus, UserType } from '../../helpers/constants';
import { getUserData } from '../../helpers/userDataManage';
import BookingService from '../../api/BookingService';
import { useSelector } from 'react-redux';
import fonts from '../../styles/fonts';
import { getCompanyData } from '../../helpers/companyDataManage';
import DeleteConfirmation from '../common/deleteConfirmation';

export default function AgendaScreen({ route }): React.JSX.Element {
    const { facility } = route?.params ?? { facility: null };
    const navigator = useNavigation();
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


    const reservationsKeyExtractor = (item, index) => {
        return `${item?.reservation?.day}${index}`;
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
                    disabled: userData?.type == UserType.CustomerUser,
                    dots: [{ color: colors.SecondaryRed }]
                }
            }
            else {
                if (hasAvailableSlot) {
                    options[day].dots.push({ color: colors.PrimaryGreen, selectedDotColor: colors.White })
                }

                if (hasPendingSlot) {
                    options[day].dots.push({ color: colors.Orange })
                }

                if (hasBookedSlot) {
                    options[day].dots.push({ color: colors.SecondaryRed })
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

    const companyData = useSelector(state => state.companyData);

    const [currentCompanyData, setCurrentCompanyData] = useState({});
    useEffect(() => {
        getCompanyData().then((data: string | null) => {
            setCurrentCompanyData(data === null ? null : JSON.parse(data));
        });
    }, []);

    const loadData = (month = null) => {
        month = month || currentMonth;

        setItems({});
        setItemsOptions({});

        let params = {
            'year_month': month
        }

        if (facility) {
            params['facility_uuid'] = facility.uuid;
        }

        if (companyData)
            params['company_uuid'] = companyData.uuid;

        scheduleService.getSchedule(params)
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

    const onBookPress = (reservation): void => {

        bookingService.bookRequest({ schedule_details_uuid: reservation.slot_uuid })
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

    const onApprovePress = (reservation: AgendaEntry): void => {
        bookingService.bookApprove({ uuid: reservation.uuid })
            .then((response) => {
                loadData();
            }).catch((error) => {
            }).finally(() => {
                closeModal();
            })
    }

    const onDeclinePress = (reservation: AgendaEntry): void => {
        bookingService.bookDecline({ uuid: reservation.uuid })
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
            } else if (booking?.status === BookingStatus.Approved) {
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

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [slotTobeDeleted, setSlotTobeDeleted] = useState(null);

    function onDeleteSlotPress(slot): void {
        setSlotTobeDeleted(slot);
        setIsDeleteModalVisible(true);
    }

    const handleDelete = () => {
        // Perform delete action
        scheduleService.deleteScheduleDetails(slotTobeDeleted.slot_uuid).then((response) => {
            // Handle a successful API response
            loadData();
            setIsDeleteModalVisible(false);
            setSlotTobeDeleted(null);
        }).catch((error) => {
            // Handle API request errors here
            setErrors(error.response.data.errors)
        });

    };

    const handleCancel = () => {
        setSlotTobeDeleted(null);
        setIsDeleteModalVisible(false);
    };

    function onEditSlotPress(slot): void {
        navigator.navigate(Screens.ScheduleEditForm, { 'schedule': slot })
    }

    const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst && false ? 16 : 14;
        const color = colors.PrimaryBlue;// isFirst && false ? 'black' : '#43515c';

        const StatusCircle = ({ color }) => (
            <View style={[styles.circle, { backgroundColor: color }]}></View>
        );

        // if (userData?.type == UserType.CustomerUser && reservation.status != SlotStatus.Available) {
        //     return <></>
        // }

        return (
            <TouchableOpacity
                style={[styles.item, { height: reservation.height }]}
                onPress={() => {
                    navigator.navigate(Screens.FacilityView, { 'facility': reservation?.facility })
                }}
            >
                <View style={styles.row}>
                    <Text style={styles.slotTitle}>{reservation?.company?.name}</Text>
                    <View style={styles.rightContent}>
                        {
                            (userData?.type == UserType.CompanyUser && currentCompanyData?.uuid == companyData?.uuid && reservation.status == SlotStatus.Available) ?
                                <>
                                    <TouchableOpacity
                                        onPress={() => onEditSlotPress(reservation)}>
                                        <View>
                                            <Icon
                                                name="edit" // Replace with your desired icon name
                                                type="material"
                                                size={25}
                                                color={colors.PrimaryBlue}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => onDeleteSlotPress(reservation)}>
                                        <View>
                                            <Icon
                                                name="delete" // Replace with your desired icon name
                                                type="material"
                                                size={25}
                                                color={colors.SecondaryRed}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </>
                                :
                                <></>
                        }
                        {
                            reservation.status != SlotStatus.Available ?
                                <StatusCircle color={getStatusColor(reservation.status)} />
                                :
                                <></>
                        }
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.slotDetails}>{reservation?.facility?.name}</Text>
                    <Text style={styles.slotDetails}>{reservation.date_time_from.split(' ')[1] + " - " + reservation.date_time_to.split(' ')[1]}</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.rightContent}>
                        {
                            userData?.type == UserType.CustomerUser ? reservation?.status != SlotStatus.Booked ? <Button
                                onPress={() => onBookPress(reservation)}
                                title="Book"
                                buttonStyle={styles.button}
                            /> : <></> :
                                (reservation?.bookings?.length > 0 && currentCompanyData?.uuid == companyData?.uuid) ?
                                    buildBookingBtns(reservation) : <></>
                        }
                    </View>
                </View>

            </TouchableOpacity >
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
    const [currentSlot, setCurrentSlot] = useState({});
    const [currentBooking, setCurrentBooking] = useState({});

    const toggleModal = (slot = {}, booking = {}) => {
        setCurrentSlot(slot);
        setCurrentBooking(booking);
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <>
            <DeleteConfirmation
                isVisible={isDeleteModalVisible}
                onDelete={handleDelete}
                onCancel={handleCancel}
            />
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
                            <Text>Booked By: {currentBooking?.customer_user?.full_name}</Text>
                            <Text>Date: {currentSlot?.date_time_from?.split(' ')[0]}</Text>
                            <Text>Time: {currentSlot?.date_time_from?.split(' ')[1] + " - " + currentSlot?.date_time_to?.split(' ')[1]}</Text>
                        </View>
                        {
                            currentBooking?.status == BookingStatus.Pending ?
                                <View style={styles.buttonRow}>
                                    <Button
                                        onPress={() => onApprovePress(currentBooking)}
                                        title="Approve"
                                        buttonStyle={styles.approveButton}
                                    />
                                    <Button
                                        onPress={() => onDeclinePress(currentBooking)}
                                        title="Reject"
                                        buttonStyle={styles.rejectButton}
                                    />
                                </View> : <></>
                        }

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
        flexDirection: 'row',
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
    slotTitle: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.regular,
        fontSize: 16,
        color: colors.PrimaryBlue,
    },
    slotDetails: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        fontSize: 14,
        color: colors.Gray,
    },
});
