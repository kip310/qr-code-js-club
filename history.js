// history.js
import { supabase } from "./supabaseClient.js";

console.log("history.js loaded");

// Save QR Code to Supabase History (unchanged, assumed working)
export async function saveQRCodeToHistory(dataUrl, originalURL, trackEnabled) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        console.log("User not logged in, skipping history save.");
        return false;
    }

    // If tracking is enabled, generate tracking URL; otherwise, use the original
    const qrData = trackEnabled 
    //`https://qr-code-js-club.vercel.app/redirect.html?qr_data=${encodeURIComponent(userInputURL)}`;
        ? `https://qr-code-js-club.vercel.app/redirect.html?qr_data=${encodeURIComponent(originalURL)}`
        : originalURL;

    // Save to Supabase
    const { error } = await supabase.from("qr_history").insert({
        user_id: userData.user.id,
        qr_data: qrData,  // Save either tracking URL or original URL
        original_url: originalURL,
        qr_image: dataUrl,
        created_at: new Date().toISOString(),
        number_of_scanning: 0
    });

    if (error) {
        console.error("Error saving QR code to history:", error);
        return false;
    }

    console.log(`QR code saved successfully (${trackEnabled ? "with tracking" : "without tracking"})`);
    return true;
}
let currentPage = 1;
const recordsPerPage = 5;
let totalPages = 1;
let historyData = [];

async function loadQRCodeHistory() {
    console.log("Loading QR Code history...");
    const historyTableBody = document.querySelector("#history-table-body");
    if (!historyTableBody) return console.error("History table body not found in DOM");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>Please log in to view your QR code history.</td></tr>";
        return;
    }

    const { data, error } = await supabase
        .from("qr_history")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>Error loading history. Please try again later.</td></tr>";
        return;
    }

    if (data.length === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    historyData = data;
    totalPages = Math.ceil(historyData.length / recordsPerPage);
    currentPage = 1;
    renderTable();
}

function renderTable() {
    const historyTableBody = document.querySelector("#history-table-body");
    historyTableBody.classList.add("fade-out");

    setTimeout(() => {
        historyTableBody.innerHTML = "";

        const start = (currentPage - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const paginatedData = historyData.slice(start, end);

        if (paginatedData.length === 0) {
            historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        } else {
            historyTableBody.innerHTML = paginatedData.map(renderHistoryRow).join("");
        }

        attachEventListeners();
        renderPaginationControls();

        historyTableBody.classList.remove("fade-out");
        historyTableBody.classList.add("fade-in");
    }, 300);
}

function renderHistoryRow(item, index) {
    const displayedQRData = (item.qr_data === item.original_url)
        ? `<span style="color: gray;">No Tracking</span>`
        : `<a href="${item.qr_data}" target="_blank">${item.qr_data}</a>`;

    const displayedScans = (item.qr_data === item.original_url)
        ? `<span style="color: gray;">No Tracking</span>`
        : item.number_of_scanning;

    return `
        <tr data-id="${item.id}">
            <td>${index + 1 + (currentPage - 1) * recordsPerPage}</td>
            <td>${new Date(item.created_at).toLocaleString()}</td>
            <td><a href="${item.original_url}" target="_blank">${item.original_url}</a></td>
            <td><img src="${item.qr_image}" alt="QR Code" class="qr-image" width="50"></td>
            <td>${displayedScans}</td>
            <td>
                <button class="download-btn" data-url="${item.qr_image}">Download</button>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        </tr>
    `;
}

function renderPaginationControls() {
    const paginationContainer = document.querySelector("#pagination-container");
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    // Hiển thị số trang
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    pageInfo.className = "page-info";
    paginationContainer.appendChild(pageInfo);

    // First & Previous Button (Ẩn nếu ở trang đầu)
    if (currentPage > 1) {
        const firstButton = document.createElement("button");
        firstButton.textContent = "« First";
        firstButton.className = "pagination-btn";
        firstButton.addEventListener("click", () => changePage(1));
        paginationContainer.appendChild(firstButton);

        const prevButton = document.createElement("button");
        prevButton.textContent = "‹ Previous";
        prevButton.className = "pagination-btn";
        prevButton.addEventListener("click", () => changePage(currentPage - 1));
        paginationContainer.appendChild(prevButton);
    }

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `pagination-btn ${i === currentPage ? "active" : ""}`;
        btn.addEventListener("click", () => changePage(i));
        paginationContainer.appendChild(btn);
    }

    // Next & Last Button (Ẩn nếu ở trang cuối)
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next ›";
        nextButton.className = "pagination-btn";
        nextButton.addEventListener("click", () => changePage(currentPage + 1));
        paginationContainer.appendChild(nextButton);

        const lastButton = document.createElement("button");
        lastButton.textContent = "Last »";
        lastButton.className = "pagination-btn";
        lastButton.addEventListener("click", () => changePage(totalPages));
        paginationContainer.appendChild(lastButton);
    }
}


// Change page function
function changePage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}

function attachEventListeners() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async (e) => {
            const qrId = e.target.getAttribute("data-id");
            await deleteQRCode(qrId);
        };
    });

    document.querySelectorAll(".download-btn").forEach(btn => {
        btn.onclick = (e) => {
            const imageUrl = e.target.getAttribute("data-url");
            downloadQRCode(imageUrl);
        };
    });
}

async function deleteQRCode(qrId) {
    if (!confirm("Are you sure you want to delete this QR Code?")) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        alert("You need to log in to perform this action!");
        return;
    }

    const { error } = await supabase
        .from("qr_history")
        .delete()
        .match({ id: qrId, user_id: userData.user.id });

    if (error) {
        alert("Failed to delete QR Code! Please try again.");
        return;
    }

    alert("QR Code deleted successfully!");
    historyData = historyData.filter(item => item.id !== qrId);
    totalPages = Math.ceil(historyData.length / recordsPerPage);

    if (currentPage > totalPages) currentPage = totalPages;
    renderTable();
}

function downloadQRCode(imageUrl) {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "qr_code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling loadQRCodeHistory");
    loadQRCodeHistory();
});

async function deleteAllQRCodes() {
    if (!confirm("Are you sure you want to delete ALL QR Codes? This action cannot be undone!")) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        alert("You need to log in to perform this action!");
        return;
    }

    const { error } = await supabase
        .from("qr_history")
        .delete()
        .match({ user_id: userData.user.id });

    if (error) {
        alert("Failed to delete all QR Codes! Please try again.");
        return;
    }

    alert("All QR Codes have been deleted successfully!");
    location.reload(); // Reload the page
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling loadQRCodeHistory");
    loadQRCodeHistory();

    // Attach event listener to "Delete All" button
    const deleteAllBtn = document.getElementById("delete-all-btn");
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener("click", deleteAllQRCodes);
    }
});
