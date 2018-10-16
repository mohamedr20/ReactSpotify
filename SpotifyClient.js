const fetch  = require('isomorphic-fetch');
const path = require('path');
const fs  = require('fs');
const camelcaseKeys = require('camelcase-keys');
const URI = require('urijs');

const getFirstImageUrl = (images)=>(
    images && images[0] && images[0].url
)

const filterDuplicates = (albums)=>{
    albums.reduce((memo,album)=>{
        if(!memo.find((m)=>m.name === album.name)){
            return memo.concat(album);
        }
        else{
            return memo
        }
    },[])
}

function checkStatus(response){
    if(response.status >=200 && response.status<300){
        return response;
    }
    else{
        const error = new Error(`Http Error ${response.statusText}`)
        error.status = response.statusText;
        error.response = response;
        console.log('Error communicating with Spotify');
        console.log(error);
        throw error;
    }
}

function parseJson(response){
    return response.json();
}

function parseAlbum(album){
    return{
        id:album.id,
        tracks:album.tracks && album.tracks.items.map((i)=>parseTrack(i)),
        artist:parseArtist(album.artists[0]),
        year:album.releaseDate && album.releaseDate.slice(0,4),
        imageUrl:getFirstImageUrl(album.images),
        name:album.name.replace(/\s\(.+\)$/,'')
    }
}

function parseArtist(artist){
    return{
        imageUrl:getFirstImageUrl(artist.images),
        name:artist.name,
        id:artist.id
    }
}

function parseTrack(track){
    return{
        albumImage:track.album && getFirstImageUrl(track.albums.images),
        name:track.name,
        durationMs:track.durationMs,
        id:track.id,
        trackNumber:track.trackNumber,
        previewUrl:track.previewUrl
    }
}

const SPOTIFY_BASE_URI = 'https://api.spotify.com/v1';

const SpotifyClient = module.exports = {

    _getWithToken(url,token){
        return fetch(url,{
            method:'get',
            headers:{
                Accept:'application/json',
                Authorization:`Bearer ${token}`,
            },
        }).then(checkStatus)
        .then(parseJson)
        .then((data)=>camelcaseKeys(data,{deep:true}))
    },

    _get(url){
        if(this.token){
            return this._getWithToken(url,this.token)
        }
        else{
            return this._getApiToken().then((token)=>(
                this._getWithToken(url,token)
            ))
        }
    },
    _getApiToken(){
        return fetch('http://localhost:8000/auth',{
            method:'get',
            headers:{
                Accept:'application/json'
            }
        })
        .then(checkStatus)
        .then(parseJson)
        .then((json) => json.token)
        .then((token) => this.token = token)
    },

    getAlbum(albumId){
        return this._get(
            SPOTIFY_BASE_URI + '/albums/'+album.id
        )
        .then((data)=>parseAlbum(data))
    },

    getAlbums(albumIds){
        return this._get(
            SPOTIFY_BASE_URI+'/albums?ids='+albumIds.join(',')
        )
        .then((data)=>{
            data.albums.map((a)=>parseAlbum(a))
        })
    },
    
    getArtist(artistId){
        return this._get(
            SPOTIFY_BASE_URI+'/artists/'+artistId
        )
        .then((data)=>parseArtist(data))
    },

    getArtistTopTracks(artistId){
        const url = SPOTIFY_BASE_URI +'/artists/'+artistId+'/top-tracks'+'?country=US'
        return this._get(url).then((data)=>(
            data.tracks.map((t)=>t)
        ))
        .catch((err)=>new Error(err))
    },

    getArtistAlbums(artistId){
        const url = (
            SPOTIFY_BASE_URI +'/artists/'+artistId+'/albums'
        );

        return this._get(url).then((data)=>(
            data.items.map((a)=>parseAlbum(a))
        ))
    },

    spotifySearch(searchQuery){
        const url = (
            SPOTIFY_BASE_URI+'/search/'+`?q=${searchQuery}`+
            '&type=track%2C'+'artist'
        )
        return this._get(url).then((data)=>(
            data
        ))
    },

    getArtistAlbumsDetailed(artistId) {
        return this.getArtistAlbums(artistId)
                 .then((albums) => this.getAlbums(
                   albums.map((a) => a.id)
                 ));
      },

    getArtistDetailed(artistId){
        return Promise.all([
            this.getArtist(artistId),
            this.getArtistTopTracks(artistId),
            this.getArtistAlbumsDetailed(artistId),
        ]).then(([artist,topTracks,albums])=>({
            artist,
            topTracks,
            albums:filterDupes(albums)
        })
        .catch((err)=>console.log(err)));
    }
}
