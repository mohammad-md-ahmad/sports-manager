import React, { Component, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import testIDs from './testIDs';
import { useFocusEffect } from '@react-navigation/native';
import ScheduleService from '../../api/ScheduleService';



export default function AgendaScreen(): React.JSX.Element {

    const scheduleService = new ScheduleService();
    const [items, setItems] = useState(undefined);

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so we add 1
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;



    const reservationsKeyExtractor = (item, index) => {
        return `${item?.reservation?.day}${index}`;
    };


    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            scheduleService.getCompanySchedule({})
                .then((response) => {
                    // const result = {};
                    // console.log(response.data?.data)
                    // for (const key in response.data?.data) {
                    //     result[key] = [response.data?.data[key],response.data?.data[key],response.data?.data[key],response.data?.data[key]];
                    // }
                    // console.log(result)
                    // setItems(result);
                    setItems(response.data?.data);
                }).catch((error) => {
                });
        }, [])
    );


    const loadItems = (day: DateData) => {
        // console.log(day);
        // scheduleService.getCompanySchedule({ date: day.dateString })
        //     .then((response) => {
        //         console.log(response);
        //         //let data = { ...items };
        //        // data[day.dateString] = response.data?.data
        //         setItems(response.data?.data);
        //     }).catch((error) => {
        //     });
    };


    const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst && false ? 16 : 14;
        const color = isFirst && false ? 'black' : '#43515c';

        return (
            <TouchableOpacity
                testID={testIDs.agenda.ITEM}
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.date_time_from)}
            >
                <Text style={{ fontSize, color }}>{reservation.date_time_from}</Text>
                <Text style={{ fontSize, color }}>{reservation.date_time_to}</Text>
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
            markingType={'dot'}
            // markedDates={{
            //     '2023-11-08': { color: 'red' },
            //     '2023-11-09': { color: 'red' },
            //     // '2023-10-14': { startingDay: true, endingDay: true, color: 'blue' },
            //     // '2023-10-21': { startingDay: true, color: 'blue' },
            //     // '2023-10-22': { endingDay: true, color: 'gray' },
            //     // '2023-10-24': { startingDay: true, color: 'gray' },
            //     // '2023-10-25': { color: 'gray' },
            //     // '2023-10-26': { endingDay: true, color: 'gray' }
            // }}
            //monthFormat={'yyyy'}
            //theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
            //renderDay={this.renderDay}
            //hideExtraDays={false}
            //showOnlySelectedDayItems
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
    }
});