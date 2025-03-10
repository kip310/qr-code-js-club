import { supabase } from "./supabaseClient.js";

console.log("track.js loaded");

// Function to track QR scan
async function trackQRScan(qrData) {
        console.log("Tracking scan for QR data:", qrData);

        const urlParams = new URLSearchParams(window.location.search);
        const qrData = decodeURIComponent(urlParams.get("qr_data"));
        
        const { data, error } = await supabase
            .from("qr_history")
            .select("*")
            .eq("original_url", qrData);
        

    console.log("Supabase Query Result:", data, error);

    if (!data || data.length === 0) {
        console.error("QR Code Not Found or Error:", error);
        console.log("Supabase Response:", error ? error.message : "No matching data found.");
        console.log("Searching for QR data:", qrData);
        return;
    }

    console.log("Current scan count before update:", data[0].number_of_scanning);

    const newCount = (data[0].number_of_scanning ?? 0) + 1;
    const { error: updateError } = await supabase
        .from("qr_history")
        .update({ number_of_scanning: newCount })
        .eq("id", data[0].id);

    if (updateError) {
        console.error("Error updating scan count:", updateError);
    } else {
        console.log(`Scan count updated to: ${newCount}`);
    }


    // Redirect to the original URL after tracking
    setTimeout(() => {
        if (!qrData) {
            console.error("No qrData found. Redirect failed.");
        } else {
            console.log(`Final Redirect URL (before decode): ${qrData}`);
            const decodedQRData = decodeURIComponent(qrData);
            console.log(`Decoded Redirect URL: ${decodedQRData}`);
    
            if (decodedQRData.startsWith("http")) {
                console.log("Redirecting now...");
                window.location.href = decodedQRData;
            } else {
                console.error("Invalid redirect URL:", decodedQRData);
            }
        }
    }, 0);
    

}

// Check if there's a scanned QR code in the URL
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrData = decodeURIComponent(urlParams.get("qr_data"));
    console.log("Decoded qr_data:", qrData);

    if (qrData) {
        trackQRScan(qrData);
    } else {
        console.warn("No qr_data found in URL.");
    }
});
