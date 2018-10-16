import React from 'react';
import {client} from '../../../Client';

class SearchBar extends React.Component{
    state = {
        results:[],
        showRemoveIcon:false,
        searchValue:''
    }

    handleCheckBoxChange = (e)=>{
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(name,value)
        this.setState({
            [name]:value
        })
    }

    handleSearchChange = (e)=>{
        const value = e.target.value;
        console.log(value);
        this.setState({
            searchValue:value
        })
        if(value===''){
            this.setState({
                results:[],
                showRemoveIcon:false
            })
        }
        else{
            this.setState({
                showRemoveIcon:true
            })
            client.search(value,(data)=>{
                return data.json()
            })
            .then((data)=>{
                console.log(data);
                this.setState({
                    results:data.data.artists.items.slice(0,5)
                })
            })
        }
    }

    handleSearchCancel = ()=>{
        this.setState({
            results:[],
            showRemoveIcon:false,
            searchValue:''
        })
    }

    render(){
        return(
            <div id="music-search">
                <div className="ui fluid search">
                    <input
                        className="prompt"
                        type="text"
                        placeholder="Search artist,albums..."
                        value = {this.state.searchValue.value}
                        onChange = {this.handleSearchChange}
                    />
                    <label>
                    Track
                    <input
                    name="track"
                    type="checkbox"
                    onChange={this.handleCheckBoxChange}/>
                    </label>
                    <i className='search icon' />
                    <label>
                    Artist
                    <input
                    name="artist"
                    type="checkbox"
                    onChange={this.handleCheckBoxChange}/>
                    </label>
                    {
                        this.state.showRemoveIcon ? (
                            <i className="remove icon"
                            onClick={this.handleSearchCancel}/>
                        ) : ''
                    }
                </div>
                <div>
                    {
                        this.state.results.map((result,index)=>(
                            <tr
                                key={index}>
                            <td>{result.name}</td>
                            <td>{result.genres[0]}</td>
                            <td>{result.type}</td>
                            </tr>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default SearchBar;