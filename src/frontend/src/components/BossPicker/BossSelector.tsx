import React, { useState } from "react";
import {
    BOSSES,
	ELEMENT_INFO,
	ELEMENTS,
	// RARITY,
	// RARITY_INFO,
} from "@genshin-ranked/shared";
import { Grid, InputAdornment, Stack, TextField } from "@mui/material";
import { BossButton } from "./BossButton";
import { GroupToggle } from "../GroupToggle";
import SearchIcon from "@mui/icons-material/Search";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";

// an exact copy of character selector applied for bosses - should make a selector component instead but this way gets the changes out faster

export interface IBoss {
	bossName: string;
	updateBoss: React.Dispatch<React.SetStateAction<string>>;
}

export const BossSelector = ({
	bossName,
	updateBoss
}: IBoss) => {
	const [elementFilter, setElementFilter] = useState<ELEMENTS | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [isFocused, setIsFocused] = useState(false);

	return (
		<Stack direction="column">
			<Stack direction="row" alignContent="center">
				<TextField
					variant="outlined"
					placeholder="Search"
					size="small"
					value={searchFilter}
					onChange={(e) => {
						setSearchFilter(e.target.value);
					}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					sx={{
						minWidth: 140,
						// Customizing the input text color
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: "rgba(105,105,105,1)",
							},
							// Hover state
							"&:hover fieldset": { borderColor: "white" },
							// Focused state
							"&.Mui-focused fieldset": { borderColor: "white" },
						},
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								{!isFocused && (
									<SearchIcon
										sx={{
											color: "rgba(105,105,105,1)",
											padding: 0,
										}}
									/>
								)}
							</InputAdornment>
						),
					}}
				/>

				<GroupToggle
					value={elementFilter}
					setValue={setElementFilter}
					options={Object.values(ELEMENT_INFO)}
				/>
			</Stack>
			<Grid
				container
				spacing={1}
				minWidth="470px"
				maxWidth="50vw"
				id="char-selector-grid"
			>
				{/* TODO: Wrap this with useMemo to minimize unnessecary refiltering of these values */}
				{Object.values(BOSSES)
					.filter((boss) => {
						if (searchFilter.length === 0 && elementFilter === null)
							return true;

						// TODO: Algorithm can be slightly optimized. (Not by degrees of n, but perhaps a coefficient of it.)
						const correctElement =
							elementFilter === BOSS_DETAIL[boss].element;
						const correctSearch = BOSS_DETAIL[boss].imageFileName
							.toLowerCase()
							.includes(searchFilter.toLowerCase());
						if (searchFilter.length === 0 && elementFilter) {
							return correctElement;
						} else if (searchFilter.length > 0 && !elementFilter) {
							return correctSearch;
						} else if (searchFilter.length > 0 && elementFilter) {
							return correctElement && correctSearch;
						} else {
							return true;
						}
					})
					.map((x) => {
						return (
							<Grid item padding={1} key={x}>
								<BossButton boss={x} updateBoss={updateBoss} />
							</Grid>
						);
					}
						
					)}
			</Grid>
		</Stack>
	);
};