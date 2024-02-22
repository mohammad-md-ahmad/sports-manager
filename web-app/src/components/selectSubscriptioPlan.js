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

const SelectSubscriptioPlan = ({ open, onClose, onConfirm, company }) => {

    const subscriptionPlanService = new SubscriptionPlanService();
    const [plans, setPlans] = useState([]);

    const [selectPlan, setSelectPlan] = useState(null);

    const initialFormDataValues = {
        plan_uuid: "",
        price: "",
    }

    const formDataValidateSchema = yupObject().shape({
        plan_uuid: string().required('Plan is required'),
        price: string().required('Price is required'),
    });

    const initialTouched = {
        plan_uuid: false,
        price: false,
    }

    useEffect(() => {
        if (open) {
            formik.setFieldValue('plan_uuid', '');
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
        data['uuid'] = company?.uuid;

        subscriptionPlanService.setSubscriptionPlan(data).then((response) => {

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
        formik.setFieldValue('price', value ? value['price'] : null);
    }

    return (
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
                        <form
                            noValidate
                            onSubmit={formik.handleSubmit}
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
                                                    onChange={(event, value) => handleSelectChange('plan_uuid', value)}
                                                    renderInput={
                                                        params => (
                                                            <TextField
                                                                required
                                                                {...params}
                                                                label="Plan"
                                                                fullWidth
                                                                error={!!(formik.touched.plan_uuid && formik.errors.plan_uuid)}
                                                                helperText={formik.touched.plan_uuid && formik.errors.plan_uuid ? formik.errors.plan_uuid : ""}
                                                            />
                                                        )
                                                    }
                                                ></Autocomplete>


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
                        </form>
                    </Box >
                </>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button type='submit' color="secondary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectSubscriptioPlan;
