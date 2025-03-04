// Updated history.js
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

// Load QR Code History from Supabase
async function loadQRCodeHistory() {
    const historyTableBody = document.querySelector("#history-table-body");
    const historyList = document.querySelector("#history-list");
    if (!historyTableBody) return;

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

    if (data.length === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='5'>No QR codes in your history yet.</td></tr>";
        return;
    }

    historyTableBody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${new Date(item.created_at).toLocaleString()}</td>
            <td><a href="${item.qr_data}" target="_blank">${item.qr_data}</a></td>
            <td><img src="${item.qr_image}" alt="QR Code" class="qr-image"></td>
            <td><button class="download-btn" data-url="${item.qr_image}">Download</button></td>
        </tr>
    `).join("");

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
    loadQRCodeHistory();
    setupMenu();
});

export { saveQRCodeToHistory };