// history.js
import { supabase } from "./supabaseClient.js";

console.log("history.js loaded");

// Save QR Code to Supabase History (unchanged, assumed working)
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
        number_of_scanning: 0
    });

    if (error) {
        console.error("Error saving QR code to history:", error);
        return false;
    }
    console.log("QR code saved successfully");
    return true;
}

// Load QR Code History from Supabase
async function loadQRCodeHistory() {
    console.log("loadQRCodeHistory called");
    const historyTableBody = document.querySelector("#history-table-body");
    const historyList = document.querySelector("#history-list");
    if (!historyTableBody) {
        console.error("History table body not found in DOM");
        return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        console.log("No user logged in");
        historyList.innerHTML = "<p>Please log in to view your QR code history.</p>";
        return;
    }
    console.log("Logged-in user ID:", userData.user.id);

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
    console.log("Fetched history data:", data);

    if (data.length === 0) {
        console.log("No history data found for user");
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    historyTableBody.innerHTML = data.map((item, index) => {
        console.log("Rendering item:", item);
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.user_id}</td>
                <td>${new Date(item.created_at).toLocaleString()}</td>
                <td><a href="${item.qr_data}" target="_blank">${item.qr_data}</a></td>
                <td><img src="${item.qr_image}" alt="QR Code" class="qr-image"></td>
                <td>${item.number_of_scanning}</td>
            </tr>
        `;
    }).join("");
}

// Initialize History Page
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling loadQRCodeHistory");
    loadQRCodeHistory();
});