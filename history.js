// history.js
import { supabase } from "./supabaseClient.js";

console.log("history.js loaded");

// Hàm hiển thị modal thông báo
function showNotificationModal(message, isError = false) {
    const modalContainer = document.getElementById('notification-modal');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
        <div class="relative p-4 w-full max-w-md">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-close-modal>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="p-4 text-center">
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">${isError ? 'Error' : 'Notification'}</h3>
                    <p class="mb-5 text-gray-800 dark:text-gray-300">${message}</p>
                    <button type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data-close-modal>Close</button>
                </div>
            </div>
        </div>
    `;

    modalContainer.classList.remove('hidden');

    const closeButtons = modalContainer.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modalContainer.classList.add('hidden');
        });
    });
}

// Hàm hiển thị modal cho Delete và Delete All
function showDeleteModal(title, confirmCallback) {
    const modal = document.getElementById("popup-modal");
    const modalTitle = document.getElementById("modal-title");
    const confirmBtn = document.getElementById("modal-confirm-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const closeBtn = document.querySelector('[data-modal-hide="popup-modal"]');

    if (!modal || !modalTitle || !confirmBtn || !cancelBtn || !closeBtn) {
        console.error("Delete modal elements not found!");
        return;
    }

    modalTitle.textContent = title;
    modal.classList.remove("hidden");

    confirmBtn.onclick = () => {
        confirmCallback();
        modal.classList.add("hidden");
    };

    const hideModal = () => modal.classList.add("hidden");
    cancelBtn.onclick = hideModal;
    closeBtn.onclick = hideModal;
}

// Hàm hiển thị modal cho Edit
function showEditModal(title, currentUrl, confirmCallback) {
    const modal = document.getElementById("authentication-modal");
    const modalTitle = document.getElementById("edit-modal-title");
    const urlInput = document.getElementById("edit-url");
    const confirmBtn = document.getElementById("edit-modal-confirm-btn");
    const cancelBtn = document.getElementById("edit-modal-cancel-btn");
    const closeBtn = document.querySelector('[data-modal-hide="authentication-modal"]');
    const form = document.getElementById("edit-form");

    if (!modal || !modalTitle || !urlInput || !confirmBtn || !cancelBtn || !closeBtn || !form) {
        console.error("Edit modal elements not found!");
        return;
    }

    modalTitle.textContent = title;
    urlInput.value = currentUrl;
    modal.classList.remove("hidden");


    form.addEventListener('submit', (e) => e.preventDefault());

    confirmBtn.onclick = () => {
        const newUrl = urlInput.value.trim();
        confirmCallback(newUrl);
        modal.classList.add("hidden");
    };

    const hideModal = () => modal.classList.add("hidden");
    cancelBtn.onclick = hideModal;
    closeBtn.onclick = hideModal;
}



//tải table history
let currentPage = 1;
const recordsPerPage = 5;
let totalPages = 1;
let totalRecords = 0;

async function loadQRCodeHistory() {
    console.log("Loading QR Code history...");
    const historyTableBody = document.querySelector("#history-table-body");
    if (!historyTableBody) return console.error("History table body not found");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>Please log in to view your QR code history.</td></tr>";
        return;
    }

    const { count, error: countError } = await supabase
        .from("qr_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userData.user.id);

    if (countError) {
        console.error("Error fetching total record count:", countError);
        historyTableBody.innerHTML = "<tr><td colspan='6'>Error loading history. Please try again later.</td></tr>";
        return;
    }

    totalRecords = count;
    totalPages = Math.ceil(totalRecords / recordsPerPage);

    if (totalRecords === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    const startIndex = (currentPage - 1) * recordsPerPage;
    const stopIndex = startIndex + recordsPerPage - 1;

    const { data, error } = await supabase
        .from("qr_history")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .range(startIndex, stopIndex);

    if (error) {
        console.error("Error loading history:", error);
        historyTableBody.innerHTML = "<tr><td colspan='6'>Error loading history. Please try again later.</td></tr>";
        return;
    }

    renderTable(data);
}

function renderTable(paginatedData) {
    const historyTableBody = document.querySelector("#history-table-body");
    historyTableBody.innerHTML = "";

    if (paginatedData.length === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    const startIndex = (currentPage - 1) * recordsPerPage;
    historyTableBody.innerHTML = paginatedData
        .map((item, index) => renderHistoryRow(item, startIndex + index))
        .join("");

    attachEventListeners();
    renderPaginationControls();
}

function renderHistoryRow(item, index) {
    const displayedScans = item.number_of_scanning < 0 
        ? `<span style="color: gray;">No Tracking</span>` 
        : item.number_of_scanning ?? 0;

    return `
        <tr data-id="${item.id}">
            <td>${index + 1}</td>
            <td>${new Date(item.created_at).toLocaleString()}</td>
            <td><a href="${item.qr_data}" target="_blank">${item.qr_data}</a></td>
            <td><img src="${item.qr_image}" alt="QR Code" class="qr-image" width="50"></td>
            <td>${displayedScans}</td>
            <td class="actions">
                <div class="button-group">
                    <button class="edit-btn" data-id="${item.id}" data-url="${item.qr_data}">Edit</button>
                    <button class="download-btn" data-url="${item.qr_image}">Download</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </div>
            </td>
        </tr>
    `;
}

function attachEventListeners() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const qrId = e.target.dataset.id;
            const currentUrl = e.target.dataset.url;
            await editQRCode(qrId, currentUrl);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const qrId = e.target.dataset.id;
            await deleteQRCode(qrId);
        });
    });

    document.querySelectorAll(".download-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const imageUrl = e.target.dataset.url;
            downloadQRCode(imageUrl);
        });
    });
}

// Hàm cập nhật một dòng trong table
function updateTableRow(qrId, newUrl) {
    const row = document.querySelector(`tr[data-id="${qrId}"]`);
    if (row) {
        const linkCell = row.cells[2]; // Cột Link (thứ 3)
        linkCell.innerHTML = `<a href="${newUrl}" target="_blank">${newUrl}</a>`;
    }
}

async function editQRCode(qrId, currentUrl) {
    showEditModal(
        "Edit QR Code",
        currentUrl,
        async (newUrl) => {
            if (!newUrl) {
                showNotificationModal("Please enter a URL!", true);
                return;
            }

            const finalUrl = newUrl.trim();

            try {
                if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
                    showNotificationModal("Invalid URL! URL must start with http:// or https:// (e.g., https://example.com)", true);
                    return;
                }
                new URL(finalUrl);
            } catch (e) {
                showNotificationModal("Invalid URL! Please enter a valid URL (e.g., https://example.com)", true);
                return;
            }

            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                showNotificationModal("You need to be logged in to perform this action!", true);
                return;
            }

            const { error } = await supabase
                .from("qr_history")
                .update({ qr_data: finalUrl })
                .eq("id", qrId)
                .eq("user_id", userData.user.id);

            if (error) {
                console.error("Error updating QR Code:", error);
                showNotificationModal("Failed to update QR Code! Please try again.", true);
                return;
            }

            showNotificationModal("QR Code updated successfully!");
            updateTableRow(qrId, finalUrl); // Cập nhật table thay vì reload trang
        }
    );
}

async function deleteQRCode(qrId) {
    showDeleteModal(
        "Are you sure you want to delete this QR Code?",
        async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                showNotificationModal("You need to be logged in to perform this action!", true);
                return;
            }

            const { error } = await supabase
                .from("qr_history")
                .delete()
                .match({ id: qrId, user_id: userData.user.id });

            if (error) {
                console.error("Error deleting QR Code:", error);
                showNotificationModal("Failed to delete QR Code! Please try again.", true);
                return;
            }

            showNotificationModal("QR Code deleted successfully!");
            loadQRCodeHistory(); // Reload table vì số lượng bản ghi thay đổi
        }
    );
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
    showDeleteModal(
        "Are you sure you want to delete all QR Codes? This action cannot be undone!",
        async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                showNotificationModal("You need to be logged in to perform this action!", true);
                return;
            }

            const { error } = await supabase
                .from("qr_history")
                .delete()
                .eq("user_id", userData.user.id);

            if (error) {
                console.error("Error deleting all QR Codes:", error);
                showNotificationModal("Failed to delete all QR Codes! Please try again.", true);
                return;
            }

            window.location.reload();
        }
    );
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling loadQRCodeHistory");
    loadQRCodeHistory();

    const deleteAllBtn = document.getElementById("delete-all-btn");
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener("click", deleteAllQRCode);
    } else {
        console.error("Delete All button not found!");
    }
});

function renderPaginationControls() {
    const paginationContainer = document.querySelector("#pagination-container");
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    pageInfo.className = "pagination-info";
    paginationContainer.appendChild(pageInfo);

    if (currentPage > 1) {
        const firstPageBtn = document.createElement("button");
        firstPageBtn.textContent = "First Page";
        firstPageBtn.className = "pagination-btn";
        firstPageBtn.addEventListener("click", () => {
            currentPage = 1;
            updatePage();
        });
        paginationContainer.appendChild(firstPageBtn);
    }

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
    loadQRCodeHistory();
}