function Download() {
    document.querySelector('[id="downlLink"]').innerHTML = "";

    let inputsNumberForm = document.getElementsByName("numberForm");
    let inputsNameForm = document.getElementsByName("nameForm");
    let inputsCountForm = document.getElementsByName("countForm");
    let inputsCountData = document.getElementsByName("countData");

    let inputsFPA = document.querySelectorAll('[data-ifpugFPA="true"]');
    let language = document.getElementById("language");

    let inputsSF = document.querySelectorAll('[data-ifpugCOCOMO_SF="true"]');
    let inputsEM = document.querySelectorAll('[data-ifpugCOCOMO_EM="true"]');

    let SLOC = document.getElementById('SLOC').value;
    let VAF = document.getElementById('VAF').innerHTML;
    let UFP = document.getElementById('UFP').innerHTML;
    let DFP = document.getElementById('DFP').innerHTML;
    if (document.getElementById('SLOC/KLOC').innerHTML != "")
        SLOC = document.getElementById('SLOC/KLOC').innerHTML;
    let PM = document.getElementById('PM').innerHTML;
    let TDEV = document.getElementById('TDEV').innerHTML;

    var textOut = "";

    textOut += "Данные расчета UFP:" + "\r\n";
    for (let index = 0; index < inputsNumberForm.length; index++) {
        textOut += inputsNumberForm[index].value + "; " + inputsNameForm[index].value + "; " + inputsCountForm[index].value + "; " + inputsCountData[index].value + ";" + "\r\n";
    }
    textOut += "\r\n";
    
    textOut += "Данные метода FPA/IFPUG:" + "\r\n";
    for (let index = 0; index < inputsFPA.length; index++) {
        textOut += inputsFPA[index].getAttribute("name") + "; " + inputsFPA[index].value + ";" + "\r\n";
    }
    textOut += language.getAttribute("name") + "; " + language.value + ";" + "\r\n";
    textOut += "\r\n";
    
    textOut += "Метод COCOMO 2" + "\r\n";
    textOut += "Факторы масштаба SF:" + "\r\n";
    for (let index = 0; index < inputsSF.length; index++) {
        textOut += inputsSF[index].getAttribute("name") + "; " + inputsSF[index].value + ";" + "\r\n";
    }
    textOut += "\r\n";
    textOut += "Параметры трудоемкости:" + "\r\n";
    for (let index = 0; index < inputsEM.length; index++) {
        textOut += inputsEM[index].getAttribute("name") + "; " + inputsEM[index].value + ";" + "\r\n";
    }
    textOut += "\r\n";

    textOut += "Результаты расчетов:" + "\r\n";
    textOut += "Фактор выравнивания; " + VAF + ";" + "\r\n";
    textOut += "Количество не выровненных функциональных точек; " + UFP + ";" + "\r\n";
    textOut += "Проект разработки продукта; " + DFP + ";" + "\r\n";
    textOut += "Количество строк кода; " + SLOC + ";" + "\r\n";
    textOut += "Суммарная трудоемкость проекта; " + PM + ";" + "\r\n";
    textOut += "Длительность проекта; " + TDEV + ";" + "\r\n";

    let element = document.createElement('a');
    element.hidden = "hidden";
    element.innerHTML = "";
    element.id = "downl";
    element.href = "data:text/plain;charset=utf-8," + textOut;
    element.download = "file.csv";
    document.querySelector('[id="downlLink"]').append(element);
    var b = document.getElementById('downl');
    b.click();
}