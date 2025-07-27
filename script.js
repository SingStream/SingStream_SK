// Music Player (search dropdown under bar, shuffle / repeat / random)
// ==============================================================
/** PLAY MODES: next | repeat | random */

// -------------------- 1. AUDIO & PLAYLIST --------------------
const music = new Audio("audio/1.mp3");
const songs = [
  { id:"1",  name:"Naina",                         artist:"Arijit Singh",                           poster:"image/01.jpg" },
  { id:"2",  name:"Naina",                         artist:"Neha Kakkar",                            poster:"image/02.jpg" },
  { id:"3",  name:"Naina Re Tu Hi",                artist:"Himesh Reshammiya",                      poster:"image/03.jpg" },
  { id:"4",  name:"Naina Ki To Baat Naina",        artist:"Prateeksha Srivastava",                  poster:"image/04.jpg" },
  { id:"5",  name:"Kanhi aag lage lag jave",       artist:"Aasha Bhoshle, Shreya Ghosal, Aaditya Narayan",  poster:"image/05.jpeg" },
  { id:"6",  name:"TaaL se Taal Mila",             artist:"Yalka Yagnik, Uditya Narayana",          poster:"image/06.jpeg" },
  { id:"7",  name:"Ramata Yogi",                   artist:"Alka Yagnik and Sukhwinder Singh",       poster:"image/07.jpeg" },
  { id:"8",  name:"Chal Chhaiyan Chhaiyan",        artist:"Sukhvindra, A.R. Rahman",                poster:"image/08.jpg" },
  { id:"9",  name:"Aashiqui 2 Mashup",             artist:"Arijit Singh, Ankit Tiwari",             poster:"image/09.jpeg" },
  { id:"10", name:"Agar Tum Saath Ho",             artist:"Alka Yagnik, Arijit Singh",              poster:"image/10.jpeg" },
  { id:"11", name:"Dil Tham Ke",                   artist:"Unknown",                               poster:"image/11.jpeg" },
  { id:"12", name:"O Saki Saki",                   artist:"Tulsi Kumar, Neha Kakkar",               poster:"image/12.jpeg" },
  { id:"13", name:"Gali Gali",                    artist:"Neha Kakkar",                            poster:"image/13.jpeg" },
  { id:"14", name:"Kabhi Jo Badal Barse",          artist:"Arijit Singh",                           poster:"image/14.jpeg" },
  { id:"15", name:"Tum Hi Aana",                   artist:"Arijit Singh",                           poster:"image/15.jpg" },
  { id:"16", name:"Aashiq Banaya Aapne",           artist:"Himesh Reshammiya, Neha Kakkar",         poster:"image/16.jpeg" },
  { id:"17", name:"Manwa Laage",                   artist:"Shreya Ghoshal, Arijit Singh",           poster:"image/17.jpeg" },
  { id:"18", name:"Humnwa Mere",                   artist:"Arijit Singh",                           poster:"image/18.jpeg" },
  { id:"19", name:"Tera Fitoor",                   artist:"Arijit Singh",                           poster:"image/19.jpeg" },
  { id:"20", name:"Tose Naina",                    artist:"Arijit Singh",                           poster:"image/20.jpg" }
];

// -------------------- 2. DOM --------------------
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const songItems    = $$(".songItem");
const masterPlay   = $("#masterPlay");
const wave         = $("#wave");
const posterMaster = $("#poster_master_play");
const downloadLink = $("#download_music");
const titleEl      = $("#title");
const currentStart = $("#currentStart");
const currentEnd   = $("#currentEnd");
const seek         = $("#seek");
const bar2         = $("#bar2");
const dot          = $(".dot");
const volIcon      = $("#vol_icon");
const volRange     = $("#vol");
const volBar       = $(".vol_bar");
const volDot       = $("#vol_dot");
const backBtn      = $("#back");
const nextBtn      = $("#next");
const shuffleBtn   = $(".shuffle");

// carousel
const popSong      = $(".pop_song");
const popSongLeft  = $("#pop_song_left");
const popSongRight = $("#pop_song_right");
const popArtist    = $(".item");
const popArtLeft   = $("#pop_art_left");
const popArtRight  = $("#pop_art_right");

// search
const searchInput  = $(".search input");
let   resultsBox   = $(".search-results");
if (!resultsBox) {
  resultsBox = document.createElement("div");
  resultsBox.className = "search-results";        // style this in CSS (absolute under .search)
  searchInput.parentNode.appendChild(resultsBox);  // insert right under search bar
}

// -------------------- 3. STATE --------------------
let index = 1;     // 1‑based
let playMode = "next";

// -------------------- 4. PLAYLIST RENDER --------------------
(function renderPlaylist() {
  songItems.forEach((item,i)=>{
    item.querySelector("img").src = songs[i].poster;
    item.querySelector("h5").innerHTML = `${songs[i].name}<br><div class='subtitle'>${songs[i].artist}</div>`;
  });
})();

// Utility ----------------------------------------------------
const fmt = t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,"0")}`;
const resetButtons = ()=>$$(".playListPlay").forEach(b=>b.classList.replace("bi-pause-circle-fill","bi-play-circle-fill"));
const highlightCurrent = ()=>{
  songItems.forEach((it,i)=>{
    it.style.background = i+1===index?"rgba(105,105,105,.1)":"rgba(105,105,105,0)";
    const btn=$$(".playListPlay")[i];
    btn&&btn.classList.toggle("bi-pause-circle-fill",i+1===index);
    btn&&btn.classList.toggle("bi-play-circle-fill", i+1!==index);
  });
};

function loadSong(i){
  const s=songs.find(x=>x.id===String(i));
  if(!s) return;
  music.src=`audio/${i}.mp3`;
  posterMaster.src=s.poster;
  titleEl.innerHTML=`${s.name}<br><div class='subtitle'>${s.artist}</div>`;
  downloadLink.href=music.src;
  downloadLink.download=s.name;
}
function playSong(){music.play();wave.classList.add("active1");masterPlay.classList.replace("bi-play-fill","bi-pause-fill");}
function pauseSong(){music.pause();wave.classList.remove("active1");masterPlay.classList.replace("bi-pause-fill","bi-play-fill");}

// -------------------- 5. POPULAR CAROUSEL ARROWS --------------------
function bindScroll(btn,cont,dir=1,amt=330){btn&&btn.addEventListener("click",()=>cont.scrollBy({left:amt*dir,behavior:"smooth"}));}
bindScroll(popSongRight,popSong,1);bindScroll(popSongLeft,popSong,-1);bindScroll(popArtRight,popArtist,1);bindScroll(popArtLeft,popArtist,-1);

// -------------------- 6. CONTROLS --------------------
masterPlay.addEventListener("click",()=>music.paused||music.currentTime<=0?playSong():pauseSong());

$$('.playListPlay').forEach(btn=>btn.addEventListener('click',e=>{index=Number(e.currentTarget.id)||1;loadSong(index);highlightCurrent();playSong();resultsBox.innerHTML='';}));

nextBtn.addEventListener('click',()=>stepSong(1));
backBtn.addEventListener('click',()=>stepSong(-1));
function stepSong(step){index+=step;if(index<1)index=songs.length;if(index>songs.length)index=1;loadSong(index);highlightCurrent();playSong();}

// shuffle / repeat / random
function togglePlayMode(){const order={next:"repeat",repeat:"random",random:"next"};playMode=order[playMode];shuffleBtn.classList.remove("bi-arrow-repeat","bi-shuffle","bi-music-note-beamed");if(playMode==="repeat")shuffleBtn.classList.add("bi-arrow-repeat");else if(playMode==="random")shuffleBtn.classList.add("bi-shuffle");else shuffleBtn.classList.add("bi-music-note-beamed");shuffleBtn.textContent=playMode;}
shuffleBtn.addEventListener('click',togglePlayMode);
function nextByMode(){if(playMode==='repeat'){}else if(playMode==='random'){index=Math.floor(Math.random()*songs.length)+1;}else{index=index>=songs.length?1:index+1;}loadSong(index);highlightCurrent();playSong();}
music.addEventListener('ended',nextByMode);

// timeline
music.addEventListener('timeupdate',()=>{if(!music.duration)return;currentStart.textContent=fmt(music.currentTime);currentEnd.textContent=fmt(music.duration);const p=(music.currentTime/music.duration)*100;seek.value=p;bar2.style.width=dot.style.left=`${p}%`;});
seek.addEventListener('input',()=>{if(music.duration)music.currentTime=(seek.value/100)*music.duration;});

// volume
volRange.addEventListener('input',()=>{const v=volRange.value;volBar.style.width=volDot.style.left=`${v}%`;music.volume=v/100;volIcon.className=`bi ${v==0?'bi-volume-off-fill':v<=50?'bi-volume-down-fill':'bi-volume-up-fill'}`;});

// -------------------- 7. SEARCH DROPDOWN --------------------
// -------------------- 7. SEARCH DROPDOWN (Improved Normalized Match) --------------------
function normalize(str){
  return str.normalize("NFD")                 // Unicode normalize
            .replace(/[\u0300-\u036f]/g,"")   // strip accents
            .replace(/\s+/g," ")              // collapse whitespace
            .toLowerCase().trim();
}

// searchbar_funtion



// -------------------- SEARCH (alphabet-aware live dropdown + ↑/↓/Enter) --------------------
document.addEventListener("DOMContentLoaded", () => {
  // ⬇️  वही कोड जो अब null दे रहा था, यहाँ लिखें
  const searchInput = document.querySelector(".search input");
  let   resultsBox  = document.querySelector(".search-results");
  if (!resultsBox) {
    resultsBox = document.createElement("div");
    resultsBox.className = "search-results";
    searchInput.parentNode.appendChild(resultsBox);
  }

  // … आपके renderResults, listeners वग़ैरह …
});


let selIndex = -1;  // highlighted result index

// helper to normalise
const norm = str => str.normalize("NFD")
                       .replace(/[\u0300-\u036f]/g,"")
                       .replace(/\s+/g," ")
                       .toLowerCase()
                       .trim();

const clearResults = () => { resultsBox.innerHTML = ""; selIndex = -1; };

function renderResults(q) {
  clearResults();
  const nq = norm(q);
  if (!nq) return;

  // single‑letter alphabet search prioritises “startsWith”
  const alphaOnly = /^[a-z]$/.test(nq);
  const matches = alphaOnly
    ? songs.filter(s => norm(s.name).startsWith(nq))
    : songs.filter(s => norm(s.name + " " + s.artist).includes(nq));

  const frag = document.createDocumentFragment();
  matches.forEach(s => {
    const idx = songs.indexOf(s);   // original index in songs[]
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML =
      `<img src="${s.poster}" style="width:20px;height:20px;object-fit:cover;border-radius:4px;"> ` +
      `<span style="font-size:10px;">${s.name}</span>`;
    div.addEventListener("click", () => selectSong(idx));
    frag.appendChild(div);
  });
  resultsBox.appendChild(frag);
}

function selectSong(arrIdx) {
  index = arrIdx + 1;           // songs[] is 0‑based
  loadSong(index);
  highlightCurrent();
  playSong();
  clearResults();
  searchInput.value = "";
}

// keyboard navigation
function moveSel(dir) {
  const items = [...resultsBox.querySelectorAll(".result-item")];
  if (!items.length) return;
  if (selIndex >= 0) items[selIndex].classList.remove("selected");
  selIndex = (selIndex + dir + items.length) % items.length;
  items[selIndex].classList.add("selected");
  items[selIndex].scrollIntoView({ block: "nearest" });
}

// listeners
searchInput.addEventListener("input", () => renderResults(searchInput.value));
searchInput.addEventListener("keydown", e => {
  const hasItems = resultsBox.querySelectorAll(".result-item").length;
  if (e.key === "ArrowDown" && hasItems) { e.preventDefault(); moveSel(1); }
  else if (e.key === "ArrowUp" && hasItems) { e.preventDefault(); moveSel(-1); }
  else if (e.key === "Enter" && selIndex >= 0) { e.preventDefault();
    resultsBox.querySelectorAll(".result-item")[selIndex].click();
  }
});



// -------------------- 8. INIT --------------------
loadSong(index);highlightCurrent();

