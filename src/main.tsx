import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { i18nReady } from "./i18n";
import "./index.css";

const THEME_KEY = "theme";
const applyTheme = (theme: "light" | "dark") => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
};

const storedTheme = localStorage.getItem(THEME_KEY);
const initialTheme: "light" | "dark" = storedTheme === "dark" ? "dark" : "light";
applyTheme(initialTheme);
localStorage.setItem(THEME_KEY, initialTheme);

void i18nReady.then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
});
