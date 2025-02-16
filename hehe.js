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

        // Initially hide the gradient section
        gradientColorSection.classList.add("hidden");
        optionsContainer.style.height = "0px";
        optionsContainer.style.overflow = "hidden";
    }

    // Áp dụng cho tất cả các phần tử
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

    setupColorToggle(
        "background-color-single", 
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
    type: "svg",
    data: "https://www.facebook.com/fu.jsclub",
    image: "https://avatars.githubusercontent.com/u/97457434?s=280&v=4",
    dotsOptions: {
        color: "#4267b2",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#e9ebee",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
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