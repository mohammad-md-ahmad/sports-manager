import { Typography } from "@mui/material";

export const TabPanel = ({ value, index, children }) => (
    <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
    >
        {value === index && <div>{children}</div>}
    </Typography>
);