import React from "react";
import DataTable from "./DataTable";
import { useFlag, useVariant } from "@unleash/proxy-client-react";


const App = () => {
  const isEnabled = useFlag("example-flag");
  const endpoint = "posts"; // Variabile con l'URL

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tabella Dati</h1>
      <DataTable endpoint={endpoint} />
    </div>
  );
};

export default App;