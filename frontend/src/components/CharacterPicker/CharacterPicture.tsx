/**
 * Picture of a character, including the backdrop and element. Does NOT include name of character.
 */

import {
	CHARACTERS,
	getCharacterElementOnlinePath,
	RARITY,
} from "@genshin-ranked/shared";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";
import { Box, Icon, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";


interface ICharacterPicture {
	character: CHARACTERS;
}


export const CharacterPicture = ({ character }: ICharacterPicture) => {
	return (
		<Box sx={{backgroundColor: "white"}}>
			<GradientBox rarity={CHARACTER_INFO[character].rarity}>
			<Image src={CHARACTER_INFO[character].onlineFilePath} />
			<IconWrapper>
				<IconImage src={require(getCharacterElementOnlinePath(character))} />
			</IconWrapper>
		</GradientBox>
		</Box>
		
	);
};

interface IGradientBox {
	rarity: RARITY;
}

export const FIVE_STAR_GRADIENT = 
	"linear-gradient(160deg, rgba(105, 84, 83, 1) 0%, rgba(161, 112, 78, 1) 39%, rgba(228, 171, 82, 1) 100%)";
export const FOUR_STAR_GRADIENT =
	"linear-gradient(160deg, rgba(89, 84, 130, 1) 0%, rgba(120, 102, 157, 1) 39%, rgba(183, 133, 201, 1) 100%)";

const GradientBox = styled(Box)(({ rarity }: IGradientBox) => ({
	background:
		rarity === RARITY.FiveStar ? FIVE_STAR_GRADIENT : FOUR_STAR_GRADIENT,
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "8px 8px 15px 0px",
	overflow: "hidden",
}));

const Image = styled("img")({
	width: "100%",
	height: "100%",
	objectFit: "cover",
});

const IconWrapper = styled(IconButton)({
	position: "absolute",
	top: 2,
	left: 2,
	padding: 0,
});

// TODO: Perhaps a programmatic way that gives more leeway to more flexibile sizes?
const IconImage = styled("img")({
	width: 25,
	height: 25,
});
