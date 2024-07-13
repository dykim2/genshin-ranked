import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Changelogs } from "./changelogs";
import { Balancing } from "./balancing";
import { Home } from "./home";

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
];

export const RoutedContent = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />

			{pages.map((page) => {
				return <Route path={page.path} element={page.component} />;
			})}

			{/* If route is not found, reroute to / */}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
};
