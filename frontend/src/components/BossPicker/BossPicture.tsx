// need gradents for regular (blue), weekly (purple) and legend (gold)
import {
    BOSSES,
    getBossImagePath
} from "@genshin-ranked/shared";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

interface IBossPicture {
    boss: BOSSES;
}

export const BossPicture = ({ boss }: IBossPicture) => {
    return(
        <Box sx={{backgroundColor: "white"}}>

        </Box>
    )
}

const LEGEND_GRADIENT =
	"linear-gradient(160deg, rgba(105, 84, 83, 1) 0%, rgba(161, 112, 78, 1) 39%, rgba(228, 171, 82, 1) 100%)";
const WEEKLY_GRADIENT =
	"linear-gradient(160deg, rgba(89, 84, 130, 1) 0%, rgba(120, 102, 157, 1) 39%, rgba(183, 133, 201, 1) 100%)";
const STANDARD_GRADIENT =
	"linear-gradient(160deg, rgba(89, 84, 130, 1) 0%, rgba(120, 102, 157, 1) 39%, rgba(183, 133, 201, 1) 100%)";