"use client";

import { useEffect, useState } from "react";

interface PokemonAPIResult {
  name: string;
  url: string;
}

interface Pokemon {
  name: string;
  image: string;
  description: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon: PokemonAPIResult) => {
            const resDetails = await fetch(pokemon.url);
            const details = await resDetails.json();

            const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${details.id}/`);
            const species = await resSpecies.json();

            const descriptionEntry = species.flavor_text_entries.find(
              (entry: any) => entry.language.name === "en"
            );

            return {
              name: pokemon.name,
              image: details.sprites.other["official-artwork"].front_default,
              description: descriptionEntry
                ? descriptionEntry.flavor_text.replace(/\f/g, ' ')
                : "No description available.",
            };
          })
        );

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error('Erro ao buscar Pokémons:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600">
        <h1 className="text-4xl font-bold text-white animate-pulse">Carregando...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-red-300 py-10">
      <h1 className="text-5xl font-bold text-center mb-12 text-red-800 drop-shadow-lg">Pokédex 1° Gen</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8">
        {pokemons.map((pokemon, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border-4 border-red-500 hover:scale-105 transform transition-all overflow-hidden"
          >
            <div className="bg-red-500 p-4">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-full h-40 object-contain"
              />
            </div>
            <div className="p-4">
              <h2 className="text-2xl font-bold text-center capitalize text-gray-800 mb-2">{pokemon.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
