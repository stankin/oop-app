function load2Form(map) {

    // ["VAF", VAF], ["UFP", UFP], ["DFP", DFP], ["SLOC", SLOC], ["KLOC", KLOC]
    // ["PM", PM], ["TDEV", TDEV]    

    let paramsArray = ["VAF", "UFP", "DFP", "SLOC/KLOC", "PM", "TDEV"];

    let SLOCKLOC;

    if (map.find(item => item[0] == "SLOC")) {
        for (let indexMap = 0; indexMap < map.length; indexMap++) {
            let valueMap = map[indexMap];
            if (valueMap[0] == "SLOC") {
                SLOCKLOC = valueMap[1];
                document.getElementById('SLOC').value = valueMap[1];
            }
            if (valueMap[0] == "KLOC") {
                SLOCKLOC = SLOCKLOC + "/" + valueMap[1];
            }
        }
        map[map.length] = ["SLOC/KLOC", SLOCKLOC];
    }
    for (let index = 0; index < paramsArray.length; index++) {
        for (let indexMap = 0; indexMap < map.length; indexMap++) {
            let valueMap = map[indexMap];
            if (paramsArray[index] == valueMap[0]) {
                document.getElementById(paramsArray[index]).textContent = valueMap[1];
                document.getElementById(paramsArray[index] + '_checkbox').checked = true;
            }
        }
    }
};