import React,{Component} from 'react';

class TopBar extends React.Component{

    render(){
        return(
            <div
            className='ui huge top attached fluid secondary menu'
          >
            <div className='item' />
            <div className='item'>
              <h1
                className='ui green header'
                style={{ marginTop: '10px' }}
              >
                Fullstack Music
              </h1>
            </div>
          </div>
        )
    }
} 

export default TopBar