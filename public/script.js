let medicines = [];

async function loadMedicines() {
  const res = await fetch('/medicines');
  medicines = await res.json();
  renderMedicines(medicines);
}

function renderMedicines(list) {
  const ul = document.getElementById("medicineList");
  if (!ul) return;
  ul.innerHTML = "";
  list.forEach(med => {
    const li = document.createElement("li");
    li.textContent = med;
    ul.appendChild(li);
  });
}

document.getElementById("search")?.addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  const filtered = medicines.filter(m => m.toLowerCase().includes(val));
  renderMedicines(filtered);
});

loadMedicines(); 

document.getElementById("regForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value
  };

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
  form.reset();
});

