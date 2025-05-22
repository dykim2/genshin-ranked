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
          {`Welcome to the homepage of the RANKED website!`}
        </Typography>
        <Typography>{` `}</Typography>
        <br />
        <Typography></Typography>
        <Fragment>
          <Button
            variant="contained"
            sx={{ fontSize: 30, minWidth: 560, marginBottom: 3 }}
            href="https://docs.google.com/spreadsheets/d/1_h1ya0jeoiP8mZamL6Bt_tm0uQGdOuVj6INX0aZqJhw/edit?gid=1427018506#gid=1427018506"
          >
            Ranked Casual Matches
          </Button>
          {/* connect to different sheets*/}
          <Button
            variant="contained"
            sx={{ fontSize: 30, minWidth: 560, marginBottom: 3 }}
            href="https://docs.google.com/spreadsheets/d/1pKupoKUxiT_pFFgL53yDEgtMZWdPCYetk9OZiF2-474/edit?gid=2094575644#gid=2094575644"
          >
            Player Spreadsheet (casual)
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: 30, minWidth: 560, marginBottom: 3 }}
            href="https://docs.google.com/spreadsheets/d/1uQ6sFSPISXJIOyb9M7UYFSTq-iJQ2RtSph4aDAmlD_8/edit?gid=458647158#gid=458647158"
          >
            Ranked Statistics sheet
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: 30, minWidth: 560, marginBottom: 3 }}
            href="http://bit.ly/genshinranked"
          >
            Ranked Discord
          </Button>
          <Typography sx={{ fontSize: 35, marginBottom: 3 }}>{`Links`}</Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ fontSize: 25, minWidth: 200, marginBottom: 3 }}
            href="/characters"
          >
            Characters
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ fontSize: 25, minWidth: 200 }}
            href="/bosses"
          >
            Bosses
          </Button>
        </Fragment>
      </div>
    ); 
}