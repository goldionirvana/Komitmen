async function check() {
  const res = await fetch('https://freepd.com/music/Romantic/Love%20Theme.mp3');
  console.log('freepd.com: ', res.status);
  
  const res2 = await fetch('https://upload.wikimedia.org/wikipedia/commons/3/36/Moonlight_Sonata_Op._27_No._2_Mvt._1.ogg');
  console.log('wikimedia moonlight: ', res2.status);
}
check();
