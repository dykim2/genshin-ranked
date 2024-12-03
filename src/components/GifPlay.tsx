import { Box, Modal, Typography } from "@mui/material";
import React, { Fragment } from "react";
interface play {
    link: string; // should either end in .gif or .png or other image format
    selection: string;
    isOpen: boolean;
    onClose: any;
    ban: boolean
}

export const GifPlay = ({link, selection, isOpen, onClose, ban = true}: play) => {
    console.log("banned: "+ban)
    return (
      <React.Fragment>
        {/* turn this in to a component, maybe by providing a state variable*/}
        <Modal open={isOpen} onClose={onClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
            }}
          >
            <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been selected!`}</Typography>
            {ban ? (
                <Fragment>
                <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been banned!`}</Typography>
                <img src={link} width="300" height="300" style={{filter: "grayscale(70%)"}} />
              </Fragment>
            ) : (
              <Fragment>
                <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been selected!`}</Typography>
                <img src={link} width="300" height="300" />
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
