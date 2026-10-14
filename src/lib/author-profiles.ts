/** Biographical context for the current catalogue. Keep birthplaces distinct from nationality. */
export type AuthorProfile = {
  country: string;
  birthplace: string;
  context?: string;
  sourceUrl: string;
};

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  "Jon Krakauer": { country: "Estados Unidos", birthplace: "Brookline, Massachusetts", sourceUrl: "https://en.wikipedia.org/wiki/Jon_Krakauer" },
  "James Clavell": { country: "Australia", birthplace: "Sídney", context: "Escritor británico-estadounidense.", sourceUrl: "https://en.wikipedia.org/wiki/James_Clavell" },
  "Isabel Allende": { country: "Perú", birthplace: "Lima", context: "Escritora chilena nacida en Perú.", sourceUrl: "https://www.isabelallende.com/en/timeline" },
  "Brandon Sanderson": { country: "Estados Unidos", birthplace: "Lincoln, Nebraska", sourceUrl: "https://www.brandonsanderson.com/pages/about-brandon" },
  "Susanna Clarke": { country: "Reino Unido", birthplace: "Nottingham, Inglaterra", sourceUrl: "https://en.wikipedia.org/wiki/Susanna_Clarke" },
  "Angélica Gorodischer": { country: "Argentina", birthplace: "Buenos Aires", sourceUrl: "https://es.wikipedia.org/wiki/Ang%C3%A9lica_Gorodischer" },
  "Alice Kellen": { country: "España", birthplace: "Valencia", sourceUrl: "https://es.wikipedia.org/wiki/Alice_Kellen" },
  "Alessandro Baricco": { country: "Italia", birthplace: "Turín", sourceUrl: "https://www.treccani.it/enciclopedia/alessandro-baricco/" },
  "Stefan Zweig": { country: "Austria", birthplace: "Viena", context: "Nació en el Imperio austrohúngaro.", sourceUrl: "https://www.dhm.de/lemo/biografie/stefan-zweig" },
  "Alex Michaelides": { country: "Chipre", birthplace: "Chipre", context: "Creció en Nicosia.", sourceUrl: "https://www.alexmichaelides.com/about" },
  "María Oruña": { country: "España", birthplace: "Vigo", sourceUrl: "https://www.ub.edu/munce/content/mar%C3%ADa-oru%C3%B1a" },
  "Patricia Highsmith": { country: "Estados Unidos", birthplace: "Fort Worth, Texas", sourceUrl: "https://es.wikipedia.org/wiki/Patricia_Highsmith" },
  "Irene Vallejo": { country: "España", birthplace: "Zaragoza", sourceUrl: "https://es.wikipedia.org/wiki/Irene_Vallejo" },
  "Nuccio Ordine": { country: "Italia", birthplace: "Diamante, Calabria", sourceUrl: "https://www.premisliberpress.cat/es/nuccio-ordine/" },
  "Alberto Manguel": { country: "Argentina", birthplace: "Buenos Aires", sourceUrl: "https://es.wikipedia.org/wiki/Alberto_Manguel" },
  "Cixin Liu": { country: "China", birthplace: "Yangquan, Shanxi", sourceUrl: "https://es.wikipedia.org/wiki/Liu_Cixin" },
  "Andy Weir": { country: "Estados Unidos", birthplace: "Davis, California", sourceUrl: "https://es.wikipedia.org/wiki/Andy_Weir" },
  "Clifford D. Simak": { country: "Estados Unidos", birthplace: "Millville, Wisconsin", sourceUrl: "https://es.wikipedia.org/wiki/Clifford_D._Simak" },
  "David Uclés": { country: "España", birthplace: "Úbeda, Jaén", sourceUrl: "https://www.daviducles.com/biografia" },
  "Maggie O’Farrell": { country: "Reino Unido", birthplace: "Coleraine, Irlanda del Norte", sourceUrl: "https://en.wikipedia.org/wiki/Maggie_O%27Farrell" },
  "Shūsaku Endō": { country: "Japón", birthplace: "Tokio", sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2563703/" },
  "Mariana Enríquez": { country: "Argentina", birthplace: "Buenos Aires", sourceUrl: "https://es.wikipedia.org/wiki/Mariana_Enriquez" },
  "Agustina Bazterrica": { country: "Argentina", birthplace: "Buenos Aires", sourceUrl: "https://www.infobae.com/cultura/2018/03/03/agustina-bazterrica-el-vegetariano-y-el-vegano-molestan-porque-incomodan-al-otro/" },
  "Algernon Blackwood": { country: "Reino Unido", birthplace: "Shooter’s Hill, Inglaterra", sourceUrl: "https://sf-encyclopedia.com/entry/blackwood_algernon" },
  "Bertrand Russell": { country: "Reino Unido", birthplace: "Trellech, Gales", sourceUrl: "https://www.nobelprize.org/prizes/literature/1950/russell/facts/" },
  "Hermann Hesse": { country: "Alemania", birthplace: "Calw", sourceUrl: "https://www.hermann-hesse.de/leben-und-werk/biografie/lebensstationen/" },
  "Albert Camus": { country: "Argelia", birthplace: "Mondovi, hoy Dréan", context: "Entonces, Argelia francesa.", sourceUrl: "https://www.nobelprize.org/prizes/literature/1957/camus/biographical/" },
};
