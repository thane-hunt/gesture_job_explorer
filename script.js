let jobs = [];
const shuffleJobs = true; // Set to true to randomize job order each load

const jobGrid = document.getElementById("jobGrid");
const modal = document.getElementById("jobModal");
const modalTitle = document.getElementById("modalTitle");
const modalEmployment = document.getElementById("modalEmployment");
const modalAnalysis = document.getElementById("modalAnalysis");
const modalTags = document.getElementById("modalTags");
const contextFilter = document.getElementById("contextFilter");

// Load Lottie Animation
lottie.loadAnimation({
  container: document.getElementById('lottieContainer'),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: 'Icon+wordmark_White_1920x1080.json'  // Path to your Lottie JSON file
});

// Load and parse CSV
Papa.parse("jobs.csv", {
  download: true,
  header: true,
  complete: function(results) {
    jobs = results.data.map(job => ({
      occupation: job["Occupation/Context"],
      employed: job["Total Employed (US)"],
      analysis: job["Gesture-Relevance Analysis"],
      tags: parseTags(job["Context Tags"])
    })).filter(job => job.occupation);

    populateFilter();
    renderJobs();
  }
});

function parseTags(tagString) {
  try {
    return JSON.parse(tagString.replace(/'/g, '"'));
  } catch (e) {
    return [];
  }
}

function populateFilter() {
  const allTags = new Set(jobs.flatMap(job => job.tags));
  allTags.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    contextFilter.appendChild(option);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderJobs(filterTag = "") {
  jobGrid.innerHTML = "";
  let filtered = filterTag ? jobs.filter(job => job.tags.includes(filterTag)) : [...jobs];
  if (shuffleJobs) shuffleArray(filtered);

  filtered.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `<strong>${job.occupation}</strong><br><small>${job.employed}</small>`;
    card.onclick = () => openModal(job);
    jobGrid.appendChild(card);
  });
}

function filterJobs() {
  renderJobs(contextFilter.value);
}

function openModal(job) {
  modalTitle.textContent = job.occupation;
  modalEmployment.textContent = job.employed;
  modalAnalysis.textContent = job.analysis;
  modalTags.textContent = job.tags.join(", ");
  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => { modal.style.display = "none"; }, 400);
}

window.onclick = function(event) {
  if (event.target === modal) {
    closeModal();
  }
};
