let data;

// Various utility functions ===========================================================================

// Used for backup data feature where the user can save a local copy of their data as JSON
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Used for load backup feature where the uploaded JSON file is converted into JS Object
async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}

// Converts '2023-12-30' into '30 Dec 2023' format
function dateToString(date) {
    const months = [0, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let [y, m, d] = date.split("-");
    y = parseInt(y, 10);
    m = parseInt(m, 10);
    d = parseInt(d, 10);
    m = months[m]
    const dStr = `${d} ${m} ${y}`;
    return dStr;
}

// Generates a random alpha-numeric string of given length for expense item IDs
function randomString(len) {
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

// Update the expenses data on server
async function updateData() {
    try {
        await fetch('/api/auth/update', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

// =====================================================================================================






// Hide the loading screen when page is fully loaded ====================================================

function hideLoader() {
    const onPageLoad = () => {
        setTimeout(() => {
            document.getElementById("loader_block").style.opacity = 0;
            setTimeout(() => {
                document.getElementById("loader_block").style.display = "none";
            }, 310);
        }, 200);
    };
    if (document.readyState === 'complete') {
        onPageLoad();
    } else {
        window.addEventListener('load', onPageLoad, false);
        return () => window.removeEventListener('load', onPageLoad);
    }
}

hideLoader();

// =====================================================================================================







// Signin and signout logic ============================================================================

const googleAuthBtn = document.getElementById("googleAuthBtn");
const googleAuthText = document.getElementById("googleAuthText");

function handleAuthBtn() {
    if (googleAuthText.innerText === "Signout") window.location.href = "/api/auth/signout";
    else window.location.href = "/api/auth/signin";
}

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check');
        const resData = await response.json();
        if (resData.isLoggedIn) {
            googleAuthText.innerText = "Signout";
            data = resData.data.data;
            dataUpdated();
            return;
        }
    } catch (error) {
        console.log(error);
    }
    googleAuthText.innerText = "Signin with Google";
}

googleAuthBtn.addEventListener("click", handleAuthBtn);
checkAuth();

// =====================================================================================================







// Finance tracking =====================================================================================

const saveRemainingBudgetBtn = document.getElementById("saveRemainingBudgetBtn");
const remainingBudget = document.getElementById("remainingBudget");
const remainingBudgetInput = document.getElementById("remainingBudgetInput");
const totalExpenses = document.getElementById("totalExpenses");
const listBody = document.getElementById("listBody");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const addExpenseName = document.getElementById("addExpenseName");
const addExpenseDate = document.getElementById("addExpenseDate");
const addExpenseCost = document.getElementById("addExpenseCost");

// Set new expense default date as current day
addExpenseDate.valueAsNumber = Date.now() - (new Date()).getTimezoneOffset() * 60000;

// Logic for update button click in set remaining budget
saveRemainingBudgetBtn.addEventListener("click", () => {
    if (googleAuthText.innerText === "Signin with Google") {
        handleAuthBtn();
        return;
    }

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
});

// Logic for add button click in new expense
addExpenseBtn.addEventListener("click", () => {
    if (googleAuthText.innerText === "Signin with Google") {
        handleAuthBtn();
        return;
    }

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


// Update the expense item with the given ID
function updateItem(id) {
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

// Delete the expense item with the given ID
function deleteItem(id) {
    const cost = data.items[id].cost;
    delete (data.items[id]);
    data.remainingBudget += parseInt(cost, 10);
    dataUpdated();
}

// Open the edit mode for the expense item with the given ID
function openEditMode(id) {
    data.items[id].editMode = true;
    dataUpdated();
}

// Update web app with the current instance of data
async function dataUpdated() {
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
        const dateNonEdit = dateToString(item.date);

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

    if (googleAuthText.innerText === "Signout") {
        await updateData();
    }
}

// =====================================================================================================







// Backup and reset functionalities ====================================================================

const resetAllBtn = document.getElementById("resetAllBtn");
const backupDataBtn = document.getElementById("backupDataBtn");
const loadBackupBtn = document.getElementById("loadBackupBtn");
const loadBackupUpload = document.getElementById("loadBackupUpload");

// Send click to a hidden file input on clicking the load backup button
loadBackupBtn.addEventListener("click", () => {
    if (googleAuthText.innerText === "Signin with Google") {
        handleAuthBtn();
        return;
    }
    loadBackupUpload.click();
})

// Set the uploaded JSON file data into the web app
loadBackupUpload.onchange = async (e) => {
    const file = e.target.files[0];
    data = await parseJsonFile(file);
    dataUpdated();
}

// Reset all saved expenses data
resetAllBtn.addEventListener("click", () => {
    if (googleAuthText.innerText === "Signin with Google") {
        handleAuthBtn();
        return;
    }

    data = {
        remainingBudget: 0,
        totalExpenses: 0,
        items: {}
    };
    dataUpdated();
})

// Save the expenses data locally as a JSON file
backupDataBtn.addEventListener("click", () => {
    if (googleAuthText.innerText === "Signin with Google") {
        handleAuthBtn();
        return;
    }

    downloadObjectAsJson(data, "Personal Finance Tracker - Backup");
})

// =====================================================================================================