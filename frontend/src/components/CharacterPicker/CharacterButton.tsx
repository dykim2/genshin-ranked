/**
 * Individual selector for a character. Includes CharacterPicture component as well as the name of the character.
 */

import {CHARACTERS} from "@genshin-ranked/shared";
import {Box, Button, Typography} from "@mui/material";
import {styled} from "@mui/system";
import React, {Fragment} from "react";
import {CharacterPicture} from "./CharacterPicture";
import {CHARACTER_INFO} from "@genshin-ranked/shared/src/types/characters/details";
import {useAppDispatch} from "../../../../src/hooks/ReduxHooks";
import {hoverCharacter} from "../../../../src/GameReduce/selectionSlice";

/**
 * @param character the character this picture refers to
 * @param updateCharacter the action taken when the character is clicked
 * @param banDisplay information on whether this is a ban or not
 * @param isChosen whether this character has been selected or banned
 * @param component whether this character is displayed as a component on the side bar or not
 * @param mainDisplay whether this is the main character display (larger size)
 */
interface IInnerButton {
	character: CHARACTERS;
	updateCharacter: React.Dispatch<React.SetStateAction<string>>;
	banDisplay: string;
	isChosen: boolean;
	component: boolean;
}
interface ICharacterButton extends IInnerButton {
	team: number;
	updateHover: (teamNum: number, selected: number) => void;
	mainDisplay: boolean;
}
interface WrapperBoxProps {
	mainDisplay?: boolean;
}

export const CharacterButton = ({team, character, updateCharacter, banDisplay, isChosen, updateHover, component, mainDisplay}: ICharacterButton) => {
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
				updateCharacter={updateCharacter}
				banDisplay={isChosen ? "ban" : banDisplay}
				isChosen={isChosen}
				component={component}
			/>
		</WrapperBox>
	)
};

const InnerCharacter = ({character, banDisplay, component}: IInnerButton) => {
	return (
		<Fragment>
			<CharacterPicture
				character={character}
				banDisplay={banDisplay}
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

const WrapperBox = styled(Button, {
	shouldForwardProp: (prop) => prop !== "mainDisplay",
})<WrapperBoxProps>(({ theme, mainDisplay }) => ({
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
