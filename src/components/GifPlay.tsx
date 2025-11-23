import { Box, Modal } from "@mui/material";
import { Fragment } from "react";
import { useCookies } from "react-cookie";
import useScreenSize from "../hooks/useScreenSize.ts";
interface play {
  link: string; // should either end in .gif or .png or other image format
  isOpen: boolean
}
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been banned!`}</Typography>
//  <Typography sx={{ color: "white", textAlign: "center" }}>{`${selection} has been selected!`}</Typography>
// check this works on mobile (hopefully?)
export const GifPlay = ({
  link,
  isOpen
}: play) => {
  const [cookies, ] = useCookies(["player"]);
  let imgWidth = 1080;
  let imgHeight = 256;
  const totalWidth = useScreenSize().width;
  const totalHeight = useScreenSize().height;
  //console.log("total width: "+totalWidth);
  //console.log("total height: "+totalHeight);
  // default width is half the screen - 540 (the width of the image at full size)
  const defWidth = totalWidth / 2 - 540;
  // console.log(defWidth);
  let width = 1000;
  let height = 0;
  if (
    cookies.player != undefined &&
    localStorage.getItem("x") != null &&
    cookies.player.charAt(0) == "S"
  ) {
    width = parseInt(localStorage.getItem("x")!);
  } else if(defWidth > 0) {
    width = defWidth;
  }
  else{
    width = 0;
  }
  if(defWidth < 0){
    imgWidth = totalWidth;
    // proportionally scale height
    imgHeight = 256 * (imgWidth / 1080);
    height = (totalHeight / 2) - imgHeight;
  }
  if(cookies.player.charAt(0) == "P"){ // bandage fix, will look into soon
    height = 200;
    width = 100;
  }
  return (
    <Fragment>
      {/* turn this in to a component, maybe by providing a state variable*/}
      <Modal open={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: height == 0 ? ((totalHeight / 2) - 256) : height,
            left: width
          }}
        >
          <img src={link} width={imgWidth} height={imgHeight} />
        </Box>
      </Modal>
    </Fragment>
  );
};
