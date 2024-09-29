import { BOSSES } from "@genshin-ranked/shared"
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { BossPicture } from "./BossPicture";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";

interface iBossButton {
    boss: BOSSES,
	updateBoss: React.Dispatch<React.SetStateAction<string>>
}

export const BossButton = ({boss, updateBoss}: iBossButton) => {
	const doUpdate = () => {
		console.log(boss);
		updateBoss(BOSS_DETAIL[boss].displayName);
		sessionStorage.setItem("boss", `${BOSS_DETAIL[boss].index}`);
	}
    return (
        <Fragment>
            <WrapperBox disableRipple onClick={doUpdate}>
                <BossPicture boss={boss} />
                <LabelBox>
                    <Typography sx={{textOverflow:"ellipsis", whiteSpace:"nowrap", overflow:"hidden", fontSize: 14}}>
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
	width: 120,
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
