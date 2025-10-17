import { BOSSES } from "@genshin-ranked/shared"
import { Box, Button, Typography, TextField, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { BossPicture } from "./BossPicture";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";
import { useAppDispatch } from "../../../../src/hooks/ReduxHooks";
import { hoverBoss } from "../../../../src/GameReduce/selectionSlice";

/**
 * @param boss the boss name to display
 * @param updateBoss the state that is triggered when the user clicks on the boss
 * @param selectDisplay whether bosses are being chosen for pick/ban or for viewing
 * @param component whether this is displayed as a component or not (don't create the hover circle if it is)
 */
interface IBossButton {
	boss: BOSSES;
	isChosen: boolean;
	component: boolean;
	mainDisplay: boolean;
}
interface IDisplayInnerBossButton extends IBossButton {
	updateBoss: React.Dispatch<React.SetStateAction<string>>;
	team: number;
	updateHover: (teamNum: number, selected: number) => void;
}
interface WrapperBoxProps {
	mainDisplay?: boolean;
}

export const BossButton = ({team, boss, updateBoss, isChosen, updateHover, component, mainDisplay}: IDisplayInnerBossButton) => {
	const dispatch = useAppDispatch();
	const doUpdate = () => {
		updateBoss(BOSS_DETAIL[boss].displayName);
		dispatch(hoverBoss(BOSS_DETAIL[boss].index));
		updateHover(team, BOSS_DETAIL[boss].index);
	}
	return (
		<WrapperBox disableRipple onClick={doUpdate} mainDisplay={mainDisplay}>
			<InnerBoss
				boss={boss}
				isChosen={isChosen}
				component={component}
				mainDisplay={mainDisplay}
			/>
		</WrapperBox>
	);
}
export const InnerBoss = ({boss, isChosen, component, mainDisplay}: IBossButton) => {
	return (
		<Fragment>
			<BossPicture boss={boss} isChosen={isChosen} component={component} />
			<LabelBox>
				<Typography
					fontFamily={"Roboto Mono"}
					sx={{
						textOverflow: "hidden",
						whiteSpace: "nowrap",
						overflow: "hidden",
						fontSize: {
							xs: 5,
							sm: 7.5, 
							md: 8.5,
							lg: 9.5,
							xl: mainDisplay ? 11 : 10
						},
						fontWeight: "bold",
					}}
				>
					{BOSS_DETAIL[boss].displayName}
				</Typography>
			</LabelBox>
		</Fragment>
	);
}

const WrapperBox = styled(Button, {shouldForwardProp: (prop) => prop !== "mainDisplay"})<WrapperBoxProps>(({theme, mainDisplay}) => ({
	display: "box",
	flexDirection: "column",
	alignItems: "center",
	padding: 0,
	borderRadius: 8,
	overflow: "hidden",
	justifyContent: "center",
	color: "black",
	position: "relative",
	minWidth: 0,
	width: 40,
	[theme.breakpoints.up("sm")]: {
		width: mainDisplay ? 53 : 45,
	},
	[theme.breakpoints.up("md")]: {
		width: mainDisplay ? 66 : 55,
	},
	[theme.breakpoints.up("lg")]: {
		width: mainDisplay ? 79 : 62,
	},
	[theme.breakpoints.up("xl")]: {
		width: mainDisplay ? 92 : 70,
	},
}));

const LabelBox = styled(Box)({
	backgroundColor: "white",
	padding: "1px 5px",
	width: "100%",
	textAlign: "center",
	// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
	// TODO: Need to find a way for flexible font sizes, refer to Arataki Itto within application, the Itto gets moved to the next line and is cut off.
	maxHeight: 20,
});