/**
 * Individual selector for a character. Includes CharacterPicture component as well as the name of the character.
 */

import { CHARACTER_NAME } from "@genshin-ranked/shared";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { CharacterPicture } from "./CharacterPicture";
import { CHARACTERS } from "@genshin-ranked/shared/src/types/characters/details";

interface ICharacterSelector {
	character: CHARACTER_NAME;
}

export const CharacterSelector = ({ character }: ICharacterSelector) => {
	return (
		<>
			<WrapperBox>
				<CharacterPicture character={character} />
				<LabelBox>
					<Typography>{CHARACTERS[character].displayName}</Typography>
				</LabelBox>
			</WrapperBox>
		</>
	);
};

const WrapperBox = styled(Box)({
	display: "box",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	width: 100,
});

const LabelBox = styled(Box)({
	backgroundColor: "white",
	padding: 1,
	textAlign: "center",
});
