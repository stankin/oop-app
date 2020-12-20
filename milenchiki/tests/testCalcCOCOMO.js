function testCalcCOCOMO() {

    let inputsSF = document.querySelectorAll('[data-ifpugCOCOMO_SF="true"]');
    let inputsEM = document.querySelectorAll('[data-ifpugCOCOMO_EM="true"]');

    for (let index = 0; index < inputsSF.length; index++) {
        inputsSF[index].value = inputsSF[index].value;
    }

    for (let index = 0; index < inputsEM.length; index++) {
        inputsEM[index].value = between(1, 5);
    }

    var arrayOutSF = "";
    var arrayOutEM = "";

    for (let index = 0; index < inputsSF.length; index++) {
        arrayOutSF += inputsSF[index].value + " ";
    }

    for (let index = 0; index < inputsEM.length; index++) {
        arrayOutEM += inputsEM[index].value + " ";
    }

    var slocVar = between(500, 2000);

    let result = calcCOCOMO(inputsSF, inputsEM, slocVar);

    alert("InDataSF: " + arrayOutSF);
    alert("InDataEM: " + arrayOutEM);
    alert("SLOC/KLOC: " + slocVar);
    alert("OutData: " + result);
};