/**
 * Individual selector for a character. Includes CharacterPicture component as well as the name of the character.
 */

import { CHARACTERS } from "@genshin-ranked/shared";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { Fragment } from "react";
import { CharacterPicture } from "./CharacterPicture";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";

interface ICharacterButton {
	character: CHARACTERS,
	updateCharacter: React.Dispatch<React.SetStateAction<string>>,
	banDisplay: string;
	isChosen: boolean;
}

export const CharacterButton = ({ character, updateCharacter, banDisplay, isChosen }: ICharacterButton) => {
	// console.log("character")
	// console.log(character)
	// console.log(CHARACTER_INFO[character])
	// console.log("end character")
	const doUpdate = () => {
		updateCharacter(CHARACTER_INFO[character].displayName);
		localStorage.setItem("character", `${CHARACTER_INFO[character].index}`)
	};
	switch (banDisplay) {
		case "pick": {
			return (
				<PickWrapperBox disableRipple onClick={doUpdate}>
					<InnerCharacter
						character={character}
						updateCharacter={updateCharacter}
						banDisplay={banDisplay}
						isChosen={isChosen}
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
					/>
				</NormalWrapperBox>
			);
		}
	}
};

const InnerCharacter = ({character, updateCharacter, banDisplay, isChosen}: ICharacterButton) => {
	return (
		<Fragment>
			<CharacterPicture character={character} banDisplay={banDisplay} />
			<LabelBox>
				<Typography
					fontFamily={'Roboto Mono'}
					sx={{
						textOverflow: "ellipsis",
						whiteSpace: "wrap",
						fontSize: banDisplay ? 11 : 14,
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
	width: 110,
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
