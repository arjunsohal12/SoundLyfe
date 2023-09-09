import { Box } from "@mui/material";
import {styled} from "@mui/system";


// Styling for our widgets in the homepage section
const WidgetWrapper = styled(Box)(({ theme }) => ({
    padding: "1.5rem 1.5rem 0.75rem 1.5rem", // order: TOP RIGHT BOTTOM LEFT we are setting the padding, each value represents padding on each side respectively
    backgroundColor: theme.palette.background.alt,
    borderRadius: "0.75rem"
}))

export default WidgetWrapper