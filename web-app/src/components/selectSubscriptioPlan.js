import React from 'react';
import Head from 'next/head';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import {
    Box,
    Button,
    Container,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
    Card,
    TextField,
    CardActions,
    Checkbox,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
} from '@mui/material';

import { string, array, object as yupObject } from "yup";
import { useFormik } from 'formik';
import SubscriptionPlanService from 'api/SubscriptionPlanService';
import { useEffect, useRef, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import CompanyService from 'api/CompanyService';
import { format } from 'date-fns';

const SelectSubscriptioPlan = ({ open, onClose, onConfirm, company }) => {

    const subscriptionPlanService = new SubscriptionPlanService();
    const companyService = new CompanyService();
    const [plans, setPlans] = useState([]);

    const [selectPlan, setSelectPlan] = useState(null);

    const initialFormDataValues = {
        subscription_plan_uuid: "",
        price: "",
        effective_from: "",
        effective_to: "",
    }

    const formDataValidateSchema = yupObject().shape({
        subscription_plan_uuid: string().required('Plan is required'),
        price: string().required('Price is required'),
        effective_from: string().required('Effective from is required'),
        effective_to: string().required('Effective to is required'),
    });

    const initialTouched = {
        subscription_plan_uuid: false,
        price: false,
        effective_from: false,
        effective_to: false,
    }

    useEffect(() => {
        if (open) {
            formik.setFieldValue('subscription_plan_uuid', '');
            formik.setFieldValue('price', '');

            setSelectPlan(null)
        }
    }, [open])

    const formik = useFormik({
        validationSchema: formDataValidateSchema,
        initialValues: initialFormDataValues,
        initialTouched: initialTouched,
        onSubmit: async (values) => {
            try {

                console.log('validating')
                // Validate the form values using the validation schema
                await formDataValidateSchema.validate(values, { abortEarly: false });

                // If validation succeeds, you can proceed with your submit logic
                submitForm(values);
            } catch (errors) {
                // If validation fails, log the errors to the console
                console.error('Form validation errors:', errors);
            }
        }
    });

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        subscriptionPlanService.list().then((response) => {
            setPlans(response?.data?.data?.data)
        }).catch((error) => {
            // Handle API request errors here
            console.error(error);
            //throw new Error('Please check your email and password');
            throw new Error(error.message);
        });
    }

    const submitForm = (values) => {
        let data = { ...values }
        data['company_uuid'] = company?.uuid;


        console.log(data['effective_from']);
        console.log(data['effective_to']);

        if (data['effective_from'])
            data['effective_from'] = format(data['effective_from'], 'yyyy-MM-dd HH:mm:ss')

        if (data['effective_to'])
            data['effective_to'] = format(data['effective_to'], 'yyyy-MM-dd HH:mm:ss')

        console.log(data);
        companyService.setSubscriptionPlan(data).then((response) => {

        }).catch((error) => {
            // Handle API request errors here
            console.error(error);
            //throw new Error('Please check your email and password');
            throw new Error(error.message);
        }).finally(() => {
            if (onConfirm)
                onConfirm();
        });
    }

    const handleSelectChange = (field, value) => {
        setSelectPlan(value);
        formik.setFieldValue(field, value ? value['uuid'] : null);
        formik.setFieldValue('price', value ? value['decimal_price'] : null);
    }

    const handleDateChange = (field, date) => {
        console.log(field, date);
        formik.setFieldValue(field, date);
    };


    return (
        <form
            noValidate
            onSubmit={formik.handleSubmit}
        >
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Select Subscription Plan for {company?.name}</DialogTitle>
                <DialogContent>
                    <>
                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                py: 2
                            }}
                        >

                            <Container maxWidth="xl">
                                <Stack>
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <Grid
                                            xs={12}
                                            md={6}
                                            lg={6}
                                        >
                                            <Stack spacing={3}>
                                                <Autocomplete
                                                    options={plans}
                                                    value={selectPlan}
                                                    getOptionLabel={option => option['name'] ?? ''}
                                                    onChange={(event, value) => handleSelectChange('subscription_plan_uuid', value)}
                                                    renderInput={
                                                        params => (
                                                            <TextField
                                                                required
                                                                {...params}
                                                                label="Plan"
                                                                fullWidth
                                                                error={!!(formik.touched.subscription_plan_uuid && formik.errors.subscription_plan_uuid)}
                                                                helperText={formik.touched.subscription_plan_uuid && formik.errors.subscription_plan_uuid ? formik.errors.subscription_plan_uuid : ""}
                                                            />
                                                        )
                                                    }
                                                ></Autocomplete>

                                                <DatePicker
                                                    fullWidth
                                                    required
                                                    label="Effective From *"
                                                    name="effective_from"
                                                    value={formik.values.effective_from}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(value) => handleDateChange('effective_from', value)}
                                                    error={!!(formik.touched.effective_from && formik.errors.effective_from)}
                                                    helperText={formik.touched.effective_from && formik.errors.effective_from ? formik.errors.effective_from : ""}
                                                    renderInput={(params) => <TextField required {...params} />}
                                                />

                                            </Stack>
                                        </Grid>
                                        <Grid
                                            xs={12}
                                            md={6}
                                            lg={6}
                                        >
                                            <Stack spacing={3}>

                                                <TextField
                                                    fullWidth
                                                    label="Price"
                                                    name="price"
                                                    required
                                                    value={formik.values.price}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange('price')}
                                                    error={!!(formik.touched.price && formik.errors.price)}
                                                    helperText={formik.touched.price && formik.errors.price ? formik.errors.price : ""}
                                                />

                                                <DatePicker
                                                    fullWidth
                                                    required
                                                    label="Effective To *"
                                                    name="effective_to"
                                                    value={formik.values.effective_to}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(value) => handleDateChange('effective_to', value)}
                                                    error={!!(formik.touched.effective_to && formik.errors.effective_to)}
                                                    helperText={formik.touched.effective_to && formik.errors.effective_to ? formik.errors.effective_to : ""}
                                                    renderInput={(params) => <TextField required {...params} />}
                                                />

                                            </Stack>

                                        </Grid>
                                        <Grid
                                            xs={12}
                                            md={12}
                                            lg={12}
                                        >

                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Container>

                        </Box >
                    </>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button type='submit' color="secondary" onClick={formik.handleSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default SelectSubscriptioPlan;
