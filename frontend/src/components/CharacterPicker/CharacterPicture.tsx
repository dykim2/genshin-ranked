/**
 * Picture of a character, including the backdrop and element. Does NOT include name of character.
 */

import React, { Fragment } from "react";
import {
	CHARACTERS,
	getCharacterElementImagePath,
	getCharacterImagePath,
	RARITY,
} from "@genshin-ranked/shared";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";
import { Box, Icon } from "@mui/material";
import { styled } from "@mui/system";

interface ICharacter {
	character: CHARACTERS
}
interface ICharacterPicture extends ICharacter { 
	banDisplay: string;
	component: boolean;
}

const ImageDetail = ({character}: ICharacter) => {
	return (
		<Fragment>
			<Image src={getCharacterImagePath(character)} />
			{character != CHARACTERS.None && character != CHARACTERS.NoBan ? (
				<IconWrapper>
					<Image src={getCharacterElementImagePath(character)} />
				</IconWrapper>
			) : null}
		</Fragment>
	);
}
const BanDetail = ({character}: ICharacter) => {
	return (
		<Fragment>
			<Image
				src={getCharacterImagePath(character)}
				sx={{ filter: "grayscale(100%)" }}
			/>
			{character != CHARACTERS.None && character != CHARACTERS.NoBan ? (
				<IconWrapper>
					<Image
						sx={{ filter: "grayscale(100%)" }}
						src={getCharacterElementImagePath(character)}
					/>
				</IconWrapper>
			) : null}
		</Fragment>
	);
}

export const CharacterPicture = ({ character, banDisplay, component }: ICharacterPicture) => {
	// check if the hovered index matches
	// when creating a game reset both
	// highlight 
	const thisInd = CHARACTER_INFO[character].index;
	let hoverInd = -5;
	if(localStorage.getItem("character") != null){
		hoverInd = parseInt(localStorage.getItem("character")!); 
	}
	else{
		return;
	}
	return (
		<Box sx={{ backgroundColor: "white" }}>
			{thisInd == hoverInd && !component && banDisplay != "ban" ? (
				<HoveredGradientBox rarity={CHARACTER_INFO[character].rarity}>
					<ImageDetail character={character} />
				</HoveredGradientBox>
			) : thisInd == hoverInd && !component ? (
				<HoveredBannedBox>
					<BanDetail character={character} />
				</HoveredBannedBox>
			) : banDisplay != "ban" ? (
				<NormalGradientBox rarity={CHARACTER_INFO[character].rarity}>
					<ImageDetail character={character} />
				</NormalGradientBox>
			) : (
				<BannedGradientBox>
					<BanDetail character={character} />
				</BannedGradientBox>
			)}
		</Box>
	);
};

interface IGradientBox {
	rarity: RARITY;
}

const FIVE_STAR_GRADIENT = 
	"linear-gradient(160deg, rgba(105, 84, 83, 1) 0%, rgba(161, 112, 78, 1) 39%, rgba(228, 171, 82, 1) 100%)";
const FOUR_STAR_GRADIENT =
	"linear-gradient(160deg, rgba(89, 84, 130, 1) 0%, rgba(120, 102, 157, 1) 39%, rgba(183, 133, 201, 1) 100%)";
const BANNED_GRADIENT =
	"linear-gradient(90deg, rgba(212,212,212,1) 0%, rgba(154,154,154,1) 14%, rgba(112,112,112,1) 100%)";

const BannedGradientBox = styled(Box)({
	background: BANNED_GRADIENT,
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "1px solid black",
	borderRadius: "8px 8px 15px 0px",
	overflow: "hidden",
});

const NormalGradientBox = styled(BannedGradientBox)(({ rarity }: IGradientBox) => ({
	background:
		rarity === RARITY.FiveStar ? FIVE_STAR_GRADIENT : FOUR_STAR_GRADIENT,
}));

const HoveredBannedBox = styled(BannedGradientBox)({
	border: "8px solid #000000"
});

const HoveredGradientBox = styled(NormalGradientBox)({
	border: "8px solid #000000",
});

const Image = styled("img")({
	width: "100%",
	height: "100%",
	objectFit: "cover",
});

const IconWrapper = styled(Icon)({
	position: "absolute",
	top: 3,
	left: 3,
	padding: 0,
	display: "flex",
	overflow: "visible",
});
