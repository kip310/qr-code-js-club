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