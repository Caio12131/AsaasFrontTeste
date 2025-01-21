import React from "react";
import ReactDOM from "react-dom/client"; // Certifique-se de importar de 'react-dom/client' no React 18
import Root from "./componentes/root/Root"; // Importe o componente Root
import "./styles.css";

const rootElement = document.getElementById("root"); // Seleciona o elemento com id 'root'
const root = ReactDOM.createRoot(rootElement); // Cria o root para renderizar

root.render(<Root />); // Renderiza o componente Root
