import { BOSSES } from "@genshin-ranked/shared"
import { Box, Button, Typography, TextField, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { BossPicture } from "./BossPicture";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";

/**
 * @param boss the boss name to display
 * @param updateBoss the state that is triggered when the user clicks on the boss
 * @param selectDisplay 
 */
interface IInnerBossButton {
	boss: BOSSES;
	updateBoss: React.Dispatch<React.SetStateAction<string>>;
	selectDisplay: boolean;
	selectable: boolean; // can this boss be chosen? if not grey it out
	isChosen: boolean;
}
interface IBossButton extends IInnerBossButton {
	team: number;
	updateHover: (teamNum: number, selected: number) => void;
}

export const BossButton = ({team, boss, updateBoss, selectDisplay, selectable, isChosen, updateHover}: IBossButton) => {
	const doUpdate = () => {
		updateBoss(BOSS_DETAIL[boss].displayName);
		updateHover!(team, BOSS_DETAIL[boss].index);
		localStorage.setItem("boss", `${BOSS_DETAIL[boss].index}`);
	}
	if(isChosen){
		return(
			<NormalWrapperBox disableRipple onClick={doUpdate}>
				<InnerBoss
					boss={boss}
					updateBoss={updateBoss}
					selectDisplay={selectDisplay}
					selectable={selectable}
					isChosen={true}
				/>
			</NormalWrapperBox>
		)
	}
    return !selectDisplay ? (
		<NormalWrapperBox disableRipple onClick={doUpdate}>
			<InnerBoss
				boss={boss}
				updateBoss={updateBoss}
				selectDisplay={selectDisplay}
				selectable={selectable}
				isChosen={isChosen}
			/>
		</NormalWrapperBox>
	) : (
		<SelectedWrapperBox disableRipple onClick={doUpdate}>
			<InnerBoss
				boss={boss}
				updateBoss={updateBoss}
				selectDisplay={selectDisplay}
				selectable={true}
				isChosen={isChosen}
			/>
		</SelectedWrapperBox>
	);
}
export const InnerBoss = ({boss, updateBoss, selectDisplay, selectable, isChosen}: IInnerBossButton) => {
	return (
		<Fragment>
			<BossPicture boss={boss} isChosen={isChosen} />
			<LabelBox>
				<Typography
					fontFamily={"Roboto Mono"}
					sx={{
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						overflow: "hidden",
						fontSize: selectDisplay ? 10.5 : 13,
						fontWeight: "bold",
					}}
				>
					{BOSS_DETAIL[boss].displayName}
				</Typography>
			</LabelBox>
		</Fragment>
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
	color: "black",
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
	color: "black",
	width: 85,
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