let data = {
    remainingBudget: 5000,
    totalExpenses: 10000,
    items: {
        "abcd123": {
            date: "2023-05-30",
            cost: 5000,
            name: "Smart watch",
            editMode: false
        },
        "abcd124": {
            date: "2023-05-30",
            cost: 50000,
            name: "Laptop",
            editMode: true
        }
    }
};

const saveRemainingBudgetBtn = document.getElementById("saveRemainingBudgetBtn");
const remainingBudget = document.getElementById("remainingBudget");
const remainingBudgetInput = document.getElementById("remainingBudgetInput");
const totalExpenses = document.getElementById("totalExpenses");
const listBody = document.getElementById("listBody");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const addExpenseName = document.getElementById("addExpenseName");
const addExpenseDate = document.getElementById("addExpenseDate");
const addExpenseCost = document.getElementById("addExpenseCost");

const resetAllBtn = document.getElementById("resetAllBtn");

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
    data.remainingBudget = remainingBudgetInput.value;
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

addExpenseBtn.addEventListener("click", () => {
    const itemData = {
        id: randomString(15),
        date: addExpenseDate.value,
        cost: parseInt(addExpenseCost.value, 10),
        name: addExpenseName.value,
        editMode: false
    };

    data.items[randomString(15)] = itemData;
    dataUpdated();
})

const deleteItem = (id) => {
    delete (data.items[id]);
    dataUpdated();
}


const dataUpdated = () => {
    remainingBudget.innerText = data.remainingBudget + " Rs";
    totalExpenses.innerText = data.totalExpenses + " Rs";

    let listBodyContent = "";
    let dataItemsToList = []

    for (const [key, value] of Object.entries(data.items)) {
        dataItemsToList.push({ ...value, id: key });
    }

    dataItemsToList.sort((a, b) => {
        if (a.date > b.date) return -1;
        else if (a.date < b.date) return 1;
        else return 0;
    })

    for (let item of dataItemsToList) {
        const costEdit = `<input type="text" value="${item.cost}">`;
        const costNonEdit = `<b>${item.cost}</b>`;

        const nameEdit = `<input type="text" value="${item.name}"/>`;
        const nameNonEdit = item.name;

        const dateEdit = `<input type="date" value="${item.date}" />`;
        const dateNonEdit = "30 May 2023";

        listBodyContent += `
        <tr id="item${item.id}}">
            <td>
                <div class="tableBtns">
                    <button onclick="deleteItem('${item.id}')"><img src="./assets/${item.editMode ? 'saveWhite' : 'edit'}.svg"></button>
                    <button onclick="deleteItem('${item.id}')"><img src="./assets/delete.svg"></button>
                </div>
            </td>
            <td>${item.editMode ? dateEdit : dateNonEdit}</td>
            <td>${item.editMode ? costEdit : costNonEdit}</td>
            <td>${item.editMode ? nameEdit : nameNonEdit}</td>
        </tr > `;
    }

    listBody.innerHTML = listBodyContent;
}

dataUpdated();