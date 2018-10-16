import fetch from 'isomorphic-fetch';

class Client {

      getAuthToken(){
          return fetch('http://localhost:8000/auth',{
              method:'get',
              headers:{
                  accept:'application/json'
              },
          }).then(this.checkStatus)
          .then(this.parseJson)
          .then((json)=>console.log(json))
      }

      isTokenValid() {
        // See note about tokens above
        const url = '/api/check_token?token=' + this.token;
        return fetch(url, {
          method: 'get',
          headers: {
            accept: 'application/json',
          },
        }).then(this.checkStatus)
          .then(this.parseJson)
          .then((json) => json.valid === true);
      }
      isLoggedIn() {
        return !!this.token;
      }
    
      subscribe(cb) {
        this.subscribers.push(cb);
      }
    
      notifySubscribers() {
        this.subscribers.forEach((cb) => cb(this.isLoggedIn()));
      }
    

      getAlbum(albumId) {
        return this.getAlbums([ albumId ], albums => albums[0]);
      }
    
      getAlbums(albumIds) {
        // See note about tokens above
        const url = (
          '/api/albums?ids=' + albumIds.join(',') + '&token=' + this.token
        );
        return fetch(url, {
          method: 'get',
          headers: {
            accept: 'application/json',
          },
        }).then(this.checkStatus)
          .then(this.parseJson);
      }

    //   login() {
    //     return fetch('/api/login', {
    //       method: 'post',
    //       headers: {
    //         accept: 'application/json',
    //       },
    //     }).then(this.checkStatus)
    //       .then(this.parseJson)
    //       .then((json) => this.setToken(json.token));
    //   }
    
      logout() {
        this.removeToken();
      }
    
      checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(`HTTP Error ${response.statusText}`);
          error.status = response.statusText;
          error.response = response;
          console.log(error);
          throw error;
        }
      }
    
      parseJson(response) {
        return response.json();
      }

      search(searchValue,cb){
          return fetch(`http://localhost:8000/spotify/search/${searchValue}`,{
              method:'get',
              headers:{
                  accept:'application/json'
              },
            }).then(this.checkStatus)
            .then(this.parseJSON)
            .then(cb);
          }
    }

    export const client = new Client();