function testCOCOMO() {

    let Calc_dataObject = new CalcData(); 

    let inputsSF = document.querySelectorAll('[data-ifpugCOCOMO_SF="true"]');
    let inputsEM = document.querySelectorAll('[data-ifpugCOCOMO_EM="true"]');

    let arraySF = new Array(inputsSF.length);
    let arrayEM = new Array(inputsEM.length);

    for (let index = 0; index < inputsSF.length; index++) {
        arraySF[index] = between(1, 5);
    }

    for (let index = 0; index < inputsEM.length; index++) {
        arrayEM[index] = between(1, 5);
    }

    var arrayOutSF = "";
    var arrayOutEM = "";

    for (let index = 0; index < inputsSF.length; index++) {
        arrayOutSF += arraySF[index] + " ";
    }

    for (let index = 0; index < inputsEM.length; index++) {
        arrayOutEM += arrayEM[index] + " ";
    }

    var slocVar = between(500, 2000);

    Calc_dataObject.calcCOCOMO2(arraySF, arrayEM, slocVar);

    let result = Calc_dataObject.resultCOCOMO;

    alert("InDataSF: " + arrayOutSF);
    alert("InDataEM: " + arrayOutEM);
    alert("SLOC/KLOC: " + slocVar);
    alert("OutData: " + result);
};