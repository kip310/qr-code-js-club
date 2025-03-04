// history.js
import { supabase } from "./supabaseClient.js";

// Save QR Code to Supabase History (used in index.html)
async function saveQRCodeToHistory(dataUrl, qrData) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    console.log("User not logged in, skipping history save.");
    return false;
  }

  const { error } = await supabase.from("qr_history").insert({
    user_id: userData.user.id,
    qr_data: qrData,
    qr_image: dataUrl,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving QR code to history:", error);
    return false;
  }
  return true;
}

// Load QR Code History from Supabase (used in history.html)
async function loadQRCodeHistory() {
  const historyList = document.querySelector("#history-list");
  if (!historyList) return; // Skip if not on history page

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    historyList.innerHTML = "<p>Please log in to view your QR code history.</p>";
    return;
  }

  const { data, error } = await supabase
    .from("qr_history")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading QR code history:", error);
    historyList.innerHTML = "<p>Error loading history. Please try again later.</p>";
    return;
  }

  historyList.innerHTML = data.length
    ? data
        .map(
          (item) => `
      <div class="history-item">
        <img src="${item.qr_image}" alt="QR Code" />
        <div class="history-item-details">
          <p><strong>Data:</strong> ${item.qr_data}</p>
          <p><strong>Date:</strong> ${new Date(item.created_at).toLocaleString()}</p>
        </div>
        <div class="history-item-actions">
          <button class="download-btn" data-url="${item.qr_image}">Download</button>
        </div>
      </div>
    `
        )
        .join("")
    : "<p>No QR codes in your history yet.</p>";

  // Attach download event listeners
  document.querySelectorAll(".download-btn").forEach((btn) => {
    btn.addEventListener("click", () => downloadQR(btn.getAttribute("data-url")));
  });
}

// Download QR Code from History
function downloadQR(dataUrl) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "qr-code.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Menu Toggle for History Page
function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("is-show");
    toggle.classList.toggle("fa-times");
    toggle.classList.toggle("fa-bars");
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !event.target.matches(".menu-toggle")) {
      menu.classList.remove("is-show");
      toggle.classList.remove("fa-times");
      toggle.classList.add("fa-bars");
    }
  });
}

// Initialize History Page
document.addEventListener("DOMContentLoaded", () => {
  loadQRCodeHistory(); // Load history on page load
  setupMenu(); // Set up menu toggle
});

// Export for use in hehe.js
export { saveQRCodeToHistory };