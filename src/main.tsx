import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <Provider store={store}>
    <App />
  </Provider>
);
