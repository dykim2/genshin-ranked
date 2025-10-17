import {Provider} from "react-redux";
import "./App.css";
import WebRouter from "./setup/WebRouter.tsx";
import {StrictMode, useState, useRef, useEffect} from "react";
import {store} from "./app/store.ts";
import {createTheme, ThemeProvider} from "@mui/material";

const App = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const openRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      setSocket(new WebSocket(socketOpts[1]));
      console.log("opening new socket");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setInterval(() => {
        if (socket) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
        } 
        if (openRef.current) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          openRef.current = false;
          return;
        }
        const newSocket = new WebSocket(socketOpts[0]);
        setSocket(newSocket);
      }, 3000);
    }
  };

  useEffect(() => {
    resetSocket(); 
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log("close");
    } else {
      console.log("no close");
    }
    console.log("new socket is here?");
  }, [socket]);

  const socketOpen = () => {
    openRef.current = true;
  };

  const theme = createTheme({
    typography: {fontFamily: "Roboto Mono", fontSize: 10}
  });

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
};
export default App;