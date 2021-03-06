import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import Amplify, { Hub, DataStore } from "aws-amplify";
import awsExports from "./aws-exports";
import { Provider } from "react-redux";
import { store } from "./reduxStore";
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
  responsiveFontSizes,
  Theme,
} from "@material-ui/core";
import { blueGrey, teal } from "@material-ui/core/colors";
import App from "./App";
import { syncUserWithRedux } from "./auth/utils";

Amplify.configure(awsExports);
Hub.listen("auth", syncUserWithRedux);
Hub.listen("auth", async (data) => {
  if (data.payload.event === "signOut") {
    console.info("Clearing local data store ...");
    await DataStore.clear();
    console.info("Local data store cleared.");
  }
});

let theme: Theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: teal[400],
    },
    secondary: {
      main: blueGrey[400],
    },
    background: {
      default: "#242424",
    },
  },
  overrides: {
    MuiTypography: {
      h1: {
        fontWeight: "bold",
        color: teal[400],
      },
      h2: {
        fontWeight: "normal",
        color: teal[400],
      },
      h3: {
        fontWeight: "lighter",
        color: teal[400],
      },
    },
  },
});
theme = responsiveFontSizes(theme);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
