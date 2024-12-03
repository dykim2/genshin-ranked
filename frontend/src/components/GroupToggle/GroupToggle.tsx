import {
	ELEMENTS,
	GenericDetails,
	getElementImagePath,
} from "@genshin-ranked/shared";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

interface ICharacterPicture {
	value: ELEMENTS | null;
	setValue: React.Dispatch<React.SetStateAction<ELEMENTS | null>>;
	options: GenericDetails[];
}

export const GroupToggle = ({
	value,
	setValue,
	options,
}: ICharacterPicture) => {
	return (
		<ToggleButtonGroup
			value={value}
			exclusive
			onChange={(e, value) => {
				setValue(value);
			}}
		>
			{options.map((option) => {
				return (
					<ToggleButton
						// TODO: Create appropriate enum field that associates to enum value
						key={option.imageFileName}
						value={option.imageFileName}
						sx={{
							padding: 1,
							opacity: value === option.imageFileName ? 1 : 0.25,
							"&:hover": {
								opacity: 0.75,
							},
						}}
					>
						<Box
							component="img"
							src={getElementImagePath(option)}
							sx={{
								width: 30,
								height: 30,
							}}
						/>
					</ToggleButton>
				);
			})}
		</ToggleButtonGroup>
	);
};
