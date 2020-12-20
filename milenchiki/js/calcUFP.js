function calcUFP(inputsForm, inputsData) {

    // Переключение на вкладку расчета FPA
    document.getElementById("tabUFP").className = "nav-link py-2 px-4";
    document.getElementById("tabFPA").className = "nav-link py-2 px-4 active";

    document.getElementById("kt_tab_pane_11_4").className = "tab-pane fade";
    document.getElementById("kt_tab_pane_11_1").className = "tab-pane fade active show";
    //////////////////////////////////////
    const FORM_MULTIPLIER = 4;
    const DATA_MULTIPLIER = 7;

    let Calc_dataObject = new CalcData(); 

    let arrayUFP = new Array();
    for ( let index = 0; index < inputsData.length; index++) {
        if(inputsForm[index].calue != "" && inputsData[index].value != "") {
            arrayUFP[arrayUFP.length] = inputsForm[index].value * FORM_MULTIPLIER + inputsData[index].value * DATA_MULTIPLIER;
        }
    }

    Calc_dataObject.calcUFP(arrayUFP);

    let result = Calc_dataObject.resultUFP;

    return result;
}