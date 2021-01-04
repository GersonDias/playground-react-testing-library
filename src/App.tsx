import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { AppTheme } from "theme";
import { NewUserForm } from "./Pages/NewUser/NewUserForm";

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <div className="App">
        <NewUserForm />
      </div>
    </ThemeProvider>
  );
}

export default App;
