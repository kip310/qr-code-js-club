import { longVariable } from "./variable.js"; 
import { template1 } from "./loginTemplate.js";
import { saveQRCodeToHistory } from "./history.js";



document.body.addEventListener("click", function(event){
  console.log(event.target);
  if (event.target.matches(".modal-close")){
      const modal = event.target.parentNode.parentNode;
      modal.parentNode.removeChild(modal);
  }else if(event.target.matches(".modal") && !event.target.closest(".modal-content")){
    // debug 
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
    // Đóng tất cả accordion trước khi mở cái mới
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

    // Mở hoặc đóng accordion được click
    const content = clickedHeader.nextElementSibling;
    content.classList.toggle("is-active");

    if (content.classList.contains("is-active")) {
        content.style.height = `${content.scrollHeight}px`;
    } else {
        content.style.height = "0px";
    }

    // Đổi icon
    const icon = clickedHeader.querySelector(".icon");
    icon.classList.toggle("fa-angle-down");
    icon.classList.toggle("fa-angle-up");
}



function updateValue(inputId, spanId) {
    document.getElementById(spanId).textContent = document.getElementById(inputId).value;
}

// Cập nhật giá trị ban đầu của thanh trượt
document.addEventListener("DOMContentLoaded", function () {
    let sliders = ["form-width", "form-height", "form-margin"];
    sliders.forEach(id => {
        let input = document.getElementById(id);
        let span = document.getElementById(id.replace("form-", "") + "-value"); // Tạo ID tương ứng
        span.textContent = input.value; // Hiển thị giá trị ban đầu

        // Lắng nghe sự kiện thay đổi giá trị
        input.addEventListener("input", function () {
            span.textContent = input.value;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    function setupColorToggle(singleColorRadioId, gradientColorRadioId, optionsContainerId, singleColorSectionClass, gradientColorSectionClass) {
        const singleColorRadio = document.getElementById(singleColorRadioId);
        const gradientColorRadio = document.getElementById(gradientColorRadioId);
        const optionsContainer = document.getElementById(optionsContainerId);

        const singleColorSection = document.querySelector(singleColorSectionClass);
        const gradientColorSection = document.querySelector(gradientColorSectionClass);

        function toggleColorOptions() {
            const isSingleSelected = singleColorRadio.checked;
            // Hiển thị phần single khi chọn single, ẩn phần gradient
            singleColorSection.classList.toggle("hidden", !isSingleSelected);
            gradientColorSection.classList.toggle("hidden", isSingleSelected);
            resize();
        }

        function resize() {
            optionsContainer.style.height = `${optionsContainer.scrollHeight}px`;
            setTimeout(() => {
                optionsContainer.style.height = "auto";
            }, 300);
        }

        singleColorRadio.addEventListener("change", toggleColorOptions);
        gradientColorRadio.addEventListener("change", toggleColorOptions);

        // Ban đầu ẩn phần gradient (nếu cần)
        gradientColorSection.classList.add("hidden");
        optionsContainer.style.height = "0px";
        optionsContainer.style.overflow = "hidden";
    }

    // Áp dụng cho Dots Options
    setupColorToggle(
        "form-dots-color-type-single", 
        "form-dots-color-type-gradient", 
        "dots-options", 
        ".dots-options.single", 
        ".dots-options.gradient"
    );

    // Áp dụng cho Corners Square Options
    setupColorToggle(
        "form-corners-square-color-type-single", 
        "form-corners-square-color-type-gradient", 
        "corners-square-options", 
        ".cornersSquareOptions.single", 
        ".cornersSquareOptions.gradient"
    );

    // Áp dụng cho Corners Dot Options
    setupColorToggle(
        "corners-dot-single", 
        "corners-dot-gradient", 
        "corners-dot-options", 
        ".corners-dot.single", 
        ".corners-dot.gradient"
    );

    // Áp dụng cho Background Options
    // Đảm bảo rằng HTML của Background Options có:
    // - Radio single: id="background-color-single"
    // - Radio gradient: id="background-color-gradient"
    // - Container: id="background-options"
    // - Phần single: class="background-options single"
    // - Phần gradient: class="background-options gradient"
    setupColorToggle(
        "background-color-single",  // Dùng radio single ID làm tham chiếu (không cần configKey ở đây, chỉ để xử lý toggle)
        "background-color-gradient", 
        "background-options", 
        ".background-options.single", 
        ".background-options.gradient"
    );
});


const defaultURL = "https://www.facebook.com/fu.jsclub"; 
// const trackingURL = `http://127.0.0.1:5502/redirect.html?qr_data=${encodeURIComponent(defaultURL)}`;
const trackingURL = `https://qr-code-js-club.vercel.app/redirect.html?qr_data=${encodeURIComponent(defaultURL)}`;


let op= {
    width: 300,
    height: 300,
    margin: 0,
    type: "svg",
    data: trackingURL,
    image: longVariable,
    dotsOptions: {
        color: "#4267b2",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#e9ebee",
    },
    imageOptions: {
        hideBackgroundDots: true,
        crossOrigin: "anonymous",
        margin: 10, // Giảm margin để ảnh lớn hơn
        imageSize: 0.4 // Điều chỉnh kích thước ảnh (giá trị từ 0 đến 1, mặc định khoảng 0.2)
    },
    cornersSquareOptions: {},
    cornersDotOptions: {} 
};

render();
  
var qrCode;
function render(){
    qrCode = new QRCodeStyling(op);
    let canvasEl = document.querySelector('#canvas');
    canvasEl.innerHTML = '';
    qrCode.append(canvasEl);
    canvasEl.nextElementSibling.innerHTML = `${op.width}px x ${op.height}px`;
}

// Hàm kiểm tra URL hợp lệ
function isValidURL(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
  
  

  
  // Xử lý nhập vào data (link)
  const textData = document.querySelector("#form-data");
  textData.addEventListener("keyup", e => {
      const inputValue = e.target.value.trim();
      const errorMessageEl = document.querySelector("#error-message");
      
      if (!isValidURL(inputValue)) {
          // Nếu không phải URL hợp lệ, hiển thị thông báo lỗi và không update op.data, render
          if (errorMessageEl) {
              errorMessageEl.style.display = "block";
              errorMessageEl.innerText = "Vui lòng nhập một URL hợp lệ.";
          }
          return;
      } else {
          if (errorMessageEl) {
              errorMessageEl.style.display = "none";
          }
      }
      
      // Nếu URL hợp lệ, update op.data và render lại QR code
    //   op.data = inputValue;
    //   render();
    const userInputURL = inputValue.trim();

    if (!isValidURL(userInputURL)) {
        alert("Please enter a valid URL.");
        return;
    }

    // Generate a tracking link that redirects back to your site
    // const trackingURL = `http://127.0.0.1:5502/redirect.html?qr_data=${encodeURIComponent(userInputURL)}`;
    const trackingURL = `https://qr-code-js-club.vercel.app/redirect.html?qr_data=${encodeURIComponent(userInputURL)}`;

    // Save the tracking URL in Supabase
    async function saveQRToSupabase(trackingURL, userInputURL) {
        const { error } = await supabase
            .from("qr_history")
            .insert([
                { qr_data: trackingURL, original_url: userInputURL, number_of_scanning: 0 }
            ]);

        if (error) {
            console.error("Error saving QR:", error);
        } else {
            console.log("QR saved successfully:", trackingURL);
        }
    }

    // Call the function when generating the QR code
    saveQRToSupabase(trackingURL, userInputURL);



    // Now use `trackingURL` instead of `userInputURL` for QR code
    op.data = trackingURL;
    render();

  });


document.addEventListener("click", function(event){
    if (!menu.contains(event.target) && !event.target.matches(".menu-toggle")){
        menu.classList.remove("is-show");
        toggle.classList.remove("fa-times");
        toggle.classList.add("fa-bars");
    }
});

//thay đổi kích thước của qr khi kéo thanh trượt Width, height, Margin

const widthInput = document.querySelector("#form-width");
const heightInput = document.querySelector("#form-height");
const marginInput = document.querySelector("#form-margin");

widthInput.addEventListener("input", e=>{
    op.width = e.target.value;
    render();
});

heightInput.addEventListener("input", e=>{
    op.height = e.target.value;
    render();
});

marginInput.addEventListener("input", e=>{
    op.margin = e.target.value;
    render();
});



//Upload file để thay đổi hình ảnh logo
const fileInput = document.querySelector("#form-logo");

fileInput.addEventListener("change", e => {
    let file = e.target.files[0];

    // Kiểm tra xem có file không và có phải là image không
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        alert("Chỉ chấp nhận file ảnh!");
        fileInput.value = ""; // Reset input
        return;
    }

    let reader = new FileReader();
    reader.onload = () => {
        op.image = reader.result;
        render();
    };
    reader.readAsDataURL(file);
});


const cancelButton = document.querySelector("#button-cancel");

cancelButton.addEventListener("click", () => {
    // Đặt lại giá trị mặc định cho op
    op.image = '';
    fileInput.value = ""; // Xóa file đã chọn

    render();
});

const options = {
    useCORS: true,      // Hỗ trợ CORS
    allowTaint: false   // Không cho phép các hình ảnh không có CORS
};


/**
 * Hàm setupColorOption dùng để thiết lập các sự kiện cho nhóm tùy chọn có cả chế độ Single & Gradient.
 * @param {String} configKey - Tên thuộc tính trong op (ví dụ: "dotsOptions", "backgroundOptions", …)
 * @param {Object} selectors - Các selector cho phần tử cần thiết.
 * @param {Object} defaults - Các giá trị mặc định (ví dụ: { color: "#ffffff" }).
 */
function setupColorOption(configKey, selectors, defaults) {
    const configObj = op[configKey] = op[configKey] || {};
    
    

    // Nếu có input chọn kiểu (ví dụ select kiểu)
    if (selectors.typeSelect) {
      document.querySelector(selectors.typeSelect).addEventListener("change", function () {
        configObj.type = this.value;
        render();
      });
    }
  
    // Xử lý input màu đơn
    if (selectors.colorInput) {
      document.querySelector(selectors.colorInput).addEventListener("input", function () {
        configObj.color = this.value;
        render();
      });
    }
  
    // Xử lý nút Clear cho màu đơn (nếu có)
    if (selectors.clearButton) {
      document.querySelector(selectors.clearButton).addEventListener("click", function () {
        const defaultColor = defaults && defaults.color ? defaults.color : "#ffffff";
        const colorEl = document.querySelector(selectors.colorInput);
        colorEl.value = defaultColor;
        configObj.color = defaultColor;
        render();
      });
    }
  
    // Xử lý gradient nếu có
    if (selectors.gradientInputs) {
      const { color1, color2, rotation, gradientTypeRadioLinear } = selectors.gradientInputs;
      const updateGradient = function () {
        // Nếu radio gradient được chọn, cập nhật gradient
        if (document.querySelector(selectors.radioGradient).checked) {
          const rot = parseInt(document.querySelector(rotation).value, 10) || 0;
          configObj.gradient = {
            type: document.querySelector(gradientTypeRadioLinear).checked ? "linear" : "radial",
            colorStops: [
              { offset: 0, color: document.querySelector(color1).value },
              { offset: 1, color: document.querySelector(color2).value }
            ],
            rotation: rot
          };
          console.log(`${configKey} gradient updated:`, configObj.gradient);
        } else {
          delete configObj.gradient;
        }
        render();
      };
  
      document.querySelector(color1).addEventListener("input", updateGradient);
      document.querySelector(color2).addEventListener("input", updateGradient);
      document.querySelector(rotation).addEventListener("input", updateGradient);
    }
  
    // Xử lý chuyển đổi giữa chế độ Single & Gradient
    if (selectors.radioSingle && selectors.radioGradient && selectors.sectionSingle && selectors.sectionGradient) {
      document.querySelector(selectors.radioSingle).addEventListener("change", function () {
        document.querySelector(selectors.sectionSingle).classList.remove("hidden");
        document.querySelector(selectors.sectionGradient).classList.add("hidden");
        delete configObj.gradient;
        render();
      });
  
      document.querySelector(selectors.radioGradient).addEventListener("change", function () {
        document.querySelector(selectors.sectionSingle).classList.add("hidden");
        document.querySelector(selectors.sectionGradient).classList.remove("hidden");
        if (selectors.gradientInputs) {
          // Kích hoạt sự kiện input để cập nhật gradient
          const evt = new Event("input");
          document.querySelector(selectors.gradientInputs.color1).dispatchEvent(evt);
        }
      });
    }
  }
  

// Áp dụng cho Dots Options
setupColorOption("dotsOptions", {
  typeSelect: "#form-dots-type",
  colorInput: "#form-dots-color",
  gradientInputs: {
      color1: "#form-dots-gradient-color1",
      color2: "#form-dots-gradient-color2",
      rotation: "#form-dots-gradient-rotation",
      gradientTypeRadioLinear: "#form-dots-gradient-type-linear"
  },
  radioSingle: "#form-dots-color-type-single",
  radioGradient: "#form-dots-color-type-gradient",
  sectionSingle: ".dots-options.single",
  sectionGradient: ".dots-options.gradient"
}, {
  color: "#6a1a4c"  // Màu mặc định cho dots
});

// Áp dụng cho Background Options (CHỈ CÒN MÀU ĐƠN)
setupColorOption("backgroundOptions", {
  colorInput: "#background-color"
}, {
  color: "#ffffff"  // Màu nền mặc định
});

// Áp dụng cho Corners Square Options
setupColorOption("cornersSquareOptions", {
  typeSelect: "#form-corners-square-type",
  colorInput: "#form-corners-square-color",
  clearButton: "#button-clear-corners-square-color",
  gradientInputs: {
      color1: "#form-corners-square-gradient-color1",
      color2: "#form-corners-square-gradient-color2",
      rotation: "#form-corners-square-gradient-rotation",
      gradientTypeRadioLinear: "#form-corners-square-gradient-type-linear"
  },
  radioSingle: "#form-corners-square-color-type-single",
  radioGradient: "#form-corners-square-color-type-gradient",
  sectionSingle: ".cornersSquareOptions.single",
  sectionGradient: ".cornersSquareOptions.gradient"
}, {
  color: "#ffffff"  // Màu mặc định cho corners square
});

// Áp dụng cho Corners Dot Options
setupColorOption("cornersDotOptions", {
  typeSelect: "#corners-dot-type",
  colorInput: "#corners-dot",
  clearButton: "#button-clear-corners-dot",
  gradientInputs: {
      color1: "#corners-dot-gradient-color1",
      color2: "#corners-dot-gradient-color2",
      rotation: "#corners-dot-gradient-rotation",
      gradientTypeRadioLinear: "#corners-dot-gradient-linear"
  },
  radioSingle: "#corners-dot-single",
  radioGradient: "#corners-dot-gradient",
  sectionSingle: ".corners-dot.single",
  sectionGradient: ".corners-dot.gradient"
}, {
  color: "#000000"  // Màu mặc định cho corners dot
});


  document.addEventListener("DOMContentLoaded", function() {
    // Lấy các input
    const hideBackgroundDotsCheckbox = document.getElementById("form-hide-background-dots");
    const imageSizeInput = document.getElementById("form-image-size");
    const imageMarginInput = document.getElementById("form-image-margin");

    // Kiểm tra biến op trước khi sử dụng
    if (typeof op === "undefined") {
        console.error("Biến 'op' chưa được khai báo!");
        return;
    }

    // 1. Xử lý checkbox "Hide Background Dots"
    if (hideBackgroundDotsCheckbox) {
        hideBackgroundDotsCheckbox.checked = op.imageOptions.hideBackgroundDots;
        hideBackgroundDotsCheckbox.addEventListener("change", function() {
            op.imageOptions.hideBackgroundDots = this.checked;
            render();
        });
    } else {
        console.error("Không tìm thấy phần tử #form-hide-background-dots");
    }

    // 2. Xử lý input "Image Size" (giá trị 0..1)
    if (imageSizeInput) {
        imageSizeInput.value = op.imageOptions.imageSize;
        imageSizeInput.addEventListener("input", function() {
            let val = parseFloat(this.value);
            if (!isNaN(val) && val >= 0 && val <= 1) {
                op.imageOptions.imageSize = val;
                render();
            } else {
                this.value = op.imageOptions.imageSize; // Reset về giá trị hợp lệ
            }
        });
    } else {
        console.error("Không tìm thấy phần tử #form-image-size");
    }

    // 3. Xử lý input "Margin" (giá trị >= 0)
    if (imageMarginInput) {
        imageMarginInput.value = op.imageOptions.margin;
        imageMarginInput.addEventListener("input", function() {
            let val = parseInt(this.value, 10);
            if (!isNaN(val) && val >= 0) {
                op.imageOptions.margin = val;
                render();
            } else {
                this.value = op.imageOptions.margin; // Reset về giá trị hợp lệ
            }
        });
    } else {
        console.error("Không tìm thấy phần tử #form-image-margin");
    }
});

const downloadSaveButton = document.getElementById("btn-dl");
downloadSaveButton.addEventListener("click", async () => {
    const qrElement = document.getElementById("canvas");
    const toggleScan = document.getElementById("toggleScan").checked; // Kiểm tra toggle

    try {
        // Chụp ảnh QR Code
        const canvas = await html2canvas(qrElement, { useCORS: true, allowTaint: false });
        const dataUrl = canvas.toDataURL("image/png");

        // Lấy original URL từ input, nếu trống thì dùng link mặc định
        let originalURL = document.querySelector("#form-data").value.trim();
        if (!originalURL) {
            console.warn("Input trống, sử dụng link mặc định.");
            originalURL = "https://www.facebook.com/fu.jsclub";  
        }

        // Kiểm tra URL hợp lệ
        if (!isValidURL(originalURL)) {
            alert("Vui lòng nhập một URL hợp lệ.");
            return;
        }

        // Nếu tracking được bật, lưu vào Supabase
        if (toggleScan) {
            await saveQRCodeToHistory(dataUrl, originalURL);
        }

        // Tải xuống QR Code
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = "qr-code.png";

        // Kích hoạt download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    } catch (error) {
        console.error("Lỗi khi xử lý QR code:", error);
    }
});
