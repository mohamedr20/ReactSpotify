

var request = require('request-promise'); // "Request" library
var client_id = require('./config').client_id;
var client_secret = require('./config').client_secret;

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
app.get('/',(req,res)=>{
    res.send("Invalid endpoint")
})
app.listen(port || process.env.PORT,()=>{
    console.log('Server started on port '+port)
})


