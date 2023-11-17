const myForm = document.forms.user_form;

const street = myForm.elements.street;
const suburb = myForm.elements.suburb;
const postcode = myForm.elements.postcode;
const dob = myForm.elements.dob;
const building = myForm.elements.building;

const f1 = myForm.elements.f1;
const f2 = myForm.elements.f2;
const f3 = myForm.elements.f3;
const f4 = myForm.elements.f4;

const select_button = myForm.elements.select;

const date_pattern = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

function street_ok(){
    return (street.value).length > 3 && (street.value).length < 50;
}

function suburb_ok(){
    return (suburb.value).length > 3 && (suburb.value).length < 50;
}

function postcode_ok(){
    return (postcode.value).length == 4 && !isNaN(postcode.value);
}

function dob_ok(){ 
    return date_pattern.test(dob.value);
}

function all_ok(){
    return street_ok() && suburb_ok() && postcode_ok() && dob_ok();
}

function calc_age(){
    var m = new Date(dob.value).getMonth()+1
    var d = new Date(dob.value).getDate()
    var y = new Date(dob.value).getFullYear()
    var fixed_date = d + "/" + m + "/" + y
    var d1 = new Date();
    var d2 = new Date(fixed_date)
    return Math.floor((((d1 - d2)/1000 )/86400)/365)
}

function output(){
    var bstring = ""
    if (building.value == "apartment"){
        bstring = "an " + building.value
    } else {
        bstring = "a " + building.value
    }
  
    checkboxes = myForm.querySelectorAll('input[type=checkbox]:checked')
    var features = ""

    if (checkboxes.length == 0){
        features = "no features"
    } 
    else if (checkboxes.length == 1){
        features = checkboxes[0].value
    } 
    else {
        for (var i = 0; i < checkboxes.length; i++){
            console.log(checkboxes[i].value)
            if (i == checkboxes.length - 2){
                features = features + checkboxes[i].value + " and ";
            }
            else {
                features = features + checkboxes[i].value + ", ";
            }
            
        }
        features = features.slice(0, -2) 
        console.log(features)
    }

    return "Your are " + calc_age() + " years old, and your address is " + street.value + " St, " + suburb.value + ", " + postcode.value + ", " + "Australia. Your building is " + bstring + ", and it has " + features;
}

street.addEventListener('blur', (event) => {  
    if (all_ok()){
            myForm.elements.output.value = output();
    }
    else if (!street_ok())  {
        myForm.elements.output.value = "Please input a valid street name";
    } 

})

suburb.addEventListener('blur', (event) => {  
    if (all_ok()){
        myForm.elements.output.value = output();
    }
    else if (street_ok() && !suburb_ok()) {
        myForm.elements.output.value = "Please input a valid suburb";
    } 
    
})


postcode.addEventListener('blur', (event) => { 
    if (all_ok()){
            myForm.elements.output.value = output();
    }
    else if (street_ok() && suburb_ok() && !postcode_ok() ) {
        myForm.elements.output.value = "Please input a valid postcode";
    }  

})

dob.addEventListener('blur', (event) => {   
    if (all_ok()){
        myForm.elements.output.value = output();
    }
    else if (street_ok() && suburb_ok() && postcode_ok() && !dob_ok()) {
        myForm.elements.output.value = "Please input a valid date of birth"; 
    }
})


building.addEventListener('change', (event) => {
    if (all_ok()){
        myForm.elements.output.value = output();
    }
})

f1.addEventListener('change', (event) => {
    console.log(f1.value)
    console.log(f1.checked)

    if (all_ok()){
        myForm.elements.output.value = output();
    }
})

f2.addEventListener('change', (event) => {

    if (all_ok()){
        myForm.elements.output.value = output();
    }

})

f3.addEventListener('change', (event) => {


    if (all_ok()){
        myForm.elements.output.value = output();
    }
})

f4.addEventListener('change', (event) => {

    if (all_ok()){
        myForm.elements.output.value = output();
    }
})

select_button.addEventListener('click', (event) => {

    checkboxes = myForm.querySelectorAll('input[type=checkbox]:checked')
    if (checkboxes.length == 4){
        f1.checked = false
        f2.checked = false
        f3.checked = false
        f4.checked = false
    } else {
        f1.checked = true
        f2.checked = true
        f3.checked = true
        f4.checked = true
    }

    if (all_ok()){
        myForm.elements.output.value = output();
    }

    event.preventDefault();
})







