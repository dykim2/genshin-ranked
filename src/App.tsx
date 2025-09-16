import {Provider} from "react-redux";
import "./App.css";
import WebRouter from "./setup/WebRouter.tsx";
import {useRef} from "react";
import {store} from "./app/store.ts";
import {createTheme, ThemeProvider} from "@mui/material";

const App = () => {
  const socketRef = useRef<WebSocket>(null);
  // push the socket up even higher, to ideally prevent it from being created again
  // obtain data here instead, i only need to grab it once anyways
  let userId = localStorage.getItem("userid");
  if (userId == null) {
    userId = crypto.randomUUID();
    localStorage.setItem("userid", userId);
  }
  let socketOpts = [
    `wss://rankedwebsocketapi.fly.dev?userId=${userId}`,
    `ws://localhost:8080?userId=${userId}`,
  ];
  if (
    !socketRef.current ||
    socketRef.current.readyState === WebSocket.CLOSED ||
    socketRef.current.readyState === WebSocket.CLOSING
  ) {
    // console.log("making a new socket connection");
    socketRef.current = new WebSocket(socketOpts[0]);
  }
  const theme = createTheme({
    typography: {fontFamily: "Roboto Mono", fontSize: 10}
  })
  return (
    <div className="font">
      <div className="background" />
      <div className="main-content" style={{color: "white"}}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <WebRouter socket={socketRef.current} />
          </ThemeProvider>
        </Provider>
      </div>
    </div>
  );
}
export default App;