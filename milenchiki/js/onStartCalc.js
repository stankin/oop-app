
function onStartCalc(nameMethod) {

    let isAllEnter = true;
    let result = undefined;

    let paramsArray = ["VAF", "UFP", "DFP", "SLOC/KLOC", "PM", "TDEV"];
    for (let index = 0; index < paramsArray.length; index++) {
        document.getElementById(paramsArray[index] + '_checkbox').checked = false;
    }
    if (nameMethod == 'UFP') {
        let inputsForm = document.getElementsByName("countForm");
        let inputsData = document.getElementsByName("countData");

        result = calcUFP(inputsForm, inputsData);
    }
    else if (nameMethod == 'FPA') {
        let inputsFPA = document.querySelectorAll('[data-ifpugFPA="true"]');
        let language = document.getElementById("language").value;
        let UFP = document.getElementById('UFP').innerHTML;

        inputsFPA.forEach(function (item, i, arr) {
            if (item.value == "") {
                isAllEnter = false;
            }
        });
        if (UFP == "Результат будет тут") {
            var UFPEnterValue = prompt("Рассчитайте значение UFP\r\nИли введите его в поле ниже", "Сюда");
            if (isNaN(UFPEnterValue * 1)) {
                return;
            }
            if (UFPEnterValue == null) {
                return;
            }
            else {
                document.getElementById('UFP').innerHTML = UFPEnterValue;
                UFP = UFPEnterValue;
            }
        }
        if (isAllEnter) {
            result = calcFPA2(inputsFPA, language, UFP * 1);
        }
    }
    else if (nameMethod == 'COCOMO') {
        let inputsSF = document.querySelectorAll('[data-ifpugCOCOMO_SF="true"]');
        let inputsEM = document.querySelectorAll('[data-ifpugCOCOMO_EM="true"]');
        let SLOC = document.getElementById('SLOC').value;

        inputsSF.forEach(function (item, i, arr) {
            if (item.value == "") {
                isAllEnter = false;
            }
        });

        inputsEM.forEach(function (item, i, arr) {
            if (item.value == "") {
                isAllEnter = false;
            }
        });
        if (isAllEnter) {
            result = calcCOCOMO(inputsSF, inputsEM, SLOC);
        }
    }


    try {
        load2Form(result);
    }
    catch (err) {
        alert("Заполните все поля!")
    }
};
