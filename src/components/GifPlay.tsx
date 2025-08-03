import { Box, Modal, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { useCookies } from "react-cookie";
import useScreenSize from "../hooks/useScreenSize.js";
interface play {
  link: string; // should either end in .gif or .png or other image format
  isOpen: boolean
}
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been banned!`}</Typography>
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been selected!`}</Typography>
export const GifPlay = ({
  link,
  isOpen
}: play) => {
  const [cookies, setCookies] = useCookies(["player"]);
  const defWidth = useScreenSize().width / 2 - 540;
  let width = 1000;
  if (
    cookies.player != undefined &&
    localStorage.getItem("x") != null &&
    (cookies.player.charAt(0).toLowerCase() == "s")
  ) {
    width = parseInt(localStorage.getItem("x")!);
  } else {
    width = defWidth;
  }
  return (
    <React.Fragment>
      {/* turn this in to a component, maybe by providing a state variable*/}
      <Modal open={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "35%",
            left: width
          }}
        >
          <Fragment>
            <img src={link} width="1080" height="256" />
          </Fragment>
        </Box>
      </Modal>
    </React.Fragment>
  );
};
