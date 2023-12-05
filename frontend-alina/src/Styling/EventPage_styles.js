import { makeStyles } from "@material-ui/core";

const EventPage_styles = makeStyles((theme) => ({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Krona one"',
    ].join(","),
  },

  middleDiv: {
    marginTop: 100,
    display: "flex",
    justifyContent: "center",
  },

  Card: {
    display: "flex",
    width: "75%",
  },

  CardLeft: {
    display: "inline-block",
    width: "33%",
  },

  CardRight: {
    display: "inline-block",
    width: "66%",
  },

  ButtonDiv: {
    justifyContent: "center",
    display: "flex",
  },

  Button: {
    marginTop: 40,
    backgroundColor: "#000000",
    color: "#FCFBF4",
    fontFamily: "Krona one",
    borderRadius: 30,
    padding: 20,
    position: "relative",
  },
}));

export default EventPage_styles;
