import { useEffect, useState } from "react";

// we can have the situation when result for 'ber' is completed after result for 'berry'
// normally we have signal property in fetch function https://developer.mozilla.org/en-US/docs/Web/API/fetch
// also it is important to mention about throttling (when you can call a funciton only certain amount of times within the given time period)
// also we can add some sort of in memory cache (when we search for a same world twice we should instantly see it),
const getAutocompleteResults = (
  query: string,
  signal: AbortSignal
): Promise<string[]> => {
  const pokemons = [
    "Bulbasaur",
    "Ivysaur",
    "Venusaur",
    "Charmander",
    "Charmeleon",
    "Charizard",
    "Squirtle",
    "Wartortle",
    "Blastoise",
    "Caterpie",
    "Metapod",
    "Butterfree",
    "Weedle",
    "Kakuna",
    "Beedrill",
    "Pidgey",
    "Pidgeotto",
    "Pidgeot",
    "Rattata",
    "Raticate",
    "Spearow",
    "Fearow",
    "Ekans",
    "Arbok",
    "Pikachu",
    "Raichu",
    "Sandshrew",
    "Sandslash",
    "Nidoran",
    "Nidorina",
    "Nidoqueen",
    "Nidoran",
    "Nidorino",
    "Nidoking",
    "Clefairy",
    "Clefable",
    "Vulpix",
    "Ninetales",
    "Jigglypuff",
    "Wigglytuff",
    "Zubat",
    "Golbat",
    "Oddish",
    "Gloom",
    "Vileplume",
    "Paras",
    "Parasect",
    "Venonat",
    "Venomoth",
    "Diglett",
    "Dugtrio",
    "Meowth",
    "Persian",
    "Psyduck",
    "Golduck",
    "Mankey",
    "Primeape",
    "Growlithe",
    "Arcanine",
    "Poliwag",
    "Poliwhirl",
    "Poliwrath",
    "Abra",
    "Kadabra",
    "Alakazam",
    "Machop",
    "Machoke",
    "Machamp",
    "Bellsprout",
    "Weepinbell",
    "Victreebel",
    "Tentacool",
    "Tentacruel",
    "Geodude",
    "Graveler",
    "Golem",
    "Ponyta",
    "Rapidash",
    "Slowpoke",
    "Slowbro",
    "Magnemite",
    "Magneton",
    "Farfetch'd",
    "Doduo",
    "Dodrio",
    "Seel",
    "Dewgong",
    "Grimer",
    "Muk",
    "Shellder",
    "Cloyster",
    "Gastly",
    "Haunter",
    "Gengar",
    "Onix",
    "Drowzee",
    "Hypno",
    "Krabby",
    "Kingler",
    "Voltorb",
    "Electrode",
    "Exeggcute",
    "Exeggutor",
    "Cubone",
    "Marowak",
    "Hitmonlee",
    "Hitmonchan",
    "Lickitung",
    "Koffing",
    "Weezing",
    "Rhyhorn",
    "Rhydon",
    "Chansey",
    "Tangela",
    "Kangaskhan",
    "Horsea",
    "Seadra",
    "Goldeen",
    "Seaking",
    "Staryu",
    "Starmie",
    "Mr. Mime",
    "Scyther",
    "Jynx",
    "Electabuzz",
    "Magmar",
    "Pinsir",
    "Tauros",
    "Magikarp",
    "Gyarados",
    "Lapras",
    "Ditto",
    "Eevee",
    "Vaporeon",
    "Jolteon",
    "Flareon",
    "Porygon",
    "Omanyte",
    "Omastar",
    "Kabuto",
    "Kabutops",
    "Aerodactyl",
    "Snorlax",
    "Articuno",
    "Zapdos",
    "Moltres",
    "Dratini",
    "Dragonair",
    "Dragonite",
    "Mewtwo",
    "Mew",
  ];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (signal?.aborted) reject(signal.reason);
      resolve(
        pokemons.filter((pokemon) =>
          pokemon.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, Math.random() * 1000); // imitating slow api request
  });
};

const useDebounceValue = (value: string, time = 250) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), time);

    return () => clearTimeout(timeout);
  }, [value, time]);

  return debounceValue;
};

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceQuery = useDebounceValue(query);
  const controller = new AbortController();

  useEffect(() => {
    const signal = controller.signal;

    (async () => {
      if (!debounceQuery) {
        setSuggestions([]);
        return;
      }

      const data = await getAutocompleteResults(debounceQuery, signal);
      setSuggestions(data);
    })();
    return () => controller.abort("cansel request");
  }, [debounceQuery]);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-900">
      <h3 className="mt-24 mb-2 text-gray-200 font-medium text-sm">
        Search for Pokemons
      </h3>
      <input
        type="text"
        className="mb-4 rounded-md pl-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="text-gray-200 flex flex-col gap-2 items-center">
        <ul>
          {suggestions.map((suggestion, index) => {
            return <li key={index}>{suggestion}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
