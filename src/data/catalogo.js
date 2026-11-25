/* Catálogo: destinos y paquetes de NÖMAD.
   - lat, lon y zona (zona horaria) se envían a la API del clima (Open-Meteo).
   - img: foto del catálogo en public/img. Si es null, se muestra un degradado o la
     primera foto que el administrador suba desde el panel (Galería). */
export const destinos = [
  {
    id: "parque-tayrona",
    nombre: "Parque Tayrona",
    tipo: "Playa",
    ubicacion: "Magdalena, Colombia",
    lat: 11.33, lon: -74.03, zona: "America/Bogota",
    descripcion: "Selva tropical que cae directo sobre playas de arena blanca vigiladas por la Sierra Nevada. Senderos cortos, agua turquesa, ni un edificio a la vista.",
    destacado: "Playa Cabo San Juan, la más fotografiada del Caribe colombiano",
    img: "img/tayrona.jpg"
  },
  {
    id: "cano-cristales",
    nombre: "Caño Cristales",
    tipo: "Río",
    ubicacion: "Meta, Colombia",
    lat: 2.27, lon: -73.79, zona: "America/Bogota",
    descripcion: "El \"río de los cinco colores\": una planta acuática endémica tiñe el lecho de rojo, verde y amarillo entre junio y noviembre.",
    destacado: "Fenómeno natural único en el mundo",
    img: "img/cano-cristales.jpg"
  },
  {
    id: "valle-de-cocora",
    nombre: "Valle de Cocora",
    tipo: "Montaña",
    ubicacion: "Quindío, Colombia",
    lat: 4.64, lon: -75.49, zona: "America/Bogota",
    descripcion: "Caminata de altura entre palmas de cera —el árbol nacional de Colombia y la palma más alta del mundo— con niebla de eje cafetero.",
    destacado: "Palmas de hasta 60 metros de altura",
    img: null
  },
  {
    id: "ciudad-perdida",
    nombre: "Ciudad Perdida",
    tipo: "Trekking",
    ubicacion: "Sierra Nevada, Colombia",
    lat: 11.04, lon: -73.93, zona: "America/Bogota",
    descripcion: "Cuatro a cinco días de selva y río hasta una ciudad Tairona de 700 d.C., 650 años más antigua que Machu Picchu.",
    destacado: "1.200 escalones de piedra original",
    img: null
  },
  {
    id: "chapada-diamantina",
    nombre: "Chapada Diamantina",
    tipo: "Trekking",
    ubicacion: "Bahía, Brasil",
    lat: -12.56, lon: -41.39, zona: "America/Bahia",
    descripcion: "Mesetas, cañones y cuevas de cuarzo en el corazón de Bahía. La Cachoeira da Fumaça es una de las caídas de agua más altas de Brasil.",
    destacado: "Cuevas con lagunas de agua cristalina",
    img: null
  },
  {
    id: "pantanal",
    nombre: "Pantanal",
    tipo: "Selva",
    ubicacion: "Mato Grosso, Brasil",
    lat: -16.26, lon: -56.62, zona: "America/Cuiaba",
    descripcion: "El humedal más grande del planeta. Mayor densidad de fauna observable de Sudamérica: jaguares, caimanes, guacamayas.",
    destacado: "Mejor lugar del mundo para ver jaguares salvajes",
    img: null
  },
  {
    id: "foz-do-iguacu",
    nombre: "Foz do Iguaçu",
    tipo: "Río",
    ubicacion: "Paraná, Brasil",
    lat: -25.52, lon: -54.59, zona: "America/Sao_Paulo",
    descripcion: "275 saltos de agua repartidos en casi 3 km de selva subtropical, en la frontera entre Brasil y Argentina.",
    destacado: "Garganta del Diablo, el salto más caudaloso",
    img: null
  },
  {
    id: "canaima-y-salto-angel",
    nombre: "Canaima y Salto Ángel",
    tipo: "Selva",
    ubicacion: "Bolívar, Venezuela",
    lat: 6.24, lon: -62.85, zona: "America/Caracas",
    descripcion: "Vuelo en avioneta sobre la sabana hasta la catarata ininterrumpida más alta del mundo: 979 metros de caída libre.",
    destacado: "16 veces más alta que las Cataratas del Niágara",
    img: null
  },
  {
    id: "los-roques",
    nombre: "Los Roques",
    tipo: "Playa",
    ubicacion: "Dependencias Federales, Venezuela",
    lat: 11.85, lon: -66.75, zona: "America/Caracas",
    descripcion: "Archipiélago de coral con más de 300 cayos deshabitados y agua de un turquesa que no se ve en fotos de verdad.",
    destacado: "Parque nacional marino desde 1972",
    img: null
  },
  {
    id: "monte-roraima",
    nombre: "Monte Roraima",
    tipo: "Montaña",
    ubicacion: "Gran Sabana, Venezuela",
    lat: 5.14, lon: -60.76, zona: "America/Caracas",
    descripcion: "Tepuy de 2.800 millones de años que inspiró \"El Mundo Perdido\" de Conan Doyle. Seis días de trekking hasta un paisaje de otro planeta.",
    destacado: "Formación rocosa más antigua de la Tierra",
    img: null
  }
];

export const paquetes = [
  {
    id: "ciudad-perdida",
    nombre: "Expedición Ciudad Perdida",
    destino: "Ciudad Perdida, Colombia",
    duracion: 5,
    precio: 650,
    categoria: "Aventura",
    descripcion: "Trekking de selva y río hasta las ruinas Tairona. Campamentos, guía local y mulas de carga incluidas."
  },
  {
    id: "costa-salvaje",
    nombre: "Costa Salvaje",
    destino: "Parque Tayrona, Colombia",
    duracion: 3,
    precio: 450,
    categoria: "Familiar",
    descripcion: "Playas vírgenes y senderos cortos de selva. Ideal para primerizos o viajes en familia."
  },
  {
    id: "colores-colombia",
    nombre: "Colores de Colombia",
    destino: "Caño Cristales + Valle de Cocora",
    duracion: 4,
    precio: 650,
    categoria: "Naturaleza",
    descripcion: "El río de los cinco colores y las palmas de cera más altas del mundo, en una sola ruta."
  },
  {
    id: "gigantes-brasil",
    nombre: "Gigantes de Brasil",
    destino: "Foz do Iguaçu + Pantanal",
    duracion: 6,
    precio: 1000,
    categoria: "Premium",
    descripcion: "Las cataratas más caudalosas del planeta y el mejor avistamiento de fauna de Sudamérica."
  },
  {
    id: "chapada-extremo",
    nombre: "Chapada Extremo",
    destino: "Chapada Diamantina, Brasil",
    duracion: 5,
    precio: 1200,
    categoria: "Aventura",
    descripcion: "Trekking técnico entre cañones, cuevas de cuarzo y las cascadas más altas de Bahía."
  },
  {
    id: "venezuela-salvaje",
    nombre: "Venezuela Salvaje",
    destino: "Salto Ángel + Monte Roraima",
    duracion: 7,
    precio: 1100,
    categoria: "Premium",
    descripcion: "La catarata más alta del mundo y el tepuy que inspiró El Mundo Perdido, en una sola expedición."
  },
  {
    id: "los-roques-relax",
    nombre: "Los Roques Relax",
    destino: "Los Roques, Venezuela",
    duracion: 3,
    precio: 550,
    categoria: "Económico",
    descripcion: "Archipiélago de coral, cayos desiertos y snorkel. La escapada de playa más simple del catálogo."
  }
];
