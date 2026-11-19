import axios from "axios";
const api = axios.create({
    baseURL: "https://dummyjson.com",
    timeout: 5000
});
const tousCartes = document.getElementById("recipesGrid");
const filtre = document.getElementById("quickFilters")
let recette = []

function creerCarte(image, cat, name, dif, temps) {
  const divCartes = document.createElement("div");

  divCartes.className =
    "bg-[var(--color-anthracite)] border border-[var(--color-subtleBorder)] hover:border-[var(--color-amberGold)]/60  rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 animate-fade-in";

  const imageContainer = document.createElement("div");
  imageContainer.className = "relative h-48 overflow-hidden bg-[#18181B]";

  const img = document.createElement("img");
  img.src = image;
  img.alt = "image de la recette";
  img.className =
    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300";
  img.loading = "lazy"
  const category = document.createElement("span");
  category.className =
    "absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#18181B]/85 backdrop-blur-md text-zinc-100 border border-[#3F3F46]";
  category.textContent = cat;

  imageContainer.append(img, category);

  const content = document.createElement("div");
  content.className = "p-5 flex-1 flex flex-col justify-between";

  const info = document.createElement("div");

  const title = document.createElement("h3");
  title.className =
    "font-display text-base font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-[#F59E0B] transition-colors";
  title.textContent = name;

  const details = document.createElement("div");
  details.className = "flex flex-wrap items-center gap-2 mb-4";

  const difficulty = document.createElement("span");
  difficulty.className = `px-2.5 py-0.5 rounded-md text-xs font-medium border `;
  difficulty.textContent = dif;

  const time = document.createElement("span");
  time.className =
    "text-xs font-medium text-zinc-300 bg-[#18181B] px-2.5 py-0.5 rounded-md border border-[#3F3F46]";
  time.textContent = `◷ ${temps} min`;

  details.append(difficulty, time);
  info.append(title, details);

  const footerCarte = document.createElement("div");
  footerCarte.className =
    "pt-3 border-t border-[#3F3F46]/70 flex items-center justify-between";

  const clubName = document.createElement("span");
  clubName.className = "text-[11px] text-zinc-500 font-medium";
  clubName.textContent = "Club Lhadga";

  const deleteButton = document.createElement("button");
  deleteButton.className =
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors";
  deleteButton.textContent = "Supprimer";
  deleteButton.title = "Supprimer cette recette";

  footerCarte.append(clubName, deleteButton);

  content.append(info, footerCarte);
  divCartes.append(imageContainer, content);

  return divCartes;
}
function buttonFiltre(pay){
  const button = document.createElement('button')
  button.className = "filter-chip px-3 py-1.5 rounded-lg text-xs font-medium bg-[#27272A] text-zinc-300 border border-[#3F3F46] hover:border-zinc-500 transition-colors"

button.onclick = () =>  filterByTag(`${pay}`)
button.dataset.tag = pay
button.textContent = pay
 filtre.append(button)  

}

function chargement() {
  document.getElementById("recipeCounter").classList.add("hidden");
  tousCartes.classList.remove("hidden");
}

function filterByTag(pay){
    tousCartes.textContent = "";

  if(pay === ""){
      recette.forEach((e) => {
      const image = e.image;
      const cat = e.cuisine;
      const name = e.name;
      const dif = e.difficulty;
      const temps = e.cookTimeMinutes;

      const carte = creerCarte(image, cat, name, dif, temps);

        tousCartes.append(carte);
    });
  }else{
    const recetteFiltre = recette.filter(e => e.cuisine === pay)
recetteFiltre.forEach(payChoi =>{
   const image = payChoi.image;
      const cat = payChoi.cuisine;
      const name = payChoi.name;
      const dif = payChoi.difficulty;
      const temps = payChoi.cookTimeMinutes;

      const carte = creerCarte(image, cat, name, dif, temps);

        tousCartes.append(carte);

})
  }

}

async function afficherRecette() {



  try {
   setTimeout(() => {
   chargement()
},1000)
  
  

    const data = await api.get("/recipes?limit=15");
   recette = data.data.recipes;
  console.log(recette)
const pays = [...new Set(recette.map(e => e.cuisine))]
pays.forEach(pay => {
  return  buttonFiltre(pay)
})

const buttons = document.querySelectorAll("[data-tag]")

  
  
buttons.forEach(button => {





  
  button.onclick = () => {
    const pay = button.dataset.tag
  buttons.forEach(btn => {
    btn.classList.remove( "text-[#18181B]", "bg-[#F59E0B]")
    btn.classList.add("text-zinc-300" , "bg-[#27272A]")
  })
    button.classList.remove("text-zinc-300" , "bg-[#27272A]")
    button.classList.add("text-[#18181B]", "bg-[#F59E0B]")

    filterByTag(pay)
  }
})
const btnTous = document.getElementById('btn-tous')
  btnTous.onclick = () => {
  

  buttons.forEach(btn => {
    btn.classList.remove("text-[#18181B]", "bg-[#F59E0B]");
    btn.classList.add("text-zinc-300", "bg-[#27272A]");
  });

  btnTous.classList.remove("bg-[#27272A]", "text-zinc-300");
  btnTous.classList.add("bg-[#F59E0B]", "text-[#18181B]");
  filterByTag("");
};
  filterByTag("");


  const btnAjoutData = document.getElementById('submitRecipeBtn')
  btnAjoutData.addEventListener("click" , async () =>{

 try {
        const nouvelleRecette = {
            name: document.getElementById("recipeName").value,
            cuisine: document.getElementById("recipeCuisine").value,
            difficulty: document.getElementById("recipeDifficulty").value,
            cookTimeMinutes: Number(document.getElementById("recipeTime").value),
            image: document.getElementById("recipeImage").value
        };

        const response = await axios.post(
            "https://dummyjson.com/recipes/add",
            nouvelleRecette
        );

        document.getElementById('addRecipeModal').classList.add('hidden')
        
        const carte = creerCarte(
    response.data.image,
    response.data.cuisine,
    response.data.name,
    response.data.difficulty,
    response.data.cookTimeMinutes
);

tousCartes.prepend(carte);
      
    } catch (error) {
        console.log(error);
    }

  })
    
  } catch (error) {

document.getElementById('errorState').classList.remove('hidden')
document.getElementById('errorTitle').textContent = "error de serveur"
document.getElementById('errorDescription').textContent = "il yas un probleme de recuperation de donner ressayer"
  }
}
afficherRecette();
 document.getElementById('btn-ajouter-recette').addEventListener("click" , () =>{

  document.getElementById('addRecipeModal').classList.remove('hidden')
 })