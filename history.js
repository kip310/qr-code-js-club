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
const recordsPerPage = 5; // Số bản ghi trên mỗi trang
let totalPages = 1;
let historyData = [];

async function loadQRCodeHistory() {
    console.log("Loading QR Code history...");
    const historyTableBody = document.querySelector("#history-table-body");
    if (!historyTableBody) return console.error("History table body not found");

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

    historyData = data; // Lưu dữ liệu để phân trang
    totalPages = Math.ceil(historyData.length / recordsPerPage);
    currentPage = 1; // Reset về trang đầu tiên
    renderTable();
}

// Hàm tạo HTML cho mỗi dòng lịch sử
function renderHistoryRow(item, index) {
    // Kiểm tra nếu QR có tracking (Dựa vào qr_image chứa "redirect.html")
    const isTrackingEnabled = item.qr_image && item.qr_image.includes("redirect.html");

    const displayedQRData = isTrackingEnabled
        ? `<a href="${item.qr_image}" target="_blank">${item.qr_image}</a>`
        : `<span style="color: gray;">No Tracking</span>`;

    // Nếu number_of_scanning < 0 => Không có tracking
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
            <td>
                <button class="download-btn" data-url="${item.qr_image}">Download</button>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        </tr>
    `;
}


// Gán event listener cho nút Delete & Download
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

// Xóa QR Code khỏi Supabase và cập nhật giao diện
async function deleteQRCode(qrId) {
    if (!confirm("Bạn có chắc muốn xóa QR Code này?")) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        alert("Bạn cần đăng nhập để thực hiện thao tác này!");
        return;
    }

    const { error } = await supabase
        .from("qr_history")
        .delete()
        .match({ id: qrId, user_id: userData.user.id });

    if (error) {
        console.error("Lỗi khi xóa QR Code:", error);
        alert("Xóa QR Code thất bại! Vui lòng thử lại.");
        return;
    }

    alert("QR Code đã được xóa thành công!");
    document.querySelector(`tr[data-id="${qrId}"]`)?.remove();
}

// Tải ảnh QR xuống
function downloadQRCode(imageUrl) {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Load lịch sử QR khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling loadQRCodeHistory");
    loadQRCodeHistory();
});

// Hàm xóa tất cả QR Code của user
async function deleteAllQRCode() {
    if (!confirm("Bạn có chắc chắn muốn xóa tất cả QR Code? Hành động này không thể hoàn tác!")) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        alert("Bạn cần đăng nhập để thực hiện thao tác này!");
        return;
    }

    // Xóa tất cả bản ghi của user hiện tại
    const { error } = await supabase
        .from("qr_history")
        .delete()
        .eq("user_id", userData.user.id);

    if (error) {
        console.error("Lỗi khi xóa tất cả QR Code:", error);
        alert("Xóa tất cả QR Code thất bại! Vui lòng thử lại.");
        return;
    }

    alert("Tất cả QR Code đã được xóa thành công!");

    // Cập nhật lại lịch sử sau khi xóa
    loadQRCodeHistory();
}

// Gán sự kiện cho nút "Delete All"
document.getElementById("delete-all-btn").addEventListener("click", deleteAllQRCode);

function renderTable() {
    const historyTableBody = document.querySelector("#history-table-body");
    historyTableBody.innerHTML = "";

    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const paginatedData = historyData.slice(start, end);

    if (paginatedData.length === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    historyTableBody.innerHTML = paginatedData.map(renderHistoryRow).join("");

    attachEventListeners(); // Gán lại sự kiện
    renderPaginationControls(); // Hiển thị phân trang
}

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

// Helper function to update page smoothly
function updatePage() {
    renderTable(); // Update table content
    renderPaginationControls(); // Re-render pagination buttons
}

