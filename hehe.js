import { longVariable } from "./variable.js"; 
import { supabase } from "./supabaseClient.js";
import { saveState, loadState, updateUIFromState, clearState } from "./stateManager.js";

// Xử lý modal
document.body.addEventListener("click", function(event){
    console.log(event.target);
    if (event.target.matches(".modal-close")){
        const modal = event.target.parentNode.parentNode;
        modal.parentNode.removeChild(modal);
    } else if(event.target.matches(".modal") && !event.target.closest(".modal-content")){
        console.log("Closing modal due to click outside modal-content");
        event.target.parentNode.removeChild(event.target);
    }
});

// Xử lý accordion
const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach((header) => {
    header.addEventListener("click", (event) => {
        handleClickAccordion(event, header);
    });
});

function handleClickAccordion(event, clickedHeader) {
    accordionHeaders.forEach((header) => {
        const content = header.nextElementSibling;
        const icon = header.querySelector(".icon");

        if (header !== clickedHeader) {
            content.classList.remove("is-active");
            content.style.height = "0px";
            icon.classList.remove("fa-angle-up");
            icon.classList.add("fa-angle-down");
        }
    });

    const content = clickedHeader.nextElementSibling;
    content.classList.toggle("is-active");

    if (content.classList.contains("is-active")) {
        content.style.height = `${content.scrollHeight}px`;
    } else {
        content.style.height = "0px";
    }

    const icon = clickedHeader.querySelector(".icon");
    icon.classList.toggle("fa-angle-down");
    icon.classList.toggle("fa-angle-up");
}

function updateValue(inputId, spanId) {
    document.getElementById(spanId).textContent = document.getElementById(inputId).value;
}

// Khai báo các biến cần thiết trước
const defaultURL = "https://www.facebook.com/fu.jsclub"; 
const textData = document.querySelector("#form-data");
const toggleScan = document.getElementById("toggleScan");

let op = {
    width: 300,
    height: 300,
    margin: 0,
    type: "svg",
    data: defaultURL,
    image: longVariable,
    dotsOptions: {
        color: "#4267b2",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#e9ebee"
    },
    imageOptions: {
        hideBackgroundDots: true,
        crossOrigin: "anonymous",
        margin: 10,
        imageSize: 0.4
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#4267b2"
    },
    cornersDotOptions: {
        type: "",
        color: "#4267b2"
    }
};

// Khởi tạo các biến toàn cục
let qrCode = null;
let canvasEl = null;

function render() {
    if (!qrCode) {
        console.error("qrCode is not initialized!");
        return;
    }
    console.log("Rendering with op:", op);
    qrCode.update(op);
    if (canvasEl) {
        canvasEl.nextElementSibling.innerHTML = `${op.width}px x ${op.height}px`;
    }
}

function isValidURL(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

async function generateQRCode() {
    const errorMessageEl = document.querySelector("#error-message");
    if (!errorMessageEl) {
        console.error("Error message element #error-message not found!");
        return;
    }

    let userInputURL = textData.value.trim();
    if (!userInputURL) {
        console.warn("Input is empty, using default URL.");
        userInputURL = "https://www.facebook.com/fu.jsclub";
    }

    if (!isValidURL(userInputURL)) {
        errorMessageEl.style.display = "block";
        errorMessageEl.innerText = "Please enter a valid URL.";
        return;
    } else {
        errorMessageEl.style.display = "none";
    }

    renderQRCode(userInputURL);
}

function renderQRCode(qrData) {
    console.log("Updating QR code with data:", qrData);
    op.data = qrData;
    render();
}

function setupColorOption(configKey, selectors, defaults) {
    const configObj = op[configKey] = op[configKey] || {};

    if (selectors.typeSelect) {
        const typeSelect = document.querySelector(selectors.typeSelect);
        if (!typeSelect) {
            console.error(`Type select element ${selectors.typeSelect} not found!`);
            return;
        }
        typeSelect.addEventListener("change", function () {
            configObj.type = this.value;
            console.log(`${configKey} type updated:`, configObj.type);
            render();
            saveState(op, textData, toggleScan);
        });
    }

    if (selectors.colorInput) {
        const colorInput = document.querySelector(selectors.colorInput);
        if (!colorInput) {
            console.error(`Color input element ${selectors.colorInput} not found!`);
            return;
        }
        const updateColor = function () {
            configObj.color = colorInput.value;
            delete configObj.gradient; // Xóa gradient nếu chọn single color
            console.log(`${configKey} color updated:`, configObj.color);
            render();
            saveState(op, textData, toggleScan);
        };
        colorInput.addEventListener("input", updateColor);
        colorInput.addEventListener("change", updateColor); // Thêm sự kiện change để đảm bảo tương thích
    }

    if (selectors.clearButton) {
        const clearButton = document.querySelector(selectors.clearButton);
        if (!clearButton) {
            console.error(`Clear button element ${selectors.clearButton} not found!`);
            return;
        }
        clearButton.addEventListener("click", function () {
            const defaultColor = defaults && defaults.color ? defaults.color : "#ffffff";
            const colorEl = document.querySelector(selectors.colorInput);
            colorEl.value = defaultColor;
            configObj.color = defaultColor;
            delete configObj.gradient;
            console.log(`${configKey} color cleared to:`, defaultColor);
            render();
            saveState(op, textData, toggleScan);
        });
    }

    if (selectors.gradientInputs) {
        const { color1, color2, rotation, gradientTypeRadioLinear, gradientTypeRadioRadial } = selectors.gradientInputs;
        const color1El = document.querySelector(color1);
        const color2El = document.querySelector(color2);
        const rotationEl = document.querySelector(rotation);
        const gradientTypeRadioLinearEl = document.querySelector(gradientTypeRadioLinear);
        const gradientTypeRadioRadialEl = document.querySelector(gradientTypeRadioRadial);

        if (!color1El || !color2El || !rotationEl || !gradientTypeRadioLinearEl || !gradientTypeRadioRadialEl) {
            console.error(`Gradient input elements not found for ${configKey}`);
            return;
        }

        // Đặt giá trị mặc định cho các phần tử gradient
        if (!color1El.value) color1El.value = "#000000";
        if (!color2El.value) color2El.value = "#ffffff";
        if (!rotationEl.value) rotationEl.value = "0";

        const updateGradient = function () {
            const radioGradient = document.querySelector(selectors.radioGradient);
            if (!radioGradient) {
                console.error(`Radio gradient element ${selectors.radioGradient} not found!`);
                return;
            }
            if (radioGradient.checked) {
                const rot = parseInt(rotationEl.value, 10) || 0;
                configObj.gradient = {
                    type: gradientTypeRadioLinearEl.checked ? "linear" : "radial",
                    colorStops: [
                        { offset: 0, color: color1El.value },
                        { offset: 1, color: color2El.value }
                    ],
                    rotation: rot
                };
                delete configObj.color; // Xóa single color nếu chọn gradient
                console.log(`${configKey} gradient updated:`, configObj.gradient);
            } else {
                delete configObj.gradient;
            }
            render();
            saveState(op, textData, toggleScan);
        };

        color1El.addEventListener("input", updateGradient);
        color1El.addEventListener("change", updateGradient); // Thêm sự kiện change
        color2El.addEventListener("input", updateGradient);
        color2El.addEventListener("change", updateGradient); // Thêm sự kiện change
        rotationEl.addEventListener("input", updateGradient);
        gradientTypeRadioLinearEl.addEventListener("change", updateGradient);
        gradientTypeRadioRadialEl.addEventListener("change", updateGradient);
    }

    if (selectors.radioSingle && selectors.radioGradient && selectors.sectionSingle && selectors.sectionGradient) {
        const radioSingle = document.querySelector(selectors.radioSingle);
        const radioGradient = document.querySelector(selectors.radioGradient);
        const sectionSingle = document.querySelector(selectors.sectionSingle);
        const sectionGradient = document.querySelector(selectors.sectionGradient);

        if (!radioSingle || !radioGradient || !sectionSingle || !sectionGradient) {
            console.error(`Radio or section elements not found for ${configKey}`);
            return;
        }

        radioSingle.addEventListener("change", function () {
            sectionSingle.classList.remove("hidden");
            sectionGradient.classList.add("hidden");
            delete configObj.gradient;
            const colorInput = document.querySelector(selectors.colorInput);
            if (colorInput) {
                configObj.color = colorInput.value;
            }
            console.log(`${configKey} switched to single color:`, configObj.color);
            render();
            saveState(op, textData, toggleScan);
        });

        radioGradient.addEventListener("change", function () {
            sectionSingle.classList.add("hidden");
            sectionGradient.classList.remove("hidden");
            if (selectors.gradientInputs) {
                const evt = new Event("input");
                document.querySelector(selectors.gradientInputs.color1).dispatchEvent(evt);
            }
            saveState(op, textData, toggleScan);
        });
    }
}

// Gộp tất cả các khối DOMContentLoaded lại thành một khối duy nhất
document.addEventListener("DOMContentLoaded", function () {
    // Xử lý load state trước để cập nhật op
    op = loadState(op, textData, toggleScan, defaultURL, renderQRCode);

    // Khởi tạo qrCode và canvasEl sau khi op đã được cập nhật
    canvasEl = document.querySelector('#canvas');
    if (canvasEl) {
        qrCode = new QRCodeStyling(op); // Khởi tạo với op đã được cập nhật
        qrCode.append(canvasEl);
        canvasEl.nextElementSibling.innerHTML = `${op.width}px x ${op.height}px`;
        render(); // Gọi render() ngay sau khi khởi tạo để vẽ mã QR
    } else {
        console.error("Canvas element #canvas not found!");
    }

    // Xử lý các slider (Main Option)
    let sliders = ["form-width", "form-height", "form-margin"];
    sliders.forEach(id => {
        let input = document.getElementById(id);
        let span = document.getElementById(id.replace("form-", "") + "-value");
        if (!input || !span) {
            console.error(`Slider element #${id} or its value span not found!`);
            return;
        }
        span.textContent = input.value;

        input.addEventListener("input", function () {
            span.textContent = input.value;
            op[id.replace("form-", "")] = parseInt(this.value, 10);
            console.log(`Updated ${id.replace("form-", "")}:`, op[id.replace("form-", "")]);
            render();
            saveState(op, textData, toggleScan);
        });
    });

    // Xử lý toggle màu (single/gradient)
    function setupColorToggle(singleColorRadioId, gradientColorRadioId, optionsContainerId, singleColorSectionClass, gradientColorSectionClass) {
        const singleColorRadio = document.getElementById(singleColorRadioId);
        const gradientColorRadio = document.getElementById(gradientColorRadioId);
        const optionsContainer = document.getElementById(optionsContainerId);

        const singleColorSection = document.querySelector(singleColorSectionClass);
        const gradientColorSection = document.querySelector(gradientColorSectionClass);

        if (!singleColorRadio || !gradientColorRadio || !optionsContainer || !singleColorSection || !gradientColorSection) {
            console.error(`Color toggle elements not found for ${singleColorRadioId}`);
            return;
        }

        function toggleColorOptions() {
            const isSingleSelected = singleColorRadio.checked;
            singleColorSection.classList.toggle("hidden", !isSingleSelected);
            gradientColorSection.classList.toggle("hidden", isSingleSelected);
            resize();
            saveState(op, textData, toggleScan);
        }

        function resize() {
            optionsContainer.style.height = `${optionsContainer.scrollHeight}px`;
            setTimeout(() => {
                optionsContainer.style.height = "auto";
            }, 300);
        }

        singleColorRadio.addEventListener("change", toggleColorOptions);
        gradientColorRadio.addEventListener("change", toggleColorOptions);

        gradientColorSection.classList.add("hidden");
        optionsContainer.style.height = "0px";
        optionsContainer.style.overflow = "hidden";
    }

    setupColorToggle(
        "form-dots-color-type-single", 
        "form-dots-color-type-gradient", 
        "dots-options", 
        ".dots-options.single", 
        ".dots-options.gradient"
    );

    setupColorToggle(
        "form-corners-square-color-type-single", 
        "form-corners-square-color-type-gradient", 
        "corners-square-options", 
        ".cornersSquareOptions.single", 
        ".cornersSquareOptions.gradient"
    );

    setupColorToggle(
        "corners-dot-single", 
        "corners-dot-gradient", 
        "corners-dot-options", 
        ".corners-dot.single", 
        ".corners-dot.gradient"
    );

    // Xử lý Image Options
    const hideBackgroundDotsCheckbox = document.getElementById("form-hide-background-dots");
    const imageSizeInput = document.getElementById("form-image-size");
    const imageMarginInput = document.getElementById("form-image-margin");

    if (typeof op === "undefined") {
        console.error("Biến 'op' chưa được khai báo!");
        return;
    }

    if (hideBackgroundDotsCheckbox) {
        hideBackgroundDotsCheckbox.checked = op.imageOptions.hideBackgroundDots;
        hideBackgroundDotsCheckbox.addEventListener("change", function() {
            op.imageOptions.hideBackgroundDots = this.checked;
            render();
            saveState(op, textData, toggleScan);
        });
    } else {
        console.error("Không tìm thấy phần tử #form-hide-background-dots");
    }

    if (imageSizeInput) {
        imageSizeInput.value = op.imageOptions.imageSize;
        imageSizeInput.addEventListener("input", function() {
            let val = parseFloat(this.value);
            if (!isNaN(val) && val >= 0.1 && val <= 1) {
                op.imageOptions.imageSize = val;
                render();
                saveState(op, textData, toggleScan);
            } else {
                this.value = op.imageOptions.imageSize;
            }
        });
    } else {
        console.error("Không tìm thấy phần tử #form-image-size");
    }

    if (imageMarginInput) {
        imageMarginInput.value = op.imageOptions.margin;
        imageMarginInput.addEventListener("input", function() {
            let val = parseInt(this.value, 10);
            if (!isNaN(val) && val >= 0 && val <= 20) {
                op.imageOptions.margin = val;
                render();
                saveState(op, textData, toggleScan);
            } else {
                this.value = op.imageOptions.margin;
            }
        });
    } else {
        console.error("Không tìm thấy phần tử #form-image-margin");
    }

    // Gắn các sự kiện cho Dots Options, Background Options, Corners Square Options, Corners Dot Options
    setupColorOption("dotsOptions", {
        typeSelect: "#form-dots-type",
        colorInput: "#form-dots-color",
        gradientInputs: {
            color1: "#form-dots-gradient-color1",
            color2: "#form-dots-gradient-color2",
            rotation: "#form-dots-gradient-rotation",
            gradientTypeRadioLinear: "#form-dots-gradient-type-linear",
            gradientTypeRadioRadial: "#form-dots-gradient-type-radial"
        },
        radioSingle: "#form-dots-color-type-single",
        radioGradient: "#form-dots-color-type-gradient",
        sectionSingle: ".dots-options.single",
        sectionGradient: ".dots-options.gradient"
    }, {
        color: "#6a1a4c"
    });

    setupColorOption("backgroundOptions", {
        colorInput: "#background-color"
    }, {
        color: "#ffffff"
    });

    setupColorOption("cornersSquareOptions", {
        typeSelect: "#form-corners-square-type",
        colorInput: "#form-corners-square-color",
        clearButton: "#button-clear-corners-square-color",
        gradientInputs: {
            color1: "#form-corners-square-gradient-color1",
            color2: "#form-corners-square-gradient-color2",
            rotation: "#form-corners-square-gradient-rotation",
            gradientTypeRadioLinear: "#form-corners-square-gradient-type-linear",
            gradientTypeRadioRadial: "#form-corners-square-gradient-type-radial"
        },
        radioSingle: "#form-corners-square-color-type-single",
        radioGradient: "#form-corners-square-color-type-gradient",
        sectionSingle: ".cornersSquareOptions.single",
        sectionGradient: ".cornersSquareOptions.gradient"
    }, {
        color: "#ffffff"
    });

    setupColorOption("cornersDotOptions", {
        typeSelect: "#corners-dot-type",
        colorInput: "#corners-dot",
        clearButton: "#button-clear-corners-dot",
        gradientInputs: {
            color1: "#corners-dot-gradient-color1",
            color2: "#corners-dot-gradient-color2",
            rotation: "#form-corners-dot-gradient-rotation",
            gradientTypeRadioLinear: "#corners-dot-gradient-linear",
            gradientTypeRadioRadial: "#corners-dot-gradient-radial"
        },
        radioSingle: "#corners-dot-single",
        radioGradient: "#corners-dot-gradient",
        sectionSingle: ".corners-dot.single",
        sectionGradient: ".corners-dot.gradient"
    }, {
        color: "#000000"
    });
});

// Xử lý các sự kiện khác
textData.addEventListener("keyup", () => {
    generateQRCode();
    saveState(op, textData, toggleScan);
});

toggleScan.addEventListener("change", () => {
    generateQRCode();
    saveState(op, textData, toggleScan);
});

const fileInput = document.querySelector("#form-logo");

fileInput.addEventListener("change", e => {
    let file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        alert("Only image files are accepted!");
        fileInput.value = "";
        return;
    }

    let reader = new FileReader();
    reader.onload = () => {
        op.image = reader.result;
        render();
        saveState(op, textData, toggleScan);
    };
    reader.readAsDataURL(file);
});

const cancelButton = document.querySelector("#button-cancel");

cancelButton.addEventListener("click", () => {
    op.image = '';
    fileInput.value = "";
    render();
    saveState(op, textData, toggleScan);
});

async function saveQRToSupabase(originalURL, trackEnabled) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            console.log("User not logged in, skipping history save.");
            return null;
        }

        let finalQRImage;
        const canvas = document.getElementById("canvas");
        let qrId = null;
        let finalURL = originalURL;

        const { data: newQR, error: insertError } = await supabase
            .from("qr_history")
            .insert({
                user_id: userData.user.id,
                qr_data: originalURL,
                original_url: originalURL,
                qr_image: null,
                created_at: new Date().toISOString(),
                number_of_scanning: trackEnabled ? 0 : -1
            })
            .select("id, qr_data")
            .single();

        if (insertError) {
            console.error("Error inserting QR record:", insertError);
            return null;
        }

        qrId = newQR.id;
        const qrData = newQR.qr_data;
        console.log(`QR record created! ID: ${qrId}, qr_data: ${qrData}`);

        if (trackEnabled) {
            const encodedQrData = encodeURIComponent(qrData);
            finalURL = `https://qr-code-js-club.vercel.app/redirect.html?id_qr=${qrId}`;
        }

        renderQRCode(finalURL);
        await new Promise(resolve => setTimeout(resolve, 500));

        finalQRImage = await html2canvas(canvas, { useCORS: true, scale: 1 }).then(canvas => canvas.toDataURL("image/png"));

        const { error: updateError } = await supabase
            .from("qr_history")
            .update({ qr_image: finalQRImage })
            .eq("id", qrId);

        if (updateError) {
            console.error("Error updating QR image:", updateError);
            return null;
        }

        return { id: qrId, qrImage: finalQRImage };
    } catch (error) {
        console.error("Unexpected error while saving QR:", error);
        return null;
    }
}

document.getElementById("btn-dl").addEventListener("click", async () => {
    let originalURL = textData.value.trim();
    if (!originalURL) originalURL = "https://www.facebook.com/fu.jsclub";

    if (!isValidURL(originalURL)) {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        const trackEnabled = document.getElementById("toggleScan").checked;
        const result = await saveQRToSupabase(originalURL, trackEnabled);

        if (!result) {
            alert("Lỗi khi lưu QR vào Supabase!");
            return;
        }

        downloadQRCode(result.qrImage);
    } catch (error) {
        console.error("Lỗi khi tạo QR code:", error);
    }
});

function downloadQRCode(imageUrl) {
    if (!imageUrl) {
        console.error("QR image is empty, cannot download.");
        return;
    }
    
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}