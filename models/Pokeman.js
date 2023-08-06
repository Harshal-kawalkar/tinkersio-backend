const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hp:{
    type: String,
  },
  attacks: [
    {
      type: String,
    },
  ],
  abilities: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
    required: true,
  },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
