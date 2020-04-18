'use strict';



//to hide and show the side menu in the mobile view
$(document).ready(()=>{
    $('#hamburgerMenu').hide();
    
    $('#hamburgerBtn').on('click', () => {
        $('#hamburgerMenu').toggle();
    }) 

})
