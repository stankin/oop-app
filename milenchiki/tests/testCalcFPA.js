function testCalcFPA() {

    let inputsFPA = document.querySelectorAll('[data-ifpugFPA="true"]');

    for (let index = 0; index < inputsFPA.length; index++) {
        inputsFPA[index].value = between(1, 5);
    }

    var arrayOut = "";

    for (let index = 0; index < inputsFPA.length; index++) {
        arrayOut += inputsFPA[index].value + " ";
    }

    let result = calcFPA2(inputsFPA, "Assembly", 11);

    alert("InData: " + arrayOut);
    alert("OutData: " + result);
};