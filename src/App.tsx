import {Provider} from "react-redux";
import "./App.css";
import WebRouter from "./setup/WebRouter.tsx";
import {StrictMode, useState, useRef} from "react";
import {store} from "./app/store.ts";
import {createTheme, ThemeProvider} from "@mui/material";

const App = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const openRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
  const resetSocket = () => {
    if (
      !socket ||
      socket.readyState === WebSocket.CLOSED ||
      socket.readyState === WebSocket.CLOSING
    ) {
      setSocket(new WebSocket(socketOpts[0]));
      console.log("opening new socket");
      // timeout to wait 2 seconds before trying again
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        // check socket
        if(openRef.current){
          // exit interval
          if(timerRef.current) clearInterval(timerRef.current);
          openRef.current = false;
          return;
        }
        const socket = new WebSocket(socketOpts[0]);
        setSocket(socket);
        // pass a function that is edited to reset the socket
      }, 3000);
    }
  }
  resetSocket();
  const socketOpen = () => {
    openRef.current = true;
  }
  const theme = createTheme({
    typography: {fontFamily: "Roboto Mono", fontSize: 10}
  })
  return (
    <StrictMode>
      <div className="font">
        <div className="background" />
        <div className="main-content" style={{color: "white"}}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <WebRouter
                socket={socket!}
                resetSocket={resetSocket}
                socketOpen={socketOpen}
              />
            </ThemeProvider>
          </Provider>
        </div>
      </div>
    </StrictMode>
  );
}
export default App;