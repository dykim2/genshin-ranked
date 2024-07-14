/**
 * Individual selector for a character. Includes CharacterPicture component as well as the name of the character.
 */

import { CHARACTER_NAME } from "@genshin-ranked/shared";
import { Box, Button, Typography } from "@mui/material";
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
			<WrapperBox disableRipple>
				<CharacterPicture character={character} />
				<LabelBox>
					<Typography>{CHARACTERS[character].displayName}</Typography>
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
	borderRadius: 5,
	overflow: "hidden",
	justifyContent: "center",

	// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
	width: 100,
});

const LabelBox = styled(Box)({
	backgroundColor: "white",
	padding: 1,
	width: "100%",
	textAlign: "center",
});
