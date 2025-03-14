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
async function loadQRCodeHistory() {
    console.log("loadQRCodeHistory called");
    const historyTableBody = document.querySelector("#history-table-body");
    if (!historyTableBody) {
        console.error("History table body not found in DOM");
        return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        console.log("No user logged in");
        historyTableBody.innerHTML = "<tr><td colspan='6'>Please log in to view your QR code history.</td></tr>";
        return;
    }

    const { data, error } = await supabase
        .from("qr_history")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading QR code history:", error);
        historyTableBody.innerHTML = "<tr><td colspan='6'>Error loading history. Please try again later.</td></tr>";
        return;
    }

    if (data.length === 0) {
        historyTableBody.innerHTML = "<tr><td colspan='6'>No QR codes in your history yet.</td></tr>";
        return;
    }

    historyTableBody.innerHTML = data.map((item, index) => {
        // Nếu tracking không bật (qr_data === original_url), hiển thị "No Tracking"
        const displayedQRData = (item.qr_data === item.original_url) ? "No Tracking" : `<a href="${item.qr_data}" target="_blank">${item.qr_data}</a>`;

        // Nếu tracking bị tắt, số lượt quét sẽ hiển thị "No Tracking"
        const displayedScans = (item.qr_data === item.original_url) ? "No Tracking" : item.number_of_scanning;

        return `
            <tr data-id="${item.id}">
                <td>${index + 1}</td>
                <td>${new Date(item.created_at).toLocaleString()}</td>
                <td><a href="${item.original_url}" target="_blank">${item.original_url}</a></td> <!-- Always show original URL -->
                <td><img src="${item.qr_image}" alt="QR Code" class="qr-image" width="50"></td>
                <td>${displayedScans}</td> <!-- Show "No Tracking" for number_of_scanning when tracking is off -->
                <td>
                    <button class="download-btn" data-url="${item.qr_image}">Download</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </td>
            </tr>
        `;
    }).join("");

    // Attach delete event listeners
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const qrId = e.target.getAttribute("data-id");
            await deleteQRCode(qrId);
        });
    });

    // Attach download event listeners
    document.querySelectorAll(".download-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const imageUrl = e.target.getAttribute("data-url");
            downloadQRCode(imageUrl);
        });
    });
}


async function deleteQRCode(qrId) {
    if (!confirm("Bạn có chắc muốn xóa QR Code này?")) return;

    // Lấy ID user hiện tại
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        alert("Bạn cần đăng nhập để thực hiện thao tác này!");
        return;
    }

    // Xóa QR Code theo ID và user_id
    const { error } = await supabase
        .from("qr_history")
        .delete()
        .match({ id: qrId, user_id: userData.user.id }); // Xóa đúng user

    if (error) {
        console.error("Lỗi khi xóa QR Code:", error);
        alert("Xóa QR Code thất bại! Vui lòng thử lại.");
        return;
    }

    alert("QR Code đã được xóa thành công!");

    // Xóa dòng khỏi DOM
    document.querySelector(`tr[data-id="${qrId}"]`)?.remove();
}

function downloadQRCode(imageUrl) {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "qr_code.png"; // Đặt tên file tải về
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling loadQRCodeHistory");
    loadQRCodeHistory();
});
