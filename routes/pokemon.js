const express = require('express');
const router = express.Router();
const Pokemon = require('../models/Pokeman');
const authenticate = require('../middleware/auth');
const axios = require('axios');

// Restricted paginated API
router.get('/pokemons', authenticate, async (req, res) => {
  const { page, pageSize } = req.query;
  const pageNumber = parseInt(page);
  const limit = parseInt(pageSize);

  try {
    const totalCount = await Pokemon.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const pokemons = await Pokemon.find()
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    res.status(200).json({ pokemons, totalPages });
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//to get the whole reference data at once
router.get('/referenceData',async (req,res) => {
  const apiUrl = 'https://api.pokemontcg.io/v2/cards';

  try {
    const response = await axios.get(apiUrl);
    const pokemons = response.data.data;

    for (const pokemon of pokemons) {
      const { name, attacks, abilities, images, hp} = pokemon;
      
      const attack = []
      if(attacks)
      for(let i=0;i<attacks.length;i++){
        attack.push(attacks[i]?.name);
      }

      const ability = []
      if(abilities)
      for(let i=0;i<abilities.length;i++){
        ability.push(abilities[i]?.name);
      }

      const newPokemon = new Pokemon({
        name,
        attacks : attack,
        abilities : ability,
        image: images.large,
        hp
      });
      await newPokemon.save();
    }
    console.log('Pokemons collection populated successfully!');
  } catch (error) {
    console.error('Error while populating pokemons collection:', error.message);
  }

})


module.exports = router;
