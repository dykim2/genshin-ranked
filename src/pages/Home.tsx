import {Button, Typography} from "@mui/material";
import {Fragment} from "react";

export default function Home(){
  const fontSizeChoice = {xs: 10, sm: 17, md: 23, lg: 29, xl: 34};
  const widthChoice = {xs: 210, sm: 330, md: 430, lg: 540, xl: 625};
  const charBossLinkSize = {xs: 7, sm: 10, md: 14, lg: 19, xl: 25};
  const charBossButtonSize = {xs: 80, sm: 105, md: 135, lg: 170, xl: 215};
  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "pre-line",
        fontFamily: "Roboto Mono",
        flexDirection: "column",
      }}
    >
      <Typography sx={{fontSize: {xs: 15, sm: 23, md: 36, lg: 47, xl: 60}, textAlign: "center" }}>
        {`Welcome to the homepage of the RANKED website!`}
      </Typography>
      <br />
      <Fragment>
        <Button
          variant="contained"
          sx={{
            fontSize: fontSizeChoice,
            minWidth: widthChoice,
            marginBottom: 3,
          }}
          href="https://docs.google.com/spreadsheets/d/1_h1ya0jeoiP8mZamL6Bt_tm0uQGdOuVj6INX0aZqJhw/edit?gid=1427018506#gid=1427018506"
        >
          Ranked Casual Matches
        </Button>
        {/* connect to different sheets*/}
        <Button
          variant="contained"
          sx={{
            fontSize: fontSizeChoice,
            minWidth: widthChoice,
            marginBottom: 3,
          }}
          href="https://docs.google.com/spreadsheets/d/1pKupoKUxiT_pFFgL53yDEgtMZWdPCYetk9OZiF2-474/edit?gid=2094575644#gid=2094575644"
        >
          Player Spreadsheet (casual)
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: fontSizeChoice,
            minWidth: widthChoice,
            marginBottom: 3,
          }}
          href="https://docs.google.com/spreadsheets/d/1uQ6sFSPISXJIOyb9M7UYFSTq-iJQ2RtSph4aDAmlD_8/edit?gid=458647158#gid=458647158"
        >
          Ranked Statistics sheet
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: fontSizeChoice,
            minWidth: widthChoice,
            marginBottom: 3,
          }}
          href="http://bit.ly/genshinranked"
        >
          Ranked Discord
        </Button>
        <Typography
          sx={{fontSize: fontSizeChoice, marginBottom: 3}}
        >{`Links`}</Typography>
        <Button
          variant="contained"
          color="success"
          sx={{fontSize: charBossLinkSize, minWidth: charBossButtonSize, marginBottom: 3}}
          href="/characters"
        >
          Characters
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ fontSize: charBossLinkSize, minWidth: charBossButtonSize }}
          href="/bosses"
        >
          Bosses
        </Button>
      </Fragment>
    </div>
  ); 
}