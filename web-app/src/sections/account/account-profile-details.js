import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Autocomplete
} from '@mui/material';
import MiscService from 'api/MiscService';


export const AccountProfileDetails = ({ user }) => {
  const [values, setValues] = useState(user);

  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState({});

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const miscService = new MiscService();

  useEffect(() => {
    miscService.lists().then((response) => {
      const outputArray = Object.entries(response.data?.data?.user_genders).map(([id, label]) => ({ id, label }));
      setGenders(outputArray);

    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const handleSelectChange = (field, value) => {
    setSelectedGender(value);
   // formik.setFieldValue(field, value ? value['gender'] : null);
  }


  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="first_name"
                  onChange={handleChange}
                  required
                  value={values.first_name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  name="last_name"
                  onChange={handleChange}
                  required
                  value={values.last_name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  required
                  value={values.username}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Date of birth"
                  name="dob"
                  onChange={handleChange}
                  required
                  value={values.dob}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Autocomplete
                  options={genders}
                  value={selectedGender}
                  getOptionLabel={option => option['label'] ?? ''}
                  onChange={(event, value) => handleSelectChange('gender', value)}
                  renderInput={
                    params => (
                      <TextField
                        {...params}
                        label="Gender"
                        fullWidth
                        // error={!!(formik.touched.gender && formik.errors.gender)}
                        // helperText={formik.touched.gender && formik.errors.gender ? formik.errors.gender : ""}
                      />
                    )
                  }
                />

              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
