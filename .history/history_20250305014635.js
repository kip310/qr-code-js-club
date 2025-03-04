// Updated history.js
import { supabase } from "./supabaseClient.js";

console.log("work");

document.querySelectorAll(".download-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const dataUrl = btn.getAttribute("data-url");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `qr-code-${Date.now()}.png`;
        link.click();
    });
});

// Save QR Code to Supabase History
export async function saveQRCodeToHistory(dataUrl, qrData) {
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
        number_of_scanning: 0 // Initialize to 0
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
            <td>${item.number_of_scanning}</td> <!-- Display number_of_scanning -->
        </tr>
    `).join("");
}

// Initialize History Page
document.addEventListener("DOMContentLoaded", () => {
    loadQRCodeHistory();
});
