const { Pool } = require("pg");

class PlaylistService{
    constructor(){
        this._pool = new Pool();
    }

    async getPlaylistById(id){
        try {
            const query = {
            text: `select playlist.id, playlist.name from playlist full join users on playlist.owner=users.id where playlist.id = $1`,
            values: [id]
            };
    
        
          const result = await this._pool.query(query);
    
          const querySongs = {
            text: `select * from junction_songs_playlist full join songs on 
            junction_songs_playlist.song_id=songs.id where junction_songs_playlist.playlist_id = $1`,
            values: [result.rows[0].id]
          };
    
          const resultSongs = await this._pool.query(querySongs);
    
          const responseResult = result.rows[0];
    
          const songsResponseList = resultSongs.rows.map((payload) => ({
            id: payload.id,
            title: payload.title,
            performer: payload.performer
          }));
          
          responseResult.songs = songsResponseList;
    
          return {
            playlist: responseResult
          };
        } catch (e) {
          console.log(e);
        }
    }
}

module.exports = PlaylistService;