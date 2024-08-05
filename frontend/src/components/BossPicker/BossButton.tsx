import { BOSSES } from "@genshin-ranked/shared"
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { BossPicture } from "./BossPicture";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";

interface iBossButton {
    boss: BOSSES
}

export const BossButton = ({boss}: iBossButton, props: any) => {
	const doSelection = () => {
		console.log("yes")
	};
	const bossProps = {
		boss: boss,
		update: doSelection
	}
    return(
        <Fragment>
            <WrapperBox disableRipple>
                <BossPicture {...bossProps} />
                <LabelBox>
                    <Typography sx={{textOverflow:"ellipsis", whiteSpace:"nowrap", overflow:"hidden"}}>
						{BOSS_DETAIL[boss].displayName}
					</Typography>
                </LabelBox>
            </WrapperBox>
        </Fragment>
    )
}

const WrapperBox = styled(Button)({
	display: "box",
	flexDirection: "column",
	alignItems: "center",
	padding: 0,
	borderRadius: 8,
	overflow: "hidden",
	justifyContent: "center",
	// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
	width: 100,
});

const LabelBox = styled(Box)({
	backgroundColor: "white",
	padding: "1px 5px",
	width: "100%",
	textAlign: "center",
	// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
	// TODO: Need to find a way for flexible font sizes, refer to Arataki Itto within application, the Itto gets moved to the next line and is cut off.
	maxHeight: 25,
});
