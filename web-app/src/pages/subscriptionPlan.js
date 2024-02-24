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
    CardContent,
    Avatar,
    Divider,
    Autocomplete
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { useRouter } from 'next/router';
import { string, array, object as yupObject } from "yup";
import { useFormik } from 'formik';
import SubscriptionPlanService from 'api/SubscriptionPlanService';
import { useEffect, useRef, useState } from 'react';
import MiscService from 'api/MiscService';

const Page = () => {
    const subscriptionPlanService = new SubscriptionPlanService();
    const miscService = new MiscService();
    const router = useRouter();

    const planId = router?.query?.id ?? null;

    const initialFormDataValues = {
        name: "",
        decimal_price: "",
        currency_uuid: "",
        description: "",
        type: "",
        is_enabled: false,
    }

    const formDataValidateSchema = yupObject().shape({
        name: string().required('Name is required'),
        decimal_price: string().required('Price is required'),
        currency_uuid: string().required('Currency is required'),
        description: string().required('Description is required'),
        type: string().required('Type is required'),
    });

    const initialTouched = {
        name: false,
        decimal_price: false,
        currency_uuid: false,
        description: false,
        type: false,
        is_enabled: false,
    }

    const formik = useFormik({
        validationSchema: formDataValidateSchema,
        initialValues: initialFormDataValues,
        initialTouched: initialTouched,
        onSubmit: async (values) => {
            try {
                // Validate the form values using the validation schema
                console.log(values);
                await formDataValidateSchema.validate(values, { abortEarly: false });

                // If validation succeeds, you can proceed with your submit logic
                submitForm(values);
            } catch (errors) {
                // If validation fails, log the errors to the console
                console.error('Form validation errors:', errors);
            }
        }
    });

    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState({});

    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState({});

    useEffect(() => {
        miscService.lists().then((response) => {
            const subscription_plan_types = Object.entries(response.data?.data?.subscription_plan_types).map(([id, label]) => ({ id, label }));
            setTypes(subscription_plan_types);

            const currenciesData = response.data?.data?.currencies.map((currency) => {
                return {
                    id: currency?.uuid,
                    label: currency?.iso_short_code,
                }
            });

            setCurrencies(currenciesData);
        }).catch((error) => {
            console.log(error);
        });

        if (planId) {
            subscriptionPlanService.getPlan(planId).then(async (response) => {

                let planData = { ...response.data.data };
                planData.is_enabled = planData.is_enabled == 1;
                planData.currency_uuid = planData.currency?.uuid;
                formik.setValues(planData);
                console.log('planData', planData);
                setSelectedType({ id: planData?.type, label: planData?.type });
                setSelectedCurrency({ id: planData?.currency_uuid, label: planData?.currency?.iso_short_code });
            }).catch((error) => {
                // Handle API request errors here
                console.error(error);
                //throw new Error('Please check your email and password');
                throw new Error(error.message);
            });
        }
    }, []);

    const handleTypeSelectChange = (field, value) => {
        setSelectedType(value);
        formik.setFieldValue(field, value ? value['id'] : null);
    }

    const handleCurrencySelectChange = (field, value) => {
        setSelectedCurrency(value);
        formik.setFieldValue(field, value ? value['id'] : null);
    }

    const submitForm = (values) => {
        let data = { ...values }

        if (planId) {
            subscriptionPlanService.update(data).then((response) => {

            }).catch((error) => {
                // Handle API request errors here
                console.error(error);
                //throw new Error('Please check your email and password');
                throw new Error(error.message);
            });
        }
    }

    return (
        <>
            <Head>
                <title>
                    Subscription Plans | Liber
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <form
                    noValidate
                    onSubmit={formik.handleSubmit}
                >
                    <Container maxWidth="xl">
                        <Stack spacing={3}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={4}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="h4">
                                        Subscription Plan
                                    </Typography>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={1}
                                    >
                                    </Stack>
                                </Stack>
                                <div>
                                    <Button
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <CheckCircleIcon />
                                            </SvgIcon>
                                        )}
                                        variant="contained"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Stack>

                            <Card style={{ width: "100%" }}
                                sx={{
                                    px: 3,
                                    py: 3,
                                }}>
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
                                            <TextField
                                                fullWidth
                                                required
                                                label="Name"
                                                name="name"
                                                value={formik.values.name}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                error={!!(formik.touched.name && formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                                            />

                                            <Autocomplete
                                                options={currencies}
                                                value={selectedCurrency}
                                                getOptionLabel={option => option['label'] ?? ''}
                                                onChange={(event, value) => handleCurrencySelectChange('currency_uuid', value)}
                                                renderInput={
                                                    params => (
                                                        <TextField
                                                            {...params}
                                                            label="Currency"
                                                            fullWidth
                                                            error={!!(formik.touched.currency_uuid && formik.errors.currency_uuid)}
                                                            helperText={formik.touched.currency_uuid && formik.errors.currency_uuid ? formik.errors.currency_uuid : ""}
                                                        />
                                                    )
                                                }
                                            />

                                            <FormControl component="fieldset">
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formik.values.is_enabled}
                                                                onChange={formik.handleChange}
                                                                name="is_enabled"
                                                            />
                                                        }
                                                        label="Is Enabled"
                                                    />
                                                </FormGroup>
                                            </FormControl>

                                        </Stack>

                                    </Grid>
                                    <Grid
                                        xs={12}
                                        md={6}
                                        lg={6}
                                    >
                                        <Stack spacing={3}>
                                            <Autocomplete
                                                options={types}
                                                value={selectedType}
                                                getOptionLabel={option => option['label'] ?? ''}
                                                onChange={(event, value) => handleTypeSelectChange('type', value)}
                                                renderInput={
                                                    params => (
                                                        <TextField
                                                            {...params}
                                                            label="Type"
                                                            fullWidth
                                                            error={!!(formik.touched.type && formik.errors.type)}
                                                            helperText={formik.touched.type && formik.errors.type ? formik.errors.type : ""}
                                                        />
                                                    )
                                                }
                                            />

                                            <TextField
                                                fullWidth
                                                required
                                                label="Price"
                                                name="decimal_price"
                                                value={formik.values.decimal_price}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange('decimal_price')}
                                                error={!!(formik.touched.decimal_price && formik.errors.decimal_price)}
                                                helperText={formik.touched.decimal_price && formik.errors.decimal_price ? formik.errors.decimal_price : ""}
                                            />

                                        </Stack>
                                    </Grid>
                                    <Grid
                                        xs={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            multiline
                                            value={formik.values.description}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange('description')}
                                            error={!!(formik.touched.description && formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description ? formik.errors.description : ""}
                                        />
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <Stack spacing={3}>


                                        </Stack>
                                        <Grid
                                            xs={12}
                                            md={6}
                                            lg={6}
                                        >

                                        </Grid>
                                    </Grid>
                                </Grid>
                                <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <CheckCircleIcon />
                                            </SvgIcon>
                                        )}
                                        variant="contained"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </CardActions>
                            </Card>

                        </Stack>
                    </Container>
                </form>
            </Box >
        </>
    )
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
