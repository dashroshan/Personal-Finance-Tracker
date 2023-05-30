let data;

const saveRemainingBudgetBtn = document.getElementById("saveRemainingBudgetBtn");
const remainingBudget = document.getElementById("remainingBudget");
const remainingBudgetInput = document.getElementById("remainingBudgetInput");
const totalExpenses = document.getElementById("totalExpenses");
const listBody = document.getElementById("listBody");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const addExpenseName = document.getElementById("addExpenseName");
const addExpenseDate = document.getElementById("addExpenseDate");
const addExpenseCost = document.getElementById("addExpenseCost");

addExpenseDate.valueAsNumber = Date.now() - (new Date()).getTimezoneOffset() * 60000;

const resetAllBtn = document.getElementById("resetAllBtn");
const backupDataBtn = document.getElementById("backupDataBtn");
const loadBackupBtn = document.getElementById("loadBackupBtn");
const loadBackupUpload = document.getElementById("loadBackupUpload");

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}

function randomString(len) {
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

saveRemainingBudgetBtn.addEventListener("click", () => {
    remainingBudgetAmount = parseInt(remainingBudgetInput.value, 10);
    if (remainingBudgetAmount < 0 || !remainingBudgetAmount) {
        document.getElementById("setBudgetError").style.display = "block";
        setTimeout(() => {
            document.getElementById("setBudgetError").style.display = "none";
        }, 1500);
        return;
    }

    data.remainingBudget = remainingBudgetAmount;
    dataUpdated();
})

resetAllBtn.addEventListener("click", () => {
    data = {
        remainingBudget: 0,
        totalExpenses: 0,
        items: {}
    };
    dataUpdated();
})

backupDataBtn.addEventListener("click", () => {
    downloadObjectAsJson(data, "Personal Finance Tracker - Backup");
})

loadBackupBtn.addEventListener("click", () => {
    loadBackupUpload.click();
})

loadBackupUpload.onchange = async (e) => {
    const file = e.target.files[0];
    data = await parseJsonFile(file);
    dataUpdated();
}

addExpenseBtn.addEventListener("click", () => {
    const itemData = {
        id: randomString(15),
        date: addExpenseDate.value,
        cost: parseInt(addExpenseCost.value, 10),
        name: addExpenseName.value,
        editMode: false
    };

    if (itemData.cost < 0 || !itemData.cost || !itemData.name) {
        document.getElementById("setExpenseError").style.display = "block";
        setTimeout(() => {
            document.getElementById("setExpenseError").style.display = "none";
        }, 1500);
        return;
    }

    data.items[randomString(15)] = itemData;
    data.remainingBudget -= parseInt(addExpenseCost.value, 10);
    data.remainingBudget = data.remainingBudget > 0 ? data.remainingBudget : 0;
    dataUpdated();
})

const deleteItem = (id) => {
    delete (data.items[id]);
    dataUpdated();
}

const updateItem = (id) => {
    const cost = parseInt(document.getElementById("itemValCost" + id).value, 10);
    const name = document.getElementById("itemValName" + id).value;
    const date = document.getElementById("itemValDate" + id).value;

    const oldCost = data.items[id].cost;

    data.items[id] = {
        date: date,
        cost: cost,
        name: name,
        editMode: false
    };

    data.remainingBudget -= parseInt(cost - oldCost, 10);
    data.remainingBudget = data.remainingBudget > 0 ? data.remainingBudget : 0;

    dataUpdated();
}

const openEditMode = (id) => {
    data.items[id].editMode = true;
    dataUpdated();
}


const dataUpdated = () => {
    let listBodyContent = "";
    let dataItemsToList = []

    let totalCost = 0
    for (const [key, value] of Object.entries(data.items)) {
        dataItemsToList.push({ ...value, id: key });
        totalCost += value.cost;
    }
    data.totalExpenses = totalCost;

    remainingBudget.innerText = data.remainingBudget + " Rs";
    totalExpenses.innerText = data.totalExpenses + " Rs";

    dataItemsToList.sort((a, b) => {
        if (a.date > b.date) return -1;
        else if (a.date < b.date) return 1;
        else return 0;
    })

    for (let item of dataItemsToList) {
        const costEdit = `<input id="itemValCost${item.id}" type="text" value="${item.cost}">`;
        const costNonEdit = `<b>${item.cost}</b>`;

        const nameEdit = `<input id="itemValName${item.id}" type="text" value="${item.name}"/>`;
        const nameNonEdit = item.name;

        const dateEdit = `<input id="itemValDate${item.id}" type="date" value="${item.date}" />`;
        const dateNonEdit = "30 May 2023";

        const editSaveBtn = item.editMode ? `updateItem('${item.id}')` : `openEditMode('${item.id}')`;

        listBodyContent += `
        <tr>
            <td>
                <div class="tableBtns">
                    <button onclick="${editSaveBtn}"><img src="./assets/${item.editMode ? 'saveWhite' : 'edit'}.svg"></button>
                    <button onclick="deleteItem('${item.id}')"><img src="./assets/delete.svg"></button>
                </div>
            </td>
            <td>${item.editMode ? dateEdit : dateNonEdit}</td>
            <td>${item.editMode ? costEdit : costNonEdit}</td>
            <td>${item.editMode ? nameEdit : nameNonEdit}</td>
        </tr > `;
    }

    listBody.innerHTML = listBodyContent;

    localStorage.setItem('personalFinanceTrackerData', JSON.stringify(data));
}

const oldData = localStorage.getItem('personalFinanceTrackerData');
if (oldData) {
    data = JSON.parse(oldData);
    dataUpdated();
}
else {
    data = {
        remainingBudget: 0,
        totalExpenses: 0,
        items: {}
    };
    localStorage.setItem('personalFinanceTrackerData', JSON.stringify(data));
    dataUpdated();
}
