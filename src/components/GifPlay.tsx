import { Box, Modal } from "@mui/material";
import { Fragment } from "react";
import { useCookies } from "react-cookie";
import useScreenSize from "../hooks/useScreenSize.ts";
interface play {
  link: string; // should either end in .gif or .png or other image format
  isOpen: boolean;
  holdingContainerRef?: React.RefObject<HTMLDivElement>;
}
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been banned!`}</Typography>
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been selected!`}</Typography>
// check this works on mobile (hopefully?)
export const GifPlay = ({
  link,
  isOpen,
  holdingContainerRef
}: play) => {
  const [cookies, ] = useCookies(["player"]);
  let imgWidth = 1080;
  let imgHeight = 256;
  const totalWidth = useScreenSize().width;
  const totalHeight = useScreenSize().height;
  //console.log("total width: "+totalWidth);
  //console.log("total height: "+totalHeight);
  // default width is half the screen - 540 (the width of the image at full size)
  // console.log(defWidth);
  let centeredTop = totalHeight / 2 - 256;
  let centeredLeft = totalWidth / 2 - imgWidth / 2;

  if (holdingContainerRef?.current) {
    const rect = holdingContainerRef.current.getBoundingClientRect();
    centeredTop = rect.top + rect.height / 2 - 128; 
    centeredLeft = rect.left + rect.width / 2 - imgWidth / 2;
  }
  return (
    <Fragment>
      {/* turn this in to a component, maybe by providing a state variable*/}
      <Modal open={isOpen}>
        <Box
          sx={{
            position: "fixed",
            top: centeredTop,
            left: centeredLeft,
          }}
        >
          <img src={link} width={imgWidth} height={imgHeight} />
        </Box>
      </Modal>
    </Fragment>
  );
};
