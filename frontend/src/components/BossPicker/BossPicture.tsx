// need gradents for regular (blue), weekly (purple) and legend (gold)
import {
    BOSSES,
    getBossElementOnlinePath,
} from "@genshin-ranked/shared";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";
import { BOSS_TYPE } from "@genshin-ranked/shared/src/types/level";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

interface IBossPicture {
    boss: BOSSES;
}

export const BossPicture = ({ boss }: IBossPicture) => {
    return(
        <Box sx={{backgroundColor: "white"}}>
            <GradientBox type={BOSS_DETAIL[boss].type}>
            <Image src={BOSS_DETAIL[boss].onlineFilePath} />
            <IconWrapper disabled>
                <IconImage src={getBossElementOnlinePath(boss)} />
            </IconWrapper>
        </GradientBox>
        </Box>
    )
}

interface IGradientBox {
	type: BOSS_TYPE;
}

const LEGEND_GRADIENT =
	"linear-gradient(160deg, rgba(105, 84, 83, 1) 0%, rgba(161, 112, 78, 1) 39%, rgba(228, 171, 82, 1) 100%)";
const WEEKLY_GRADIENT =
	"linear-gradient(160deg, rgba(89, 84, 130, 1) 0%, rgba(120, 102, 157, 1) 39%, rgba(183, 133, 201, 1) 100%)";
const STANDARD_GRADIENT =
	"linear-gradient(160deg, rgba(60, 84, 100, 1) 0%, rgba(100, 98, 140, 1) 39%, rgba(163, 103, 171, 1) 100%)";

const GradientBox = styled(Box)(({ type }: IGradientBox) => ({
	background: type == BOSS_TYPE.Standard ? STANDARD_GRADIENT : type == BOSS_TYPE.Weekly ? WEEKLY_GRADIENT : LEGEND_GRADIENT,
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "8px 8px 15px 0px",
	overflow: "hidden",
}));

const Image = styled("img")({
	width: "100%",
	height: "100%",
	objectFit: "cover",
});

const IconWrapper = styled(IconButton)({
	position: "absolute",
	top: 4,
	left: 4,
	padding: 0,
});

// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
const IconImage = styled("img")({
	width: 25,
	height: 25,
});