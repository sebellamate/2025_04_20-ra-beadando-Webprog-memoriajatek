const tableBody = document.querySelector("#statTable tbody");
const filterEmail = document.getElementById("filterEmail");
const filterLevel = document.getElementById("filterLevel");

function loadStats() {
  const stats = JSON.parse(localStorage.getItem("memoryStats") || "[]");
  const filtered = stats.filter(stat => {
    return (!filterEmail.value || stat.email.includes(filterEmail.value)) &&
           (!filterLevel.value || stat.difficulty === filterLevel.value);
  });

  tableBody.innerHTML = "";
  filtered.forEach(stat => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stat.email}</td>
      <td>${stat.age}</td>
      <td>${stat.difficulty}</td>
      <td>${stat.time}</td>
      <td>${stat.errors}</td>
      <td>${stat.date}</td>
    `;
    tableBody.appendChild(row);
  });
}

filterEmail.addEventListener("input", loadStats);
filterLevel.addEventListener("change", () => {
  loadStats();
  fetchToplist(filterLevel.value);
});

function fetchToplist(level) {
  if (!level) return;
  fetch(`https://sajat-szerver.hu/api/toplist?level=${level}`)
    .then(res => res.json())
    .then(data => {
      console.log("Toplista:", data);
      // Megjelenítés opcionálisan kiegészíthető
    });
}

window.onload = loadStats;
