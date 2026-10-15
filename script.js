// Approximate data for demonstration. Real site should pull live or verified sources.
const countries = [
  { name: "Singapore", system: "Capitalist (high freedom)", econ: 84.4, pol: 48, gdpRel: 95, life: 84, score: 0 },
  { name: "Switzerland", system: "Capitalist", econ: 83.7, pol: 96, gdpRel: 90, life: 84, score: 0 },
  { name: "United States", system: "Capitalist (mixed)", econ: 72.8, pol: 83, gdpRel: 100, life: 78, score: 0 },
  { name: "South Korea", system: "Capitalist", econ: 73.7, pol: 83, gdpRel: 70, life: 84, score: 0 },
  { name: "Taiwan", system: "Capitalist", econ: 79.8, pol: 94, gdpRel: 75, life: 81, score: 0 },
  { name: "Denmark", system: "Capitalist + welfare", econ: 79.0, pol: 97, gdpRel: 85, life: 81, score: 0 },
  { name: "China", system: "Hybrid (post-reform)", econ: 48.3, pol: 9, gdpRel: 25, life: 78, score: 0 },
  { name: "Cuba", system: "Socialist (ML)", econ: 25.2, pol: 10, gdpRel: 15, life: 78, score: 0 },
  { name: "Venezuela", system: "Socialist", econ: 27.3, pol: 15, gdpRel: 10, life: 72, score: 0 },
  { name: "North Korea", system: "Socialist (ML)", econ: 3.1, pol: 3, gdpRel: 5, life: 73, score: 0 },
  { name: "Russia (post-Soviet)", system: "Mixed/authoritarian", econ: 50.3, pol: 16, gdpRel: 40, life: 73, score: 0 }
];

// Compute composite scores (normalized roughly)
countries.forEach(c => {
  const econNorm = c.econ / 100 * 35;
  const polNorm = c.pol / 100 * 25;
  const gdpNorm = Math.min(c.gdpRel, 100) / 100 * 20;
  const lifeNorm = (c.life - 50) / 40 * 20; // rough scale
  c.score = Math.round((econNorm + polNorm + gdpNorm + lifeNorm) * 10) / 10;
});
countries.sort((a, b) => b.score - a.score);

// Populate ranking table
const tbody = document.querySelector("#rankingTable tbody");
countries.forEach(c => {
  const row = tbody.insertRow();
  row.insertCell().textContent = c.name;
  row.insertCell().textContent = c.system;
  row.insertCell().textContent = c.econ;
  row.insertCell().textContent = c.pol;
  row.insertCell().textContent = c.score;
});

// Ranking chart
const rankingCtx = document.getElementById("rankingChart").getContext("2d");
new Chart(rankingCtx, {
  type: "bar",
  data: {
    labels: countries.map(c => c.name),
    datasets: [{
      label: "Composite Score",
      data: countries.map(c => c.score),
      backgroundColor: countries.map(c => c.score > 70 ? "#2a9d8f" : c.score > 40 ? "#e9c46a" : "#e76f51")
    }]
  },
  options: { responsive: true, plugins: { title: { display: true, text: "Composite Outcome Score (higher better)" } } }
});

// Comparison select
const select = document.getElementById("countrySelect");
countries.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c.name;
  opt.textContent = c.name + " (" + c.system + ")";
  select.appendChild(opt);
});

document.getElementById("compareBtn").addEventListener("click", () => {
  const selected = Array.from(select.selectedOptions).map(o => o.value);
  const data = countries.filter(c => selected.includes(c.name));
  if (data.length < 2) { alert("Select at least 2"); return; }
  const ctx = document.getElementById("compareChart").getContext("2d");
  if (window.compareChart) window.compareChart.destroy();
  window.compareChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Econ Free", "Pol Free", "GDP Rel", "Life Exp"],
      datasets: data.map((c, i) => ({
        label: c.name,
        data: [c.econ, c.pol, c.gdpRel, c.life],
        borderColor: ["#e63946", "#457b9d", "#2a9d8f", "#f4a261"][i % 4],
        backgroundColor: "rgba(0,0,0,0.1)"
      }))
    },
    options: { responsive: true, scales: { r: { min: 0, max: 100 } } }
  });
  document.getElementById("compareDetails").innerHTML = data.map(c => 
    `<p><strong>${c.name}</strong>: Score ${c.score}, Econ ${c.econ}, Pol ${c.pol}, Life ${c.life}</p>`
  ).join("");
});

console.log("Site data loaded. Scores computed from public indices.");