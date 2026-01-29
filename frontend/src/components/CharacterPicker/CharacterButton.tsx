/**
 * Individual selector for a character. Includes CharacterPicture component as well as the name of the character.
 */

import {CHARACTERS} from "@genshin-ranked/shared";
import {Box, Button, Typography} from "@mui/material";
import {styled} from "@mui/system";
import {FC, Fragment} from "react";
import {DisplayPicture, CharacterPicture} from "./CharacterPicture";
import {CHARACTER_INFO} from "@genshin-ranked/shared/src/types/characters/details";
import {useAppDispatch} from "../../../../src/hooks/ReduxHooks";
import {hoverCharacter} from "../../../../src/GameReduce/selectionSlice";

/**
 * @param character the character this picture refers to
 * @param isBan information on whether this is a ban or not
 * @param isChosen whether this character has been selected or banned
 * @param component whether this character is displayed as a component on the side bar or not
 * @param mainDisplay whether this is the main character display (larger size)
 */
interface IInnerButton {
	isBan: boolean;
	character: CHARACTERS;
	component: boolean;
	isChosen: boolean;
}
/**
 * 
 * @param updateCharacter the action taken when the character is selected and locked 
 * @param updateHover the action taken when the character is hovered, basically same as updateCharacter
 */
interface ICharacterButton extends IInnerButton {
	team: number;
	updateCharacter: React.Dispatch<React.SetStateAction<string>>;
	updateHover: (teamNum: number, selected: number) => void;
	mainDisplay: boolean;
}
interface WrapperBoxProps {
	mainDisplay?: boolean;
}

interface DisplayButtonProps {
	character: CHARACTERS;
	index: number;
	updateHover: (which: number, index: number) => void;
}

interface BigCharButtonProps extends DisplayButtonProps{
	updateHover: (which: number) => void;
}


const CharLabel: FC<{character: CHARACTERS}> = ({character}) => {
	return (
		<LabelBox>
			<Typography
				fontFamily={"Roboto Mono"}
				sx={{
					textOverflow: "hidden",
					whiteSpace: "wrap",
					fontSize: {
						xs: 9,
						sm: 9.5,
						md: 10.5,
						lg: 11.5,
						xl: 12,
					},
					fontWeight: "bold",
				}}
			>
				{CHARACTER_INFO[character].displayName}
			</Typography>
		</LabelBox>
	);
}

export const BigCharacterButton: FC<BigCharButtonProps> = ({character, index, updateHover}) => {
	return (
		<BigWrapperBox disableRipple onClick={() => {updateHover(index);}}>
			<DisplayPicture character={character} />
			<CharLabel character={character} />
		</BigWrapperBox>
	);
}

export const DisplayButton = ({index, character, updateHover}: DisplayButtonProps)  => {
	const doUpdate = () => {
		updateHover(index, CHARACTER_INFO[character].index);
	}
	return (
		<WrapperBox disableRipple onClick={doUpdate} mainDisplay={true}>
			<DisplayPicture character={character} />
			<CharLabel character={character} />
		</WrapperBox>
	);
}

export const CharacterButton = ({team, character, updateCharacter, isBan, isChosen, updateHover, component, mainDisplay}: ICharacterButton) => {
	const dispatch = useAppDispatch();
	const doUpdate = () => {
		updateCharacter(CHARACTER_INFO[character].displayName);
		// localStorage.setItem("character", `${CHARACTER_INFO[character].index}`);
		dispatch(hoverCharacter(CHARACTER_INFO[character].index));
		// updateHover in a non Game setting should be changed to instead do what the button press normally would
		updateHover(team, CHARACTER_INFO[character].index);
	};
	return(
		<WrapperBox disableRipple onClick={doUpdate} mainDisplay={mainDisplay}>
			<InnerCharacter
				character={character}
				isBan={isChosen ? true : isBan}
				isChosen={isChosen}
				component={component}
			/>
		</WrapperBox>
	)
};

const InnerCharacter = ({character, isBan, component}: IInnerButton) => {
	return (
		<Fragment>
			<CharacterPicture
				character={character}
				isBan={isBan}
				component={component}
			/>
			<LabelBox>
				<Typography
					fontFamily={"Roboto Mono"}
					sx={{
						textOverflow: "hidden",
						whiteSpace: "wrap",
						fontSize: {
							xs: 7,
							sm: 7.5,
							md: 8.5,
							lg: 9.5,
							xl: 10,
						},
						fontWeight: "bold",
					}}
				>
					{CHARACTER_INFO[character].displayName}
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
	// if its big, change the wrapper size here
}));

const BigWrapperBox = styled(WrapperBox)(({ theme }) => ({
	width: 80,
	[theme.breakpoints.up("sm")]: {
		width: 95,
	},
	[theme.breakpoints.up("md")]: {
		width: 110,
	},
	[theme.breakpoints.up("lg")]: {
		width: 125,
	},
	[theme.breakpoints.up("xl")]: {
		width: 140,
	},
}));

const LabelBox = styled(Box)({
	backgroundColor: "white",
	padding: "1px 5px",
	width: "100%",
	textAlign: "center",
	// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
	// TODO: Need to find a way for flexible font sizes, refer to Arataki Itto within application, the Itto gets moved to the next line and is cut off.
	maxHeight: 25,
});
