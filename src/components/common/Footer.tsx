import { JSX } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../pages/routes';

interface Route {
    path: string;
    name: string;
    private?: boolean;
    children?: Route[];
}

const renderSitemapLinks = (routes: Route[]): JSX.Element[] => {
    return routes.flatMap((route, idx) => {
        if (route.private) return []; // Skip private routes

        const link = (
            <li key={route.path + idx}>
                <Link to={route.path} className="hover:underline">{route.name}</Link>
            </li>
        );

        if (route.children) {
            return [link, ...renderSitemapLinks(route.children)];
        }

        return [link];
    });
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-5 px-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-3" >
        {/* Sitemap */}
        <div className = "text-center">
          <ul className="space-y-2">{renderSitemapLinks(routes)}</ul>
        </div>

        {/* Address */}
        <div className = "text-center">
          <h3 className="text-xl font-semibold mb-4">Address</h3>
          <p>221B Baker Street<br />Marylebone, London<br />NW1 6XE, United Kingdom</p>
        </div>

        {/* Contact */}
        <div className = "text-center">
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p>Email: <a href="mailto:kevin@cattt.space" className="hover:underline">kevin@cattt.space</a></p>
          <p><a href="https://discord.gg/7jEAXPxa" className="hover:underline">Join Discord server</a></p>
        </div>
      </div>

      <div className="flex-1 text-center text-sm text-gray-400 py-5 px-10">
        &copy; {new Date().getFullYear()} Cattt. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;