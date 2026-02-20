/* ================= AUTO SESSION ================= */

const currentPage = window.location.pathname;

if(currentPage.includes("login.html")){
    const user = localStorage.getItem("fidelityUser");
    if(user){
        window.location.href="dashboard.html";
    }
}

/* ================= PROFILE CLICK ================= */

const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {
    profileBtn.addEventListener("click", () => {
        window.location.href = "dashboard.html";

    });
}


/* ================= SIGNUP ================= */

const signup = document.getElementById("signupForm");

if (signup) {
    signup.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = signup.querySelector('input[type="email"]').value;
        const password = signup.querySelectorAll('input[type="password"]')[0].value;

        localStorage.setItem("fidelityUser", JSON.stringify({
            email,
            password
        }));

        alert("Account Created ✅");
        window.location.href = "login.html";
    });
}


/* ================= LOGIN ================= */

const login = document.getElementById("loginForm");

if (login) {
    login.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = login.querySelector('input[type="email"]').value;
        const password = login.querySelector('input[type="password"]').value;

        const savedUser = JSON.parse(localStorage.getItem("fidelityUser"));

        if (savedUser &&
            savedUser.email === email &&
            savedUser.password === password) {

            alert("Login Successful ✅");
            window.location.href = "index.html";

        } else {
            alert("Invalid Login ❌");
        }
    });
}
document.getElementById("walletBtn").onclick = () => {
    window.location.href = "wallet.html";
};

document.getElementById("spinWheel").onclick = () => {
    window.location.href = "spin.html";
};
/* ================= REVIEW OVERLAY SYSTEM ================= */

const reviewsBtn = document.getElementById("reviewsBtn");
const overlay = document.getElementById("reviewOverlay");
const closeBtn = document.getElementById("closeReview");

if (reviewsBtn && overlay) {
    reviewsBtn.addEventListener("click", function(e){
        e.preventDefault();
        overlay.classList.add("active");
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", function(){
        overlay.classList.remove("active");
    });
}
const submitBtn = document.getElementById("submitReview");
let selectedRating = 0;



/* ===== STOCK DATA ===== */

const stocks = [
{ name:"Apple", price:"$192 ▲1.2%", dir:"up", info:"Strong ecosystem growth." },
{ name:"Tesla", price:"$244 ▼0.8%", dir:"down", info:"EV competition rising." },
{ name:"Nvidia", price:"$721 ▲3.1%", dir:"up", info:"AI demand booming." },
{ name:"Amazon", price:"$178 ▲0.9%", dir:"up", info:"AWS profits improving." },
{ name:"Meta", price:"$498 ▼1.1%", dir:"down", info:"Ad revenue pressure." },
{ name:"Reliance", price:"₹2845 ▲1.1%", dir:"up", info:"Energy expansion strong." },
{ name:"Infosys", price:"₹1510 ▼0.6%", dir:"down", info:"IT slowdown fears." },
{ name:"Google", price:"$142 ▲0.7%", dir:"up", info:"AI integration growing." },
{ name:"Microsoft", price:"$410 ▲1.9%", dir:"up", info:"Cloud dominance." },
{ name:"Netflix", price:"$612 ▲2.4%", dir:"up", info:"Subscriber growth." }
];

let index = 0;

const nameEl = document.getElementById("stockName");
const priceEl = document.getElementById("stockPrice");
const infoEl = document.getElementById("stockInfo");
const starsEl = document.getElementById("stars");
const msgEl = document.getElementById("msg");

/* Create Stars */
if (starsEl && starsEl.children.length === 0) {
    for(let i=1;i<=5;i++){
        const star=document.createElement("span");
        star.innerHTML="★";
        star.className="star";
        star.dataset.value=i;
        starsEl.appendChild(star);
    }
}

/* Load Stock */
function loadStock(){
    if(!nameEl) return;

    const s = stocks[index];

    nameEl.textContent=s.name;
    priceEl.textContent=s.price;
    priceEl.className="price "+s.dir;
    infoEl.textContent=s.info;

    document.querySelectorAll(".star")
        .forEach(st=>st.classList.remove("active"));

    msgEl.textContent="";
}

loadStock();
</script>
