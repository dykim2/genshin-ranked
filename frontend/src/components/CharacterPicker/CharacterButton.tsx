/**
 * Individual selector for a character. Includes CharacterPicture component as well as the name of the character.
 */

import { CHARACTERS } from "@genshin-ranked/shared";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { CharacterPicture } from "./CharacterPicture";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";

interface ICharacterButton {
	character: CHARACTERS;
	updateCharacter: React.Dispatch<React.SetStateAction<string>>;
}

export const CharacterButton = ({ character, updateCharacter }: ICharacterButton) => {
	const doUpdate = () => {
		console.log(character);
		updateCharacter(CHARACTER_INFO[character].displayName);
		localStorage.setItem("character", `${CHARACTER_INFO[character].index}`)
	};
	return (
		<>
			<WrapperBox disableRipple onClick={doUpdate}>
				<CharacterPicture character={character} />
				<LabelBox>
					<Typography sx={{textOverflow:"ellipsis", whiteSpace:"wrap"}}>
						{CHARACTER_INFO[character].displayName}
					</Typography>
				</LabelBox>
			</WrapperBox>
		</>
	);
};

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
