import { longVariable } from "./variable.js"; 
import { template1 } from "./loginTemplate.js";
console.log(longVariable);

// xu li phan login
const template = template1;
const button = document.querySelector(".button");
button.addEventListener("click", function(){
  if (!document.body.contains(document.querySelector(".modal"))){
    document.body.insertAdjacentHTML("afterbegin", template);
    document.querySelector(".modal").style.opacity = "1";
    document.querySelector(".modal").style.visibility = "visible";
  }else{
    const modal = document.querySelector(".modal");
    modal.parentNode.removeChild(modal);
  }
 
});

document.body.addEventListener("click", function(event){
  console.log(event.target);
  if (event.target.matches(".modal-close")){
      const modal = event.target.parentNode.parentNode;
      modal.parentNode.removeChild(modal);
  }else if(event.target.matches(".modal")){
      event.target.parentNode.removeChild(event.target);
  }
});


// xu li accordion
const accordionHeaders = document.querySelectorAll(".accordion-header");
[...accordionHeaders].forEach((item)=> item.addEventListener("click", handleClickAccordion));
function handleClickAccordion(event){
    // console.log(event.target);
    event.target.nextElementSibling.classList.toggle("is-active");
    const content = event.target.nextElementSibling;
    content.style.height = `${content.scrollHeight}px`;
    if (!content.classList.contains("is-active")){
        content.style.height = "0px";
    }

    const icon = event.target.querySelector(".icon");
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



// xu li tao ra qr code
let op= {
    width: 300,
    height: 300,
    margin: 0,
    type: "svg",
    data: "https://www.facebook.com/fu.jsclub",
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

// Hàm kiểm tra URL hợp lệ
function isValidURL(url) {
  const urlPattern = /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,63}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    return urlPattern.test(url);
  }
  
  render();
  
  var qrCode;
  function render(){
      qrCode = new QRCodeStyling(op);
      let canvasEl = document.querySelector('#canvas');
      canvasEl.innerHTML = '';
      qrCode.append(canvasEl);
      canvasEl.nextElementSibling.innerHTML = `${op.width}px x ${op.height}px`;
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
      op.data = inputValue;
      render();
  });




// xu li phan menu
const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

toggle.addEventListener("click", handleToggleMenu);
function handleToggleMenu(event){
    menu.classList.toggle("is-show");
    toggle.classList.toggle("fa-times");
    toggle.classList.toggle("fa-bars");
}

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


// Xử lý nút Download, chuyển QR code thành hình ảnh và tải xuống
const downloadButton = document.getElementById("btn-dl");
downloadButton.addEventListener("click", () => {
    const qrElement = document.getElementById("canvas");
    // Đặt các options cho html2canvas hỗ trợ CORS
    const options = {
        useCORS: true,
        allowTaint: false
    };
    // Chờ QR code render và đảm bảo hình ảnh đã tải xong
    html2canvas(qrElement, options).then(canvas => {
        const imageURL = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = imageURL;
        downloadLink.download = "qr-code.png";

        // Kích hoạt download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }).catch(error => {
        console.error("Lỗi khi chuyển đổi phần tử thành hình ảnh:", error);
    });
});



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
  
  // Áp dụng cho Background Options
  setupColorOption("backgroundOptions", {
    // Background không có select kiểu, chỉ có màu đơn và gradient
    colorInput: "#background-color",
    gradientInputs: {
      color1: "#background-gradient-color1",
      color2: "#background-gradient-color2",
      rotation: "#background-gradient-rotation",
      gradientTypeRadioLinear: "#background-gradient-linear"
    },
    radioSingle: "#background-color-single",
    radioGradient: "#background-color-gradient",
    sectionSingle: ".background-options.single",
    sectionGradient: ".background-options.gradient"
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
  
    // 1. Xử lý checkbox "Hide Background Dots"
    hideBackgroundDotsCheckbox.addEventListener("change", function() {
      // checkbox => boolean
      op.imageOptions.hideBackgroundDots = this.checked;
      render();
    });
  
    // 2. Xử lý input "Image Size" (giá trị 0..1)
    imageSizeInput.addEventListener("input", function() {
      // parseFloat để chuyển thành số thực
      const val = parseFloat(this.value);
      // Kiểm tra trong khoảng [0..1], nếu cần
      if (val >= 0 && val <= 1) {
        op.imageOptions.imageSize = val;
        render();
      }
    });
  
    // 3. Xử lý input "Margin" (giá trị >= 0)
    imageMarginInput.addEventListener("input", function() {
      const val = parseInt(this.value, 10) || 0;
      if (val >= 0) {
        op.imageOptions.margin = val;
        render();
      }
    });
  });
  