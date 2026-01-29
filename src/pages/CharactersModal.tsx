import { FC, useState } from "react";
import { NoHoverSelector } from "../../frontend/src/components";
import { Modal, Box } from "@mui/material";

interface CharactersModalProps {
    open: boolean;
    close: () => void;
    index: number;
    updateCharacter: (index: number,  character: number) => void;
}

const CharactersModal: FC<CharactersModalProps> = (props) => {
    // save index of the 3 characters
    // match index to character
    return (
      <Modal open={props.open} onClose={props.close}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <NoHoverSelector
            team={props.index}
            updateHover={props.updateCharacter}
          />
        </Box>
      </Modal>
    );
}

export default CharactersModal;