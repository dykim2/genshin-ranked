export default function Rules() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <div style={{ color: "white" }}>
        <h1>Genshin Ranked rulebook</h1>
        <p style={{ fontsize: "18px" }}>
          GENSHIN RANKED is a CO-OP 3v3 gamemode where players are organized in
          teams of 3 to fight a series of bosses. Whichever team can kill the
          bosses faster will win.
        </p>
        <b>
          <p style={{ fontsize: "18px" }}>DIVISIONS:</p>
        </b>
        <p style={{ fontsize: "12px" }}>
          Currently, there are THREE different divisions:{" "}
          <span style={{ color: "lightgreen" }}>OPEN, </span>
          <span style={{ color: "yellow" }}>ADVANCED, </span>
          and <span style={{ color: "red" }}>PREMIER</span>
          . These divisions are separated based off of INVESTMENT, and units in
          the same division should perform similarly. During any division match,
          all players may only use characters and weapons within that division
          OR a lower division.
          <br />
          Refer to the{" "}
          <a href="characters">
            <span style={{ color: "wheat" }}>characters</span>
          </a>{" "}
          section on this website to determine your division. If you need
          assistance, please join the DISCORD SERVER (discord.gg/fnGdP36E2Q) and
          ask a member to help!
        </p>
        <b>
          <p style={{ fontsize: "18px" }}>GAMEMODES:</p>
        </b>
        <p style={{ fontsize: "12px" }}>
          RANKED has 2 different gamemodes:{" "}
          <span style={{ color: "tomato" }}>DRAFT PICK</span> and
          <span style={{ color: "lightblue" }}> BLIND PICK</span>
          <br />
          DRAFT PICK involves banning different characters for BOTH teams.
          Additionally, the character picks across teams may NOT overlap.
          <br />
          BLIND PICK involves each team picking a set of characters to use, with
          no bans. Character picks across teams may overlap.
          <br />
          It is generally recommended for newer players to start with BLIND
          PICK, but the game may be played however you wish.
          <br />
          HAVE FUN!
          <br />{" "}
        </p>
        <b>
          <p style={{ fontsize: "18px" }}>
            <u>GAMEPLAY 3V3 RULES</u>
          </p>
        </b>
        <p style={{ fontsize: "12px" }}>
          WL8, 1 ref per world, no consumables, no gadgets, no external
          assistance.
        </p>
        <p style={{ fontsize: "16px" }}>
          <u>BOSS PICKS</u>
          <br />
          Team 1 and Team 2 alternate boss picks. Each team chooses 3-4 boss, 
          depending on division. In addition, each team has to fight the default boss, Ruin Drake first.
          <br />
        </p>
        <u></u>
        <p style={{ fontsize: "16px" }}>
          <u>CHARACTER PICKS</u>
          <br />
          A ban completely removes the character from both teams' pools.
          Currently, we do not allow duplicate characters. You have 30 seconds
          to decide on a ban, else, it is forfeit.
          <br />
          You have 30 seconds to decide on a character. Team1 picks one character first, 
          followed by two picks from Team2. Team1 then gets to pick two characters followed 
          by one pick from Team2. Then Team2 bans one character followed by one character ban 
          from Team1. Finally, Team2 gets one pick followed by two picks from Team1. Team2 then 
          gets to pick 2 followed by one pick from Team1. 
          Matches will be determined by a best 7 or 9, depending on the division. 
          You may hover a selection by typing "hover" before a pick. Depending on draft or
          blind, the pick order may be different. You must ONLY pick characters
          that fall in your division or below based off the
          <a href="/characters">
            <span style={{ color: "wheat" }}>character</span>
          </a>
          archive.
          <u></u>
        </p>
        <p style={{ fontsize: "16px" }}>
          <u>MATCH START</u>
          <br />
          Prep phase is determined by division. Clean out the world if you need
          to get places safely. During the 2 min roll call, showcase your
          selected build on character profile and you may start with desired hp
          and energy designate yourself as ready with "r" or "ready" ref will
          type "Timer is ready, you have 15 seconds to begin" and you shall kill
          the opponent as fast as you can. In cases of a solo ref, team 1 goes
          first, then team 2
        </p>
        <u></u>
        <p style={{ fontsize: "16px" }}>
          <u>ACCIDENTS</u>
          <br />
          Do not respawn until the boss is complete. Do not heal or obtain
          energy outside of combat. If both teams die, the team that survived
          for the longest amount of time wins. Legal heals occur while the match
          timer is active.
        </p>
        <u></u>
        <p style={{ fontsize: "16px" }}>
          <u>FREE RESET</u>
          <br />
          Every team is allowed one free reset to account for technical issues.
          2 min roll call for HP and energy as desired
        </p>
      </div>
    </>
  );
}