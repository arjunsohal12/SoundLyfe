import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
    SpeedOutlined,
    HomeOutlined,
    GraphicEqOutlined,
    MusicNoteOutlined,
    PersonOutlineOutlined,
    SettingsVoiceOutlined,
    FavoriteBorderOutlined,
    RestoreOutlined,
    RadioOutlined
} from "@mui/icons-material";

import { Box, Typography, Divider, useTheme, IconButton, Button} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const MenuWidget = () => {
    const {palette} = useTheme();
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const dark = palette.neutral.dark;  
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const primaryLight = palette.primary.light;

    return (
        <WidgetWrapper width="100%">
            <Box padding="0.5rem 1rem" gap="3rem">
                <FlexBetween > 
                    <FlexBetween>
                        <IconButton>
                            <SpeedOutlined color="primary" sx={{height:"40px", width:"40px"}}/>
                        </IconButton>
                        <Typography fontWeight="bold" fontSize="clamp(0.5rem, 1.25rem, 2rem)" color="primary" onClick={() => navigate("/home")}
                                sx={{
                                    "&:hover": {
                                    color: primaryLight,
                                    cursor: "pointer",
                                    }, }} >
                            TuneTalk
                        </Typography>
                    </FlexBetween>
                </FlexBetween>
                
                {/*BROWSE MUSIC ROW*/}
                <Box p="0.5rem 0">
                    <FlexBetween padding="2rem 0.8rem 0" fontWeight='fontWeightMedium'>
                        <Typography fontSize="1.1rem" color={main} fontWeight="650" mb="1rem">
                            Browse Music
                        </Typography>
                    </FlexBetween>
                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <HomeOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        Home
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>

                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <MusicNoteOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        Songs
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>

                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <GraphicEqOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        Discover
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>

                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <PersonOutlineOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        Artists
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>

                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <SettingsVoiceOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        Podcasts
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>
                    
                </Box>


            {/*YOUR MUSIC*/}
            <Box p="0.5rem 0">
                    <FlexBetween padding="2rem 0.8rem 0" fontWeight='fontWeightMedium'>
                        <Typography fontSize="1.1rem" color={main} fontWeight="650" mb="1rem">
                            Your Music
                        </Typography>
                    </FlexBetween>
                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <FavoriteBorderOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        Favourites
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>

                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <RestoreOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        History
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>

                    <Box>
                        <IconButton>
                            <Box display="flex" alignItems="center" padding="0.5rem 0" gap="0rem 0.5rem">
                                <RadioOutlined sx={{color:medium}} fontSize="medium"/>
                                <Typography fontSize="1rem" fontWeight="300" color={medium}>
                                        Mixes
                                </Typography>
                            </Box>
                        </IconButton>
                    </Box>
                    
                </Box>

                {/*YOUR PLAYLISTS*/}
                 <Box p="0.5rem 0">
                    <FlexBetween padding="2rem 0.8rem 0" fontWeight='fontWeightMedium'>
                        <Typography fontSize="1.1rem" color={main} fontWeight="650" mb="1rem">
                            Playlists
                        </Typography>
                    </FlexBetween>
                </Box>
            </ Box>
        </WidgetWrapper>




    )
}


export default MenuWidget;