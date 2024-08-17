import { Box } from "@mui/material";
import React, { ReactElement } from "react";

interface IAppBodyWrapper {
	children: ReactElement;
}

export const AppBodyWrapper = ({ children }: IAppBodyWrapper) => {
	return <Box sx={{ padding: 2 }}>{children}</Box>;
};
