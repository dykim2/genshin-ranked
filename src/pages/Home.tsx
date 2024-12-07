import { Box, Button, Modal, Typography } from "@mui/material";
import { useState, Fragment } from "react";
import React from "react";

export default function Home(){
  const centerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "pre-line",
    fontFamily: "Roboto Mono",
    flexDirection: "column"
  };
    return (
      <div
        style={{
          marginTop: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "pre-line",
          fontFamily: "Roboto Mono",
          flexDirection: "column",
        }}
      > 
        <Typography sx={{ fontSize: 60 }}>
          {`Welcome to the homepage of the Ranked website!`}
        </Typography>
        <Typography>{` `}</Typography>
        <br />
        <Typography></Typography>
        <Fragment>
          <Button
            variant="contained"
            sx={{ fontSize: 30 }}
            href="https://docs.google.com/spreadsheets/d/1_h1ya0jeoiP8mZamL6Bt_tm0uQGdOuVj6INX0aZqJhw/edit?gid=1427018506#gid=1427018506"
          >
            Ranked Casual Matches
          </Button>
          {/* connect to different sheets*/}
          <Button
            variant="contained"
            sx={{ fontSize: 30 }}
            href="https://docs.google.com/spreadsheets/d/11syVe0tiQUvVxWnL17SpD_Z7WTrQ1EkDboVGFDXkSXo/edit?gid=960982211#gid=960982211"
          >
            Ranked League Season 2 Sheet
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: 30 }}
            href="http://bit.ly/genshinranked"
          >
            Ranked Discord
          </Button>
          <Typography sx={{ fontSize: 35 }}>{`\nLinks\n`}</Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ fontSize: 25 }}
            href="/characters"
          >
            Characters
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ fontSize: 25 }}
            href="/bosses"
          >
            Bosses
          </Button>
        </Fragment>
      </div>
    ); 
}