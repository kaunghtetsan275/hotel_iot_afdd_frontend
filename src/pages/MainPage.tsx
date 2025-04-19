import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import TopSection from '../components/common/TopSection';
import NavigationBar from '../components/common/NavigationBar';
import Footer from '../components/common/Footer';
import routes from './routes';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tab = location.pathname.split('/')[1] || 'dashboard';   // Extract tab from path

  const handleTabChange = (newTab: string) => {
    navigate(`/${newTab}${location.search}`);
  };

  interface RouteConfig {
    path: string;
    name: string;
    element?: React.ReactNode;
    children?: RouteConfig[];
  }

  const renderRoutes = (routes: RouteConfig[]): React.ReactNode =>
    routes.map(({ path, name, element = <div>{name}</div>, children }, idx) => (
      <Route key={idx} path={path} element={element}>
        {children && renderRoutes(children)}
      </Route>
    ));

  return (
    // frame
    <div className="flex flex-col p-4 h-screen w-screen box-border gap-2">
        <TopSection />
        <NavigationBar activeTab={tab} setActiveTab={handleTabChange} />
        {/* main.body */}
        <div className="flex-1 flex flex-col px-5 py-5 gap-10">
        <Routes>{renderRoutes(routes)}</Routes>
        </div>
        <Footer/>
    </div>
    );
};

export default MainPage;