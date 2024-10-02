import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ReceiptPercentIcon } from "@heroicons/react/24/solid";
import "./sidebar.scss";
import { link } from "fs";

const links = [
  {
    name: "Home",
    link: "/",
    icon: <HomeIcon width={20} />,
  },
  {
    name: "Invoices",
    link: "/invoices",
    icon: <ReceiptPercentIcon width={20} />,
  },
];

const Sidebar = () => {
  return (
    <div className="sidebar flex flex-col ">
      <ul>
        {links.map(({ name, icon, link }) => (
          <li>
            <Link to={link} className="link flex items-center gap-2 active">
              {icon}
              <span>{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
