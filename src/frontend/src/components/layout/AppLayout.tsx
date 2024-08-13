import React, { ReactElement } from "react";
import { MuiNavbar } from "./Navbar";
import { AppBodyWrapper } from "./AppBody";

interface IAppLayoutWrapper {
	children: ReactElement;
}

export const AppLayoutWrapper = ({ children }: IAppLayoutWrapper) => {
	return (
		<>
			<MuiNavbar />
			<AppBodyWrapper>{children}</AppBodyWrapper>
		</>
	);
};
