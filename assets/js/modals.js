//Get modal element
var modal = document.getElementById('simpleModal');

//Get main element 
var htmlMain = document.getElementById('main');

// Get inner modal window
var mainModal = document.getElementById('mainModal');

// Get open modal button
var modalBtn = document.getElementById('modalBtn');

// Get close button
var closeBtn = document.getElementsByClassName('closeBtn')[0];
var formExampleData;

$.get('../../formExample.html', function(data) {
    formExampleData = data;
});


// Listen for open click
modalBtn.addEventListener('click', openModal);
// Listen for close click
closeBtn.addEventListener('click', closeModal);
// Listen for outside click
window.addEventListener('click', clickOutside);
// Listen for click and use click to position modal
htmlMain.addEventListener('click', moveModal);

// Function to open modal
function openModal(){
    modal.style.display = 'flex';
    populateModal();
}

function populateModal(){
    mainModal.innerHTML = formExampleData;
    
}

// Function to close modal
function closeModal(){
    modal.style.display = 'none';
}

// Function to close modal if outside click
function clickOutside(e){
    if(e.target == modal){
        modal.style.display = 'none';
    }
    
}

// Function to move modal to area on page clicked
function moveModal(e){
    //var translate3dValue = "translate3d(" + (mouseX -400) + "px," + (mouseY + 400) + "px, 0)";
    //innerModal.style.transform = translate3dValue;
}