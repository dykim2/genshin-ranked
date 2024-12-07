import { Box, Modal, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { useCookies } from "react-cookie";
import useScreenSize from "../hooks/useScreenSize.js"
interface play {
    link: string; // should either end in .gif or .png or other image format
    isOpen: boolean;
    onClose: any;
    ban: boolean
}
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been banned!`}</Typography>
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been selected!`}</Typography>
export const GifPlay = ({link, isOpen, onClose, ban = false}: play) => {
  let height = 500
  let width = 1000
  const [cookies, setCookies] = useCookies(["player"])
  if(localStorage.getItem("x") != null && cookies.player.charAt(0).toLowerCase() == "s"){
    width = parseInt(localStorage.getItem("x")!)
  }
  else{
    width = (useScreenSize().width / 2) - 540
  }
    return (
      <React.Fragment>
        {/* turn this in to a component, maybe by providing a state variable*/}
        <Modal open={isOpen} onClose={onClose}>
          <Box
            sx={{
              position: "absolute",
              top: "35%",
              left: width, // 2560 - 
            }}
          >
            {ban ? (
                <Fragment>
                <img src={link} width="1080" height="256" style={{filter: "grayscale(70%)"}} />
              </Fragment>
            ) : (
              <Fragment>
                <img src={link} width="1080" height="256" />
              </Fragment>
            )}
          </Box>
        </Modal>
      </React.Fragment>
    );
}

// user press a button, button leads to video being played. 
// replace the current alert with a 3s gif
// i think im gonna create a modal with material ui, while modal is active and a character is set play video of character, hide after 3s
