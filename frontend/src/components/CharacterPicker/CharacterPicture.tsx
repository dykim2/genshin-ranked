/**
 * Picture of a character, including the backdrop and element. Does NOT include name of character.
 */

import {
	CHARACTERS,
	getCharacterElementImagePath,
	getCharacterImagePath,
	RARITY,
} from "@genshin-ranked/shared";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

interface ICharacterPicture {
	character: CHARACTERS;
}

export const CharacterPicture = ({ character }: ICharacterPicture) => {
	return (
		<GradientBox rarity={CHARACTER_INFO[character].rarity}>
			<Image src={getCharacterImagePath(character)} />
			<IconWrapper disabled>
				<IconImage src={getCharacterElementImagePath(character)} />
			</IconWrapper>
		</GradientBox>
	);
};

interface IGradientBox {
	rarity: RARITY;
}

const FIVE_STAR_GRADIENT =
	"linear-gradient(160deg, rgba(105, 84, 83, 0.565) 0%, rgba(161, 112, 78, 0.565) 39%, rgba(228, 171, 82, 0.565) 100%)";
const FOUR_STAR_GRADIENT =
	"linear-gradient(160deg, rgba(89, 84, 130, 0.565) 0%, rgba(120, 102, 157, 0.565) 39%, rgba(183, 133, 201, 0.565) 100%)";

const GradientBox = styled(Box)(({ rarity }: IGradientBox) => ({
	background:
		rarity === RARITY.FiveStar ? FIVE_STAR_GRADIENT : FOUR_STAR_GRADIENT,
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	overflow: "hidden",
}));

const Image = styled("img")({
	width: "100%",
	height: "100%",
	objectFit: "cover",
});

const IconWrapper = styled(IconButton)({
	position: "absolute",
	top: 4,
	left: 4,
	padding: 0,
});

// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
const IconImage = styled("img")({
	width: 25,
	height: 25,
});
