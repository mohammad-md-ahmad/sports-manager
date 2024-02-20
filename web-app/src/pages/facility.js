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
  Autocomplete,
  CardActions,
  CardContent,
  Avatar,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useRef, useState } from 'react';
import FacilityService from 'api/FacilityService';

import { useRouter } from 'next/router';
import MiscService from 'api/MiscService';
import { string, array, object as yupObject } from "yup";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { imageUrlToBase64 } from 'helpers/functions';
import { useAuth } from 'src/hooks/use-auth';
import { TabPanel } from 'src/components/tabPanel';
import Facilities from 'src/components/facilities';

const Page = () => {

  const facilityService = new FacilityService();
  const miscService = new MiscService();
  const router = useRouter();

  const facilityId = router?.query?.id ?? null;
  const companyId = router?.query?.companyId ?? null;

  const initialFormDataValues = {
    name: '',
    type: '',
    sport_uuid: '',
    details: {
      length: '',
      width: '',
    },
    createAddressRequest: {
      line_1: '',
      line_2: '',
      line_3: '',
      city: '',
      region: '',
      postcode: '',
      country_uuid: '',
      geocode_data: {
        lat: '34',
        lng: '35',
      }
    },
  }

  const formDataValidateSchema = yupObject().shape({
    name: string().required('Name is required'),
    type: string().required('Type is required'),

    createAddressRequest: yupObject().shape({
      line_1: string().required('Line 1 is required'),
      city: string().required('City is required'),
      region: string().required('Region is required'),
      postcode: string().required('Postcode is required'),
      country_uuid: string().required('Country UUID is required'),
      geocode_data: yupObject().shape({
        lat: string().required('Latitude is required'),
        lng: string().required('Longitude is required'),
      }),
    }),
  });

  const initialTouched = {
    name: false,
    type: false,
    sport_uuid: false,
    details: {
      length: false,
      width: false,
    },
    createAddressRequest: {
      line_1: false,
      line_2: false,
      line_3: false,
      city: false,
      region: false,
      postcode: false,
      country_uuid: false,
      geocode_data: {
        lat: false,
        lng: false,
      }
    },
  }

  const formik = useFormik({
    validationSchema: formDataValidateSchema,
    initialValues: initialFormDataValues,
    initialTouched: initialTouched,
    onSubmit: async (values) => {
      try {
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


  const [countries, setCountries] = useState([]);
  const [selectCountry, setSelectCountry] = useState([]);

  const [facilityTypesEnum, setFacilityTypesEnum] = useState({});
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [selectType, setSelectType] = useState([]);

  const [sports, setSports] = useState([]);
  const [selectSport, setSelectSport] = useState([]);

  useEffect(() => {
    miscService.lists().then((response) => {
      setCountries(response.data?.data?.countries);
      setSports(response.data?.data?.sports);
      setFacilityTypesEnum(response.data?.data?.facility_types);

      let facilityTypesArray = [];
      Object.keys(response.data?.data?.facility_types).forEach(function (key) {
        facilityTypesArray.push({
          label: response.data?.data?.facility_types[key],
          value: key,
        });
      });

      setFacilityTypes(facilityTypesArray);

      if (facilityId) {
        facilityService.getFacility({ uuid: facilityId, companyUuid: companyId }).then(async (response) => {

          let facilityData = { ...response.data.data };
          facilityData['createAddressRequest'] = facilityData['address'];

          delete facilityData['address'];

          setSelectCountry(facilityData?.createAddressRequest?.country);
          setSelectSport(facilityData?.sport);

          loadImageData(facilityData);

          formik.setValues(facilityData);
        }).catch((error) => {
          // Handle API request errors here
          console.error(error);
          //throw new Error('Please check your email and password');
          throw new Error(error.message);
        });
      }
    }).catch((error) => {
      console.error(error);
    });

  }, [])
  const auth = useAuth();

  const loadImageData = async (facilityData) => {
    auth.setLoading(true);
    try {
      const base64Array = await Promise.all(
        facilityData.gallery.map(async item => await imageUrlToBase64(item.image))
      );
      setBase64Images(base64Array);
    } catch (error) {
      console.error('Error loading image data:', error);
    } finally {
      auth.setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    if (facilityTypesEnum && facilityTypesEnum[formik.values?.type])
      setSelectType({ value: formik.values?.type, label: facilityTypesEnum[formik.values?.type] })
  }, [facilityTypesEnum, formik?.values?.type])

  const handleSelectChange = (field, value) => {
    if (field == 'createAddressRequest.country_uuid') {
      setSelectCountry(value);
      formik.setFieldValue(field, value ? value['country_uuid'] : null);
    }

    if (field == 'sport_uuid') {
      setSelectSport(value);
      formik.setFieldValue(field, value ? value['uuid'] : null);
    }

    if (field == 'type') {
      setSelectType(value);
      formik.setFieldValue(field, value ? value['value'] : null);
    }
  }

  const submitForm = (values) => {
    let data = { ...values }
    data['companyUuid'] = companyId;
    data['companyFacilityPhotos'] = base64Images;

    if (facilityId) {
      data['address'] = data['createAddressRequest'];
      delete data['createAddressRequest'];

      facilityService.update(data).then((response) => {

      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    } else {
      facilityService.create(data).then((response) => {
        // router.push('/companies');
      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }

  }

  const [selectedImages, setSelectedImages] = useState([]);
  const [base64Images, setBase64Images] = useState([]);

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files);

    // Update selectedImages state
    setSelectedImages(files);

    // Convert each image to base64 and update base64Images state
    Promise.all(files.map(file => convertFileToBase64(file)))
      .then(base64Array => setBase64Images(base64Array))
      .catch(error => console.error('Error converting images to base64:', error));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>
          Facility | Liber
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
                    Facility
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
              <Grid
                container
                spacing={3}
                mt={1}
              >
                <Grid
                  xs={12}
                  md={12}
                  lg={12}
                >
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
                            label="Facility Name"
                            name="name"
                            value={formik.values.name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={!!(formik.touched.name && formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                          />

                          <Autocomplete
                            options={sports}
                            value={selectSport}
                            getOptionLabel={option => option['name'] ?? ''}
                            onChange={(event, value) => handleSelectChange('sport_uuid', value)}
                            renderInput={
                              params => (
                                <TextField
                                  required
                                  {...params}
                                  label="Sport"
                                  fullWidth
                                  error={!!(formik.touched.sport_uuid && formik.errors.sport_uuid)}
                                  helperText={formik.touched.sport_uuid && formik.errors.sport_uuid ? formik.errors.sport_uuid : ""}
                                />
                              )
                            }
                          ></Autocomplete>

                          <TextField
                            fullWidth
                            required
                            label="Region"
                            name="region"
                            value={formik.values.createAddressRequest.region}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.region')}
                            error={!!(formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region)}
                            helperText={formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region ? formik.errors.createAddressRequest?.region : ""}
                          />

                          <TextField
                            fullWidth
                            required
                            label="Line 1"
                            name="line_1"
                            value={formik.values.createAddressRequest.line_1}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_1')}
                            error={!!(formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1)}
                            helperText={formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1 ? formik.errors.createAddressRequest?.line_1 : ""}
                          />

                          <TextField
                            fullWidth
                            label="Line 3"
                            name="line_3"
                            value={formik.values.createAddressRequest.line_3}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_3')}
                            error={!!(formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3)}
                            helperText={formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3 ? formik.errors.createAddressRequest?.line_3 : ""}
                          />

                        </Stack>

                      </Grid>
                      <Grid
                        xs={12}
                        md={6}
                        lg={6}
                      >
                        <Stack spacing={3}>

                          <Autocomplete
                            options={facilityTypes}
                            value={selectType}
                            getOptionLabel={option => option['label'] ?? ''}
                            onChange={(event, value) => handleSelectChange('type', value)}
                            renderInput={
                              params => (
                                <TextField
                                  required
                                  {...params}
                                  label="Type"
                                  fullWidth
                                  error={!!(formik.touched.type && formik.errors.type)}
                                  helperText={formik.touched.type && formik.errors.type ? formik.errors.type : ""}
                                />
                              )
                            }
                          ></Autocomplete>

                          <Autocomplete
                            options={countries}
                            value={selectCountry}
                            getOptionLabel={option => option['name'] ?? ''}
                            onChange={(event, value) => handleSelectChange('createAddressRequest.country_uuid', value)}
                            renderInput={
                              params => (
                                <TextField
                                  required
                                  {...params}
                                  label="Country"
                                  fullWidth
                                  error={!!(formik.touched.createAddressRequest?.country_uuid && formik.errors.createAddressRequest?.country_uuid)}
                                  helperText={formik.touched.createAddressRequest?.country_uuid && formik.errors.createAddressRequest?.country_uuid ? formik.errors.createAddressRequest?.country_uuid : ""}
                                />
                              )
                            }
                          ></Autocomplete>

                          <TextField
                            fullWidth
                            required
                            label="City"
                            name="city"
                            value={formik.values.createAddressRequest.city}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.city')}
                            error={!!(formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city)}
                            helperText={formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city ? formik.errors.createAddressRequest?.city : ""}
                          />

                          <TextField
                            fullWidth
                            label="Line 2"
                            name="line_2"
                            value={formik.values.createAddressRequest.line_2}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_2')}
                            error={!!(formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2)}
                            helperText={formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2 ? formik.errors.createAddressRequest?.line_2 : ""}
                          />

                          <TextField
                            fullWidth
                            required
                            label="Postcode"
                            type='postcode'
                            value={formik.values.createAddressRequest.postcode}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.postcode')}
                            error={!!(formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode)}
                            helperText={formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode ? formik.errors.createAddressRequest?.postcode : ""}
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
                  </Card>
                </Grid>

                <Grid
                  xs={12}
                  md={12}
                  lg={12}
                >
                  <Card style={{ width: "100%" }}
                    sx={{
                      px: 3,
                    }}>
                    <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                      <label htmlFor="image-upload-input">
                        <Button variant="contained" component="span">
                          Upload Images
                        </Button>
                      </label>
                    </CardActions>
                    <CardContent>
                      <Stack spacing={3}>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            multiple
                            onChange={handleFilesChange}
                            id="image-upload-input"
                          />
                          <Grid container spacing={3}>
                            {base64Images.map((image, index) => (
                              <Grid item key={index} xs={4}>
                                <Card>
                                  <CardContent>
                                    <img
                                      src={base64Images[index]}
                                      alt={`Image ${index + 1}`}
                                      style={{ maxWidth: '100%', maxHeight: '150px' }}
                                    />
                                  </CardContent>

                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </div>
                      </Stack>
                    </CardContent>
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
                </Grid>
              </Grid>
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