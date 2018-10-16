

var request = require('request-promise'); // "Request" library
const client_id = "02d60be67add4e9e809f0053f6e6938e";
const client_secret = "19f97e42c62e432c9dfdd55846b19333"
const SpotifyClient = require('./SpotifyClient');
var express = require('express');
var app = express();
var port = 8000;

// curl -X "POST" -H "Authorization: Basic 413ad935a77746039180a507510de9f3:b99b342ba55a4753971b7fdeb79ed57b" -d grant_type=client_credentials http://accounts.spotify.com/api/token
// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

function getAuthToken(req,res){
    request.post(authOptions)
    .then(function(body){
        var token  = body.access_token;
        res.json({token:token,msg:'Able to retrieve token'})
    })
    .catch(err=>{
        res.json({err:'Unable to recieve token'})
    })
}

app.get('/auth',getAuthToken);

/**
 * @param artist_id 
 * Taken from Spotify Client
 * This will fetch an artist by id from the Spotify API
 * @returns {id:"",imageUrl:"",name:""} of Artist
 */
app.get('/spotify/artist/:artist_id',(req,res)=>{
    const artist_id = req.params.artist_id;
    SpotifyClient.getArtist(artist_id)
    .then((data)=>(
        res.json({data:data})
    ))
    .catch((err)=>res.json({err:err}))
});

/**
 * @param artist_id
 * Taken from SpotifyClient
 * This will fetch an artist's albums from the Spotify API
 * @returns [{id:"",artist:{name:"",id:""},year:"",imageUrl:"",name:""},...]
 */
app.get('/spotify/artist/artist_albums/:artist_id',(req,res)=>{
    const artist_id = req.params.artist_id;
    SpotifyClient.getArtistAlbums(artist_id)
    .then((data)=>(
       res.json({data:data})
    ))
    .catch((err)=>res.json({err:err}))
})

/**
 * @param artist_id
 * Taken from SpotifyClient
 * This will fetch an artist 
 */
app.get('/spotify/artist/artist_detailed/:artist_id',(req,res)=>{
    const artist_id = req.params.artist_id;
    SpotifyClient.getArtistDetailed(artist_id)
    .then((data)=>(
        res.json({data:data})
    ))
    .catch((err)=>res.json({err:err}))
})

app.get('/spotify/artist/top_tracks/:artist_id',(req,res)=>{
    const artist_id = req.params.artist_id;
    SpotifyClient.getArtistTopTracks(artist_id)
    .then((data)=>(
        res.json({data:data})
    ))
    .catch((err)=>res.json({err:err}))
})

app.get('/spotify/search/:search_query',(req,res)=>{
    const search_query = req.params.search_query;
    SpotifyClient.spotifySearch(search_query)
    .then((data)=>(
        res.json({data:data})
    ))
    .catch((err)=>res.json({err:err}))
})

app.get('/',(req,res)=>{
    res.send("Invalid endpoint")
})

app.listen(port || process.env.PORT,()=>{
    console.log('Server started on port '+port)
})


SpotifyClient._getApiToken()
.then((data)=>console.log(data));   