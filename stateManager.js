// stateManager.js

// Hàm lưu trạng thái hiện tại vào sessionStorage
export function saveState(op, textData, toggleScan) {
    const state = {
        op: op, // Lưu toàn bộ đối tượng op (các tùy chọn định dạng mã QR)
        inputData: textData.value, // Lưu URL đầu vào
        toggleScan: toggleScan.checked // Lưu trạng thái của nút bật/tắt theo dõi
    };
    sessionStorage.setItem("qrCodeState", JSON.stringify(state));
    console.log("State saved to sessionStorage:", state);
}

// Hàm tải trạng thái từ sessionStorage
export function loadState(op, textData, toggleScan, defaultURL, renderQRCode) {
    const savedState = sessionStorage.getItem("qrCodeState");
    if (savedState) {
        const state = JSON.parse(savedState);
        // Khôi phục đối tượng op
        op = { ...op, ...state.op };
        // Khôi phục dữ liệu đầu vào
        textData.value = state.inputData || defaultURL;
        // Khôi phục trạng thái nút bật/tắt
        toggleScan.checked = state.toggleScan || false;
        console.log("State loaded from sessionStorage:", state);
        // Cập nhật giao diện người dùng (UI) để phản ánh trạng thái đã khôi phục
        updateUIFromState(state, renderQRCode);
    } else {
        console.log("No saved state found in sessionStorage.");
        renderQRCode(defaultURL); // Vẽ mã QR mặc định nếu không có trạng thái
    }
    return op; // Trả về đối tượng op đã được cập nhật
}

// Hàm cập nhật giao diện người dùng dựa trên trạng thái đã tải
export function updateUIFromState(state, renderQRCode) {
    // Cập nhật các thanh trượt (chiều rộng, chiều cao, lề)
    document.getElementById("form-width").value = state.op.width || 300;
    document.getElementById("form-height").value = state.op.height || 300;
    document.getElementById("form-margin").value = state.op.margin || 0;
    document.getElementById("width-value").textContent = state.op.width || 300;
    document.getElementById("height-value").textContent = state.op.height || 300;
    document.getElementById("margin-value").textContent = state.op.margin || 0;

    // Cập nhật tùy chọn chấm (dots)
    if (state.op.dotsOptions) {
        document.getElementById("form-dots-type").value = state.op.dotsOptions.type || "rounded";
        if (state.op.dotsOptions.color) {
            document.getElementById("form-dots-color").value = state.op.dotsOptions.color;
            document.getElementById("form-dots-color-type-single").checked = true;
            document.querySelector(".dots-options.single").classList.remove("hidden");
            document.querySelector(".dots-options.gradient").classList.add("hidden");
        } else if (state.op.dotsOptions.gradient) {
            document.getElementById("form-dots-gradient-color1").value = state.op.dotsOptions.gradient.colorStops[0].color;
            document.getElementById("form-dots-gradient-color2").value = state.op.dotsOptions.gradient.colorStops[1].color;
            document.getElementById("form-dots-gradient-rotation").value = state.op.dotsOptions.gradient.rotation || 0;
            document.getElementById("form-dots-gradient-type-linear").checked = state.op.dotsOptions.gradient.type === "linear";
            document.getElementById("form-dots-color-type-gradient").checked = true;
            document.querySelector(".dots-options.single").classList.add("hidden");
            document.querySelector(".dots-options.gradient").classList.remove("hidden");
        }
    }

    // Cập nhật tùy chọn nền (background)
    if (state.op.backgroundOptions) {
        document.getElementById("background-color").value = state.op.backgroundOptions.color || "#ffffff";
    }

    // Cập nhật tùy chọn góc vuông (corners square)
    if (state.op.cornersSquareOptions) {
        document.getElementById("form-corners-square-type").value = state.op.cornersSquareOptions.type || "";
        if (state.op.cornersSquareOptions.color) {
            document.getElementById("form-corners-square-color").value = state.op.cornersSquareOptions.color;
            document.getElementById("form-corners-square-color-type-single").checked = true;
            document.querySelector(".cornersSquareOptions.single").classList.remove("hidden");
            document.querySelector(".cornersSquareOptions.gradient").classList.add("hidden");
        } else if (state.op.cornersSquareOptions.gradient) {
            document.getElementById("form-corners-square-gradient-color1").value = state.op.cornersSquareOptions.gradient.colorStops[0].color;
            document.getElementById("form-corners-square-gradient-color2").value = state.op.cornersSquareOptions.gradient.colorStops[1].color;
            document.getElementById("form-corners-square-gradient-rotation").value = state.op.cornersSquareOptions.gradient.rotation || 0;
            document.getElementById("form-corners-square-gradient-type-linear").checked = state.op.cornersSquareOptions.gradient.type === "linear";
            document.getElementById("form-corners-square-color-type-gradient").checked = true;
            document.querySelector(".cornersSquareOptions.single").classList.add("hidden");
            document.querySelector(".cornersSquareOptions.gradient").classList.remove("hidden");
        }
    }

    // Cập nhật tùy chọn chấm góc (corners dot)
    if (state.op.cornersDotOptions) {
        document.getElementById("corners-dot-type").value = state.op.cornersDotOptions.type || "";
        if (state.op.cornersDotOptions.color) {
            document.getElementById("corners-dot").value = state.op.cornersDotOptions.color;
            document.getElementById("corners-dot-single").checked = true;
            document.querySelector(".corners-dot.single").classList.remove("hidden");
            document.querySelector(".corners-dot.gradient").classList.add("hidden");
        } else if (state.op.cornersDotOptions.gradient) {
            document.getElementById("corners-dot-gradient-color1").value = state.op.cornersDotOptions.gradient.colorStops[0].color;
            document.getElementById("form-corners-dot-gradient-color2").value = state.op.cornersDotOptions.gradient.colorStops[1].color;
            document.getElementById("corners-dot-gradient-rotation").value = state.op.cornersDotOptions.gradient.rotation || 0;
            document.getElementById("corners-dot-gradient-linear").checked = state.op.cornersDotOptions.gradient.type === "linear";
            document.getElementById("corners-dot-gradient").checked = true;
            document.querySelector(".corners-dot.single").classList.add("hidden");
            document.querySelector(".corners-dot.gradient").classList.remove("hidden");
        }
    }

    // Cập nhật tùy chọn hình ảnh
    if (state.op.imageOptions) {
        document.getElementById("form-hide-background-dots").checked = state.op.imageOptions.hideBackgroundDots;
        document.getElementById("form-image-size").value = state.op.imageOptions.imageSize || 0.4;
        document.getElementById("form-image-margin").value = state.op.imageOptions.margin || 10;
    }

    // Gọi renderQRCode để vẽ lại mã QR sau khi khôi phục trạng thái
    renderQRCode(state.op.data);
}

// Hàm xóa trạng thái khỏi sessionStorage
export function clearState() {
    sessionStorage.removeItem("qrCodeState");
    console.log("State cleared from sessionStorage.");
}