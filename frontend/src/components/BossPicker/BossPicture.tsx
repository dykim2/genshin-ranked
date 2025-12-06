// need gradents for regular (blue), weekly (purple) and legend (gold)
import {
    BOSSES,
    getBossElementImagePath,
	getBossImagePath,
} from "@genshin-ranked/shared";
import {BOSS_DETAIL} from "@genshin-ranked/shared/src/types/bosses/details";
import {BOSS_TYPE} from "@genshin-ranked/shared/src/types/level";
import {Box, Icon} from "@mui/material";
import {styled} from "@mui/system";
import {Fragment} from "react/jsx-runtime";
import {useAppSelector} from "../../../../src/hooks/ReduxHooks";
import {hoveredBoss} from "../../../../src/GameReduce/selectionSlice";

interface IBoss {
	boss: BOSSES
}
interface IBossPicture extends IBoss {
	isChosen: boolean;
	component: boolean;
}
const ImageDetail = ({boss}: IBoss) => {
	return (
		<Fragment>
			<Image src={getBossImagePath(boss)} />
			<IconWrapper>
				{boss == BOSSES.None || boss == BOSSES.NoBan ? null : (
					<IconImage src={getBossElementImagePath(boss)} />
				)}
			</IconWrapper>
		</Fragment>
	);
};
const ChosenDetail = ({boss}: IBoss) => {
	return (
		<Fragment>
			<Image
				src={getBossImagePath(boss)}
				sx={{ filter: "grayscale(100%)" }}
			/>
			<IconWrapper>
				{boss == BOSSES.None || boss == BOSSES.NoBan ? null : (
					<IconImage
						src={getBossElementImagePath(boss)}
						sx={{ filter: "greyscale(100%)" }}
					/>
				)}
			</IconWrapper>
		</Fragment>
	);
};

interface IGradientBox {
	type: BOSS_TYPE | null;
}
export const BossPicture = ({boss, isChosen, component}: IBossPicture) => {
	const thisInd = BOSS_DETAIL[boss].index;
	let hoverInd = useAppSelector(hoveredBoss);
    return (
		<Box sx={{backgroundColor: "white"}}>
			{thisInd == hoverInd && !component && isChosen ? (
				<HoveredChosenBox>
					<ChosenDetail boss={boss} />
				</HoveredChosenBox>
			) : thisInd == hoverInd && !component ? (
				<HoveredBox type={BOSS_DETAIL[boss].type}>
					<ImageDetail boss={boss} />
				</HoveredBox>
			) : isChosen ? (
				<ChosenBox>
					<ChosenDetail boss={boss} />
				</ChosenBox>
			) : (
				<GradientBox type={BOSS_DETAIL[boss].type}>
					<ImageDetail boss={boss} />
				</GradientBox>
			)}
		</Box>
	);
}

const LEGEND_GRADIENT =
	"linear-gradient(160deg, rgba(105, 84, 83, 1) 0%, rgba(161, 112, 78, 1) 39%, rgba(228, 171, 82, 1) 100%)";
const WEEKLY_GRADIENT =
	"linear-gradient(160deg, rgba(89, 84, 130, 1) 0%, rgba(120, 102, 157, 1) 39%, rgba(183, 133, 201, 1) 100%)";
const STANDARD_GRADIENT =
	"linear-gradient(160deg, rgba(60, 84, 100, 1) 0%, rgba(100, 98, 140, 1) 39%, rgba(163, 103, 171, 1) 100%)";
const BANNED_GRADIENT =
	"linear-gradient(90deg, rgba(212,212,212,1) 0%, rgba(154,154,154,1) 14%, rgba(112,112,112,1) 100%)";

const ChosenBox = styled(Box)(() => ({
	// picked or banned already
	background: BANNED_GRADIENT,
	display: "flex",
	alignItems: "left",
	justifyContent: "left",
	borderRadius: "8px 8px 15px 0px",
	border: "1px solid black",
	overflow: "hidden",
	zIndex: 2, 
}));
const GradientBox = styled(ChosenBox)(({type}: IGradientBox) => ({
	background:
		type == BOSS_TYPE.Standard
			? STANDARD_GRADIENT
			: type == BOSS_TYPE.Weekly
			? WEEKLY_GRADIENT
			: LEGEND_GRADIENT
}));
const HoveredBox = styled(GradientBox)(({theme}) => ({
	border: "8px solid #000", // default
	[theme.breakpoints.down("md")]: {
		border: "5px solid #000",
	},
	[theme.breakpoints.down("sm")]: {
		border: "3px solid #000",
	},
}));
const HoveredChosenBox = styled(ChosenBox)(({theme}) => ({
	border: "8px solid #000", // default
	[theme.breakpoints.down("md")]: {
		border: "5px solid #000",
	},
	[theme.breakpoints.down("sm")]: {
		border: "3px solid #000",
	},
}));

const Image = styled("img")(() => ({
	width: "100%",
	objectFit: "cover",
	// Responsive min/max sizes
}));

const IconImage = styled("img")(({ theme }) => ({
	width: 10,
	height: 10,
	[theme.breakpoints.up("sm")]: {
		width: 14,
		height: 14,
	},
	[theme.breakpoints.up("md")]: {
		width: 18,
		height: 18,
	},
	[theme.breakpoints.up("lg")]: {
		width: 22,
		height: 22,
	},
	[theme.breakpoints.up("xl")]: {
		width: 26,
		height: 26,
	},
	objectFit: "cover",
}));

const IconWrapper = styled(Icon)({
	position: "absolute",
	top: 3,
	left: 3,
	padding: 0,
	display: "flex",
	overflow: "visible"
});