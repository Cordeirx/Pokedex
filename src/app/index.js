import { useEffect, useState } from "react";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        
        // Para cada pokemon, buscar também detalhes como imagem
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              name: pokemon.name,
              image: details.sprites.front_default
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-500">
        <h1 className="text-4xl font-bold text-white animate-pulse">Carregando Pokémons...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 py-10">
      <h1 className="text-5xl font-bold text-center mb-10 text-gray-800">Pokédex</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-10">
        {pokemons.map((pokemon, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transform transition-all">
            <img src={pokemon.image} alt={pokemon.name} className="w-full h-40 object-contain p-4" />
            <div className="p-4">
              <h2 className="text-xl font-semibold capitalize text-center">{pokemon.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
