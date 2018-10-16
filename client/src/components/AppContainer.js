import React, { Component } from 'react';

//import Album from './Album';
import { client } from '../Client';
import ArtistContainer from './Artist/ArtistContainer';
import AlbumContainer from './Album/AlbumContainer';
import SearchContainer from './Search/SearchContainer';
import BrowseContainer from './Browse/BrowseContainer';

import {Route} from 'react-router';
import VerticalMenu from './VerticalMenu';

// const ALBUM_IDS = [
//   '23O4F21GDWiGd33tFN3ZgI',
//   '3AQgdwMNCiN7awXch5fAaG',
//   '1kmyirVya5fRxdjsPFDM05',
//   '6ymZBbRSmzAvoSGmwAFoxm',
//   '4Mw9Gcu1LT7JaipXdwrq1Q',
// ];

const divStyle = {
    maxWidth:'250px',
    marginLeft:'20px'
}

class AppContainer extends Component {
  state = {
    fetched: true,
    albums: [{id:1,name:"First"},{id:2,name:"Second"}],
    names:"Match"
  };

  componentDidMount() {
    client.getAuthToken()
  }

  render() {
    if (!this.state.fetched) {
      return (
        <div className='ui active centered inline loader' />
      );
    } else {
      return (
        <div className='ui two column divided grid'>
          <div
            className='ui six wide m-l column'
            style={divStyle}
          >
            <VerticalMenu
              albums={this.state.albums}
              albumsPathname={this.state.name}
            />
          </div>
          <div className='ui ten wide column'>
            <Route path="/artist" component={ArtistContainer}/>
            <Route path="/albums" component={AlbumContainer}/>
            <Route path="/search" component={SearchContainer}/>
          </div>
        </div>
      );
    }
  }
}

export default AppContainer;
