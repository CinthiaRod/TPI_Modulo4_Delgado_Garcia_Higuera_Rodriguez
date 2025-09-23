const Song = require('../MODELS/songsModel');

class SongsService { 
    // Los métodos ahora son asíncronos para interactuar con la DB
    async getAllSongs() {
        return await Song.find();
    }

    async getSongsById(id) {
        return await Song.findById(id);
    }

    async addSong(songData) {
        const newSongs = new Song (songData);
        return await newSongs.save();
    }

    async updateSong(id, songData) { 
        return await Song.findByIdAndUpdate(id, songData, { new: true });
    }

    async deleteSong(id) { 
        return await Song.findByIdAndDelete(id);
    }
}

module.exports = new SongsService();