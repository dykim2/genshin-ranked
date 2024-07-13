import React, { ReactElement } from "react";
import { MuiNavbar } from "./Navbar";

interface IAppLayoutWrapper {
	children: ReactElement;
}

export const AppLayoutWrapper = ({ children }: IAppLayoutWrapper) => {
	return (
		<>
			<MuiNavbar />
			{children}
		</>
	);
};
