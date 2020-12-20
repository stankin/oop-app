function calcCOCOMO(inputsSF,inputsEM,SLOC) {

    let Calc_dataObject = new CalcData();

    let arraySF = new Array(inputsSF.length);
    for (let index = 0; index < inputsSF.length; index++) {
        arraySF[index] = inputsSF[index].value * 1;
    }

    let arrayEM = new Array(inputsEM.length);
    for (let index = 0; index < inputsEM.length; index++) {
        arrayEM[index] = inputsEM[index].value * 1;
    }

    Calc_dataObject.calcCOCOMO2(arraySF, arrayEM, SLOC);

    let result = Calc_dataObject.resultCOCOMO;

    return result;
};