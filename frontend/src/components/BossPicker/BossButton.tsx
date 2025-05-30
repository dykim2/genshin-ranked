import { BOSSES } from "@genshin-ranked/shared"
import { Box, Button, Typography, TextField, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { BossPicture } from "./BossPicture";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";

/**
 * @param boss the boss name to display
 * @param updateBoss the state that is triggered when the user clicks on the boss
 * @param selectDisplay whether bosses are being chosen for pick/ban or for viewing
 * @param component whether this is displayed as a component or not (don't create the hover circle if it is)
 */
interface IBossButton {
	boss: BOSSES;
	selectDisplay: boolean; // display for choosing bosses to pick/ban or for viewing
	isChosen: boolean;
	component: boolean;
}
interface IInnerBossButton extends IBossButton {
	updateBoss: React.Dispatch<React.SetStateAction<string>>;
}
interface IDisplayInnerBossButton extends IInnerBossButton {
	team: number;
	updateHover: (teamNum: number, selected: number) => void;
}

export const BossButton = ({team, boss, updateBoss, selectDisplay, isChosen, updateHover, component}: IDisplayInnerBossButton) => {
	const doUpdate = () => {
		updateBoss(BOSS_DETAIL[boss].displayName);
		localStorage.setItem("boss", `${BOSS_DETAIL[boss].index}`);
		updateHover(team, BOSS_DETAIL[boss].index);
	}
	if(isChosen){
		return(
			<NormalWrapperBox disableRipple onClick={doUpdate}>
				<InnerBoss
					boss={boss}
					selectDisplay={selectDisplay}
					isChosen={true}
					component={component}
				/>
			</NormalWrapperBox>
		)
	}
    return !selectDisplay ? (
		<NormalWrapperBox disableRipple onClick={doUpdate}>
			<InnerBoss
				boss={boss}
				selectDisplay={selectDisplay}
				isChosen={isChosen}
				component={component}
			/>
		</NormalWrapperBox>
	) : (
		<SelectedWrapperBox disableRipple onClick={doUpdate}>
			<InnerBoss
				boss={boss}
				selectDisplay={selectDisplay}
				isChosen={isChosen}
				component={component}
			/>
		</SelectedWrapperBox>
	);
}
export const InnerBoss = ({boss, selectDisplay, isChosen, component}: IBossButton) => {
	return (
		<Fragment>
			<BossPicture boss={boss} isChosen={isChosen} component={component} />
			<LabelBox>
				<Typography
					fontFamily={"Roboto Mono"}
					sx={{
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						overflow: "hidden",
						fontSize: selectDisplay ? 10 : 10.5,
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
	width: 100,
	position: "relative"
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
	width: 80,
	position: "relative"
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