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
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAEYCAIAAAAI7H7bAAA/ZklEQVR4nOydd1wURxvHZ3fvKApIFwsgWFBBAVGwixpbFCWCwaiJHctrjWI32LAbNcbEjhIRFUuwd4ogImpABbEhXelNypXdeT/HISLsHXvHwiE33+QPnJudefZufzv9eTgQQoBAIGoHrmgDEIjGABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAtwFG2AUiLgl/+BE4AgFGwMgg2QkOqSD2nUgzD49jV8GQOzM2FcLMzKxSjySz8AAggBptEU69ABtDbFjE3wbvZ4/37A0EixhiNkBYMQKtqGxgN89RK+fQOfPqaeRMJnUTA/D8Nl7zxTFDBsjnWyxHv2wXrYY6ZmmHnbOjEXwR5ISGxQUkweOUj5+8GY50AO5UiHovBBQ/BfpuOjnACGxrQNFCSkWlBSQl4JoAIuwlvXAKTqti4Igb4h7jSG+OkXrJtd3daFkB0kJLnIzydPHid37wD5ufVdNYRYuw744uWE20/1XTVCMkhIMkMePkBuWANKSxRrBmbZlfPnIcyqi2LNQIhBQpIB6uol4SZP8OYVwDBF2yICUpBwHkus2YiZmSnaFmUHCYkZaamCtStgwPkGIqHKQIri/LaRWLhU0YYoNUhINUNduyxcMBvk5ynaEMlACCytObv24t3tFW2KkoKEJBVICT0WU96HAd7gGiIacJw4dooY6aRoO5QRJCTJpKcLZvwCH4Yq2g5ZwDB87kLO8tVAvYmiTVEukJDooe7cFM6cAj4VKNoQubDqqvLPWdDaWNF2KBFISDRQIYHCn91AcZGiDakFhkYqgeHA0FDRdigLaMtJVUjvo0I3529bRQCAjI/8McOpiAeKtkNZQC3SV1ABF4XTJn4bUwtMwHFOwE28Z29F29H4QUL6AnX7lnD6RFBS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nrNuCz5sBJNy8G7dQWsTkJZSvqpBS5UdatW/EynBniEUbvCkvA8DHMOGjeL8JkN8ddapv712fB01wCGgkKz63VWYUvbocC5ex/v2p/k4J5tvb43Zdece8wVNm1b/XLjVi9q1GXMczPW/RG9B2d5kmuQbV4VrlgN1dWLWPGLSZPpL794mt26A/z0p/6VbtOKevoB1lthNpaGkmN/JDBR9qmISpCDWvDnWsTPQaIZxCcAhxDusIU8IhHyY+B7Gv8P4vHLLu9iqBIZ9VcLzaP7AXjTPn6ER54gP3quPDBZ+RjBmOHxwv2oqhPjchZwVa0ATmi9fEmTARXLaRIBjop4PSWL2vXAbW8y2O+CqYE2bAIIo2xBMVHwb4JPo+4ECASgpFacRQ4cDTU3awoWbN1K7t4pef2PHcQ8cF9WiQOqt7SvVVeNZmFBvJS65iDoA2qqwsFBSBunT4oIFs8vad49aW/q5usePhLt38J1H8FrqfO7VqPFHDBJeOCdngU8fCyaOE8ycLNy5lbx1AybEy3a9QEBXKCnqClbqd/HtuwrPnJLPQjHCkz5f9b7aNBesXSn3IJ56/44MDYG5ObUxqSrZWfyfXERGtm1NXrrIZsnyUo+zdj7HRKNMyQg8V5G12P0pGoPpqZO3b8hdQhVKDTRFP5WOGq9tS/5PLsJDf1OJCWwVziYZ6bw+diJTe3QRXpY2Zc8cwdZN5YdtVyyRYfasfuDxeF3aicaTv4xnYUGMJRqPXzt+Lxu8dz/Orpo31zEEvoyFmel4V1ugzbJ7W/YpLKSeRuIDBtLsYJQX+DoOaGjWPIla71D3gwVjRnCWryKWr1G0LV9oPEKCKSlYLcKSIxC1ofEICYFQII3Qrx0CUf8gISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwABISAsECSEgIBAsgISEQLICEhECwwP8DAAD//xnPeLYRoqXTAAAAAElFTkSuQmCC',
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


// xu li nhap vao data(link)
const textData = document.querySelector("#form-data");
textData.addEventListener("keyup", e=>{
    op.data = e.target.value;
    render();
})

// xu li phan login
    const template = `<div class="modal">
    <div class="modal-content">
      <i class="fa fa-times modal-close"></i>
    </div>
  </div>`;
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
fileInput.addEventListener("change", e=>{
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = ()=> {
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
  