async function scrape() {
  const res = await fetch("https://en.wikipedia.org/wiki/Clair_de_lune_(Debussy)");
  const html = await res.text();
  const matches = html.match(/\/\/upload[^"]+\.(ogg|mp3)/g);
  console.log(matches ? [...new Set(matches)] : "no matches");
}
scrape();
