// history.js
import { supabase } from "./supabaseClient.js";

console.log("history.js loaded");

// Save QR Code to Supabase History (unchanged, assumed working)
let currentPage = 1;
const recordsPerPage = 5; // Number of records per page
let totalPages = 1;
let totalRecords = 0; // To store the total number of records

async function loadQRCodeHistory() {
    console.log("Loading QR Code history...");
    const historyTableBody = document.querySelector("#history-table-body");
    if (!historyTableBody) return console.error("History table body not found");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>Please log in to view your QR code history.</td></tr>";
        return;
    }

    // Fetch the total number of records to calculate total pages
    const { count, error: countError } = await supabase
        .from("qr_history")
        .select("*", { count: "exact", head: true }) // Only fetch the count, not the data
        .eq("user_id", userData.user.id);

    if (countError) {
        console.error("Error fetching total record count:", countError);
        historyTableBody.innerHTML = "<tr><td colspan='6'>Error loading history. Please try again later.</td></tr>";
        return;
    }

    totalRecords = count; // Store the total number of records
    totalPages = Math.ceil(totalRecords / recordsPerPage); // Calculate total pages

    if (totalRecords === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    // Calculate startIndex and stopIndex for the current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const stopIndex = startIndex + recordsPerPage - 1;

    // Fetch only the records for the current page
    const { data, error } = await supabase
        .from("qr_history")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .range(startIndex, stopIndex); // Fetch only the required range of records

    if (error) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>Error loading history. Please try again later.</td></tr>";
        return;
    }

    // Render the table with the fetched data
    renderTable(data);
}

function renderTable(paginatedData) {
    const historyTableBody = document.querySelector("#history-table-body");
    historyTableBody.innerHTML = "";

    if (paginatedData.length === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    // Calculate the starting index for display purposes (for row numbering)
    const startIndex = (currentPage - 1) * recordsPerPage;
    historyTableBody.innerHTML = paginatedData
        .map((item, index) => renderHistoryRow(item, startIndex + index))
        .join("");

    attachEventListeners(); // Re-attach event listeners
    renderPaginationControls(); // Render pagination controls
}

function renderHistoryRow(item, index) {
    // Check if QR has tracking (based on qr_image containing "redirect.html")
    const isTrackingEnabled = item.qr_image && item.qr_image.includes("redirect.html");

    const displayedQRData = isTrackingEnabled
        ? `<a href="${item.qr_image}" target="_blank">${item.qr_image}</a>`
        : `<span style="color: gray;">No Tracking</span>`;

    // If number_of_scanning < 0, it means no tracking
    const displayedScans = item.number_of_scanning < 0 
        ? `<span style="color: gray;">No Tracking</span>` 
        : item.number_of_scanning ?? 0;

    return `
        <tr data-id="${item.id}">
            <td>${index + 1}</td>
            <td>${new Date(item.created_at).toLocaleString()}</td>
            <td><a href="${item.original_url}" target="_blank">${item.original_url}</a></td>
            <td><img src="${item.qr_image}" alt="QR Code" class="qr-image" width="50"></td>
            <td>${displayedScans}</td>
            <td class="actions">
                <div class="button-group">
                    <button class="download-btn" data-url="${item.qr_image}">Download</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </div>
            </td>
        </tr>
    `;
}

function attachEventListeners() {
    document.querySelectorAll(".delete-btn").forEach(btn =>
        btn.addEventListener("click", async (e) => {
            const qrId = e.target.dataset.id;
            await deleteQRCode(qrId);
        })
    );

    document.querySelectorAll(".download-btn").forEach(btn =>
        btn.addEventListener("click", (e) => {
            const imageUrl = e.target.dataset.url;
            downloadQRCode(imageUrl);
        })
    );
}

async function deleteQRCode(qrId) {
    if (!confirm("Are you sure you want to delete this QR Code?")) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        alert("You need to be logged in to perform this action!");
        return;
    }

    const { error } = await supabase
        .from("qr_history")
        .delete()
        .match({ id: qrId, user_id: userData.user.id });

    if (error) {
        console.error("Error deleting QR Code:", error);
        alert("Failed to delete QR Code! Please try again.");
        return;
    }

    alert("QR Code deleted successfully!");
    loadQRCodeHistory(); // Reload the data after deletion
}

function downloadQRCode(imageUrl) {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function deleteAllQRCode() {
    if (!confirm("Are you sure you want to delete all QR Codes? This action cannot be undone!")) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        alert("You need to be logged in to perform this action!");
        return;
    }

    // Delete all records for the current user
    const { error } = await supabase
        .from("qr_history")
        .delete()
        .eq("user_id", userData.user.id);

    if (error) {
        console.error("Error deleting all QR Codes:", error);
        alert("Failed to delete all QR Codes! Please try again.");
        return;
    }

    alert("All QR Codes deleted successfully!");
    loadQRCodeHistory(); // Reload the data after deletion
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling loadQRCodeHistory");
    loadQRCodeHistory();
});

document.getElementById("delete-all-btn").addEventListener("click", deleteAllQRCode);

function renderPaginationControls() {
    const paginationContainer = document.querySelector("#pagination-container");
    paginationContainer.innerHTML = ""; // Clear previous pagination buttons

    if (totalPages <= 1) return; // No need for pagination if only one page

    // Create "Page X of Y" indicator
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    pageInfo.className = "pagination-info";
    paginationContainer.appendChild(pageInfo);

    // Create "Previous" button
    if (currentPage > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Previous";
        prevBtn.className = "pagination-btn";
        prevBtn.addEventListener("click", () => {
            currentPage--;
            updatePage();
        });
        paginationContainer.appendChild(prevBtn);
    }

    // Create number buttons (show max 5 pages)
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "pagination-btn";
        if (i === currentPage) btn.classList.add("active");

        btn.addEventListener("click", () => {
            currentPage = i;
            updatePage();
        });

        paginationContainer.appendChild(btn);
    }

    // Create "Next" button
    if (currentPage < totalPages) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.className = "pagination-btn";
        nextBtn.addEventListener("click", () => {
            currentPage++;
            updatePage();
        });
        paginationContainer.appendChild(nextBtn);
    }

    // Create "Last Page" button
    if (currentPage < totalPages) {
        const lastPageBtn = document.createElement("button");
        lastPageBtn.textContent = "Last Page";
        lastPageBtn.className = "pagination-btn";
        lastPageBtn.addEventListener("click", () => {
            currentPage = totalPages;
            updatePage();
        });
        paginationContainer.appendChild(lastPageBtn);
    }
}

function updatePage() {
    loadQRCodeHistory(); // Reload data from the server for the current page
}
