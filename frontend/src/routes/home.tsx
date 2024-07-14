// This will also include functionality of the old /play route

import React from "react";
import { CharacterButton } from "../components";
import { CHARACTER_NAME } from "@genshin-ranked/shared";

export const Home = () => {
	return (
		<>
			<div>[WIP] HOME</div>

			{Object.values(CHARACTER_NAME).map((x) => (
				<CharacterButton character={x} />
			))}
		</>
	);
};
