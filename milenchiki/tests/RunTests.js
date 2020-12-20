function RunTests() {
    var test1 = document.createElement("button");
    var test2 = document.createElement("button");
    var test3 = document.createElement("button");
    var test4 = document.createElement("button");

    test1.id = "test1";
    test1.type = "reset";
    test1.className = "btn btn-success mr-2";
    test1.style = "background: #0bb783";
    test1.innerText = "testFPA";

    test2.id = "test2";
    test2.type = "reset";
    test2.className = "btn btn-success mr-2";
    test2.style = "background: #0bb783";
    test2.innerText = "testCOCOMO";

    test3.id = "test3";
    test3.type = "reset";
    test3.className = "btn btn-success mr-2";
    test3.style = "background: #0bb783";
    test3.innerText = "testCalcCOCOMO";

    test4.id = "test4";
    test4.type = "reset";
    test4.className = "btn btn-success mr-2";
    test4.style = "background: #0bb783";
    test4.innerText = "testCalcFPA";

    document.body.appendChild(test1);
    document.body.appendChild(test2);
    document.body.appendChild(test3);
    document.body.appendChild(test4);

    var test1F = document.getElementById('test1');
    test1F.addEventListener('click', testFPA, false);
    var test2F = document.getElementById('test2');
    test2F.addEventListener('click', testCOCOMO, false);
    var test3F = document.getElementById('test3');
    test3F.addEventListener('click', testCalcCOCOMO, false);
    var test4F = document.getElementById('test4');
    test4F.addEventListener('click', testCalcFPA, false);
}