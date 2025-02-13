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

// xu li phan login
/*
    <div class="modal">
        <div class="modal-content">
            <i class="fa fa-times modal-close"><i>
        <div>
    <div>
 */

    const template = `<div class="modal">
    <div class="modal-content">
      <i class="fa fa-times modal-close"></i>
    </div>
  </div>`;
const button = document.querySelector(".button");
button.addEventListener("click", function(){
  document.body.insertAdjacentHTML("afterbegin", template);
});

document.body.addEventListener("click", function(event){
  console.log(event.target);
  if (event.target.matches(".modal-close")){
      // handle close modal here
      const modal = event.target.parentNode.parentNode;
      modal.parentNode.removeChild(modal);
  }else if(event.target.matches(".modal")){
      // const modal = document.querySelector(".modal");
      // modal.parentNode.removeChild(modal);
      event.target.parentNode.removeChild(event.target);
  }
});