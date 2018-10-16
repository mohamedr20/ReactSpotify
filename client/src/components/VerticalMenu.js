import React from 'react';

import { NavLink } from 'react-router-dom';

import '../styles/VerticalMenu.css';

const navMenuStyles = {
    height:'600px',
    maxHeight:'648px',
    marginTop:'-57px',
    overflowY:'hidden',
    overflowX:'auto'
}


const VerticalMenu = ({ albums, albumsPathname }) => (
<div style={navMenuStyles} className="ui border secondary vertical menu">
  <NavLink to="/artist"className="active item">
    Artist
  </NavLink>
  <NavLink to="/albums" className="item">
    Albums
  </NavLink>
  <NavLink to="/browse" className="item">
    Browse
  </NavLink>
  <NavLink to="/search"className="item">
    Search
  </NavLink>
</div>
);

export default VerticalMenu;
