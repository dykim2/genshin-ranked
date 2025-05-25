/**
 * Individual selector for a character. Includes CharacterPicture component as well as the name of the character.
 */

import { CHARACTERS } from "@genshin-ranked/shared";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { CharacterPicture } from "./CharacterPicture";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";

/**
 * @param character the character this picture refers to
 * @param updateCharacter the action taken when the character is clicked
 * @param banDisplay information on whether this is a ban or not
 * @param isChosen whether this character has been selected or banned
 * @param component whether this character is displayed as a component on the side bar or not
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
}

export const CharacterButton = ({team, character, updateCharacter, banDisplay, isChosen, updateHover, component }: ICharacterButton) => {
	const doUpdate = () => {
		updateCharacter(CHARACTER_INFO[character].displayName);
		localStorage.setItem("character", `${CHARACTER_INFO[character].index}`);
		// updateHover in a non Game setting should be changed to instead do what the button press normally would
		updateHover(team, CHARACTER_INFO[character].index);
	};
	if(isChosen){
		return(
			<NormalWrapperBox disableRipple onClick={doUpdate}>
				<InnerCharacter
					character={character}
					updateCharacter={updateCharacter}
					banDisplay={"ban"}
					isChosen={isChosen}
					component={component}
				/>
			</NormalWrapperBox>
		)
	}
	switch (banDisplay) {
		case "pick": {
			return (
				<PickWrapperBox disableRipple onClick={doUpdate}>
					<InnerCharacter
						character={character}
						updateCharacter={updateCharacter}
						banDisplay={banDisplay}
						isChosen={isChosen}
						component={component}
					/>
				</PickWrapperBox>
			);
		}
		case "ban": {
			return (
				<BanWrapperBox disableRipple onClick={doUpdate}>
					<InnerCharacter
						character={character}
						updateCharacter={updateCharacter}
						banDisplay={banDisplay}
						isChosen={isChosen}
						component={component}
					/>
				</BanWrapperBox>
			);
		}
		case "loadout": {
			return (
				<NormalWrapperBox disableRipple onClick={doUpdate}>
					<InnerCharacter
						character={character}
						updateCharacter={updateCharacter}
						banDisplay={banDisplay}
						isChosen={isChosen}
						component={component}
					/>
				</NormalWrapperBox>
			);
		}
	}
};

const InnerCharacter = ({character, banDisplay, component}: IInnerButton) => {
	return (
		<Fragment>
			<CharacterPicture character={character} banDisplay={banDisplay} component={component} />
			<LabelBox>
				<Typography
					fontFamily={'Roboto Mono'}
					sx={{
						textOverflow: "ellipsis",
						whiteSpace: "wrap",
						fontSize: banDisplay ? 11 : 10.5,
						fontWeight: 'bold'
					}}
				>
					{CHARACTER_INFO[character].displayName}
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
});

const PickWrapperBox = styled(Button)({
	display: "box",
	flexDirection: "column",
	alignItems: "center",
	padding: 0,
	borderRadius: 8,
	overflow: "hidden",
	justifyContent: "center",
	color: "black",
	width: 80,
});

const BanWrapperBox = styled(Button)({
	display: "box",
	flexDirection: "column",
	alignItems: "center",
	padding: 0,
	borderRadius: 8,
	overflow: "hidden",
	justifyContent: "center",
	color: "black",
	width: 80,
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
