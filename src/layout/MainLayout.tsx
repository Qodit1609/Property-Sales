import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import { Outlet } from "react-router-dom";


function MainLayout() {
  return (
    <div >
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  );
}

export default MainLayout;
