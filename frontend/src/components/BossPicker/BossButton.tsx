import { BOSSES } from "@genshin-ranked/shared"
import { Box, Button, Typography, TextField, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { BossPicture } from "./BossPicture";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";

interface iBossButton {
    boss: BOSSES,
	updateBoss: React.Dispatch<React.SetStateAction<string>>,
	banDisplay: boolean
}

export const BossButton = ({boss, updateBoss, banDisplay}: iBossButton) => {
	const doUpdate = () => {
		updateBoss(BOSS_DETAIL[boss].displayName);
		localStorage.setItem("boss", `${BOSS_DETAIL[boss].index}`);
	}
    return !banDisplay ? (
		<NormalWrapperBox disableRipple onClick={doUpdate}>
			<InnerBoss
				boss={boss}
				updateBoss={updateBoss}
				banDisplay={banDisplay}
			/>
		</NormalWrapperBox>
	) : (
		<SelectedWrapperBox disableRipple onClick={doUpdate}>
			<InnerBoss
				boss={boss}
				updateBoss={updateBoss}
				banDisplay={banDisplay}
			/>
		</SelectedWrapperBox>
	);
}
export const InnerBoss = ({boss, updateBoss, banDisplay}: iBossButton) => {
	return (
		<Tooltip title={BOSS_DETAIL[boss].displayName} arrow>
			<Fragment>
				<BossPicture boss={boss} banDisplay={banDisplay} />
				<LabelBox>
					<Typography
						sx={{
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							overflow: "hidden",
							fontSize: banDisplay ? 11 : 14,
						}}
					>
						{BOSS_DETAIL[boss].displayName}
					</Typography>
				</LabelBox>
			</Fragment>
		</Tooltip>
	);
}


const NormalWrapperBox = styled(Button)({
	display: "box",
	flexDirection: "column",
	alignItems: "center",
	padding: 0,
	borderRadius: 8,
	overflow: "hidden",
	justifyContent: "center",
	width: 125,
});

// designed for the bottom boss selection
const SelectedWrapperBox = styled(Button)({
	display: "box",
	flexDirection: "column",
	alignItems: "center",
	padding: 0,
	borderRadius: 8,
	overflow: "hidden",
	justifyContent: "center",
	width: 85
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