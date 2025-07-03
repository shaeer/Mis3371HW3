
// List of U.S. states with DC and PR
const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC", "PR"
];

function populateStateDropdown() {
  const dropdown = document.getElementById("state");
  states.forEach(code => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;
    dropdown.appendChild(option);
  });
}

window.addEventListener("DOMContentLoaded", populateStateDropdown);
