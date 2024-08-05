import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Changelogs } from "./changelogs";
import { Balancing } from "./balancing";
import { Play } from "./play";
import { Home } from "./home";
import { PagesTwoTone } from "@mui/icons-material";
import { BossDisplay } from "./bosses";

type Page = {
	name: string;
	path: string;
	component: React.JSX.Element;
};
export const pages: Page[] = [
	{
		name: "Characters",
		path: "/balancing",
		component: <Balancing />,
	},
	{ name: "Changelogs", path: "/changelogs", component: <Changelogs /> },
	{ name: "Play", path: "/play", component: <Play /> },
	{ name: "Bosses", path: "/bossdisplay", component: <BossDisplay />}
];

export const RoutedContent = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />

			{pages.map((page) => {
				return <Route key={page.name} path={page.path} element={page.component} />;
			})}

			{/* If route is not found, reroute to / */}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
};
