function addRowUFP() {

    let divClass = ["col-xl-2", "col-xl-4", "col-xl-3", "col-xl-3"];
    let labelValue = ["Номер формы", "Наименование", "Количество форм", "Количество данных"];
    let inputName = ["numberForm", "nameForm", "countForm", "countData"];
    let inputPlaceholder = ["А0-А4", "Введите название", "Значение", "Значение"];
    let spanText = ["Например, А0", "Например, управлять пользователями", "Например, 2", "Например, 5"];

    let mainDiv = document.createElement("div");
    mainDiv.className = "row";


    for(let index = 0; index < 4; index++) {
        let columnDiv = document.createElement("div");
        columnDiv.className = divClass[index];
        let columnContentDiv = document.createElement("div");
        columnContentDiv.className = "form-group fv-plugins-icon-container";
            let labelName = document.createElement('label');
            labelName.textContent = labelValue[index];
            
            let inputParam = document.createElement("input");
            inputParam.type = "text";
            inputParam.className = "form-control form-control-solid form-control-lg";
            inputParam.name = inputName[index];
            inputParam.placeholder= inputPlaceholder[index];

            let spanLearn = document.createElement("span");
            spanLearn.className = "form-text text-muted";
            spanLearn.textContent = spanText[index];

            let divXZ = document.createElement("div");
            divXZ.className = "fv-plugins-message-container";

            columnContentDiv.append(labelName);
            columnContentDiv.append(inputParam);
            columnContentDiv.append(spanLearn);
            columnContentDiv.append(divXZ);
        
        columnDiv.append(columnContentDiv);
        mainDiv.append(columnDiv);
    }

    document.getElementById("tableUFP").append(mainDiv);
}
