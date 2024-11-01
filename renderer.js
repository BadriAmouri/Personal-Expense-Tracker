class UIManager {
    constructor() {
        this.addExpenseBtn = document.getElementById('addExpenseBtn');
        this.expenseInput = document.getElementById('expense');
        this.priceInput = document.getElementById('price');
        this.expenseTable = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
        this.totalLabel = document.getElementById('total');

        this.addExpenseBtn.addEventListener('click', () => this.handleAddExpense());
        document.addEventListener('DOMContentLoaded', () => this.loadInitialExpenses());
    }
    loadInitialExpenses() {
        window.api.loadExpenses((event, expenses) => {
            console.log('Fetched expenses from the API:', expenses); // Log fetched expenses
            expenses.forEach(expense => {
                this.addExpenseToTable(expense.id, expense.name, expense.price);
            });
            this.updateTotal();
        });
    }



    async handleAddExpense() {
        const expenseName = this.expenseInput.value.trim();
        const priceText = this.priceInput.value.trim();

        console.log('Adding expense:', expenseName, priceText); // Debugging output
        debugger; // Pause execution for debugging

        if (expenseName && priceText && !isNaN(priceText)) {
            const price = parseFloat(priceText);

            if (price > 0) {
                const { id } = await window.api.addExpense(expenseName, price);
                this.addExpenseToTable(id, expenseName, price);

                this.expenseInput.value = '';
                this.priceInput.value = '';

                this.updateTotal();
            } else {
                alert('Price must be a positive number.');
            }
        } else {
            alert('Please enter a valid expense name and price.');
        }
    }

    addExpenseToTable(id, expenseName, price) {
        const newRow = this.expenseTable.insertRow();
        newRow.dataset.id = id;
        const expenseCell = newRow.insertCell(0);
        const priceCell = newRow.insertCell(1);
        const deleteCell = newRow.insertCell(2);

        expenseCell.innerText = expenseName;
        priceCell.innerText = price.toFixed(2); // Ensure price is formatted correctly
        deleteCell.innerHTML = '<button class="delete-btn">Delete</button>';

        deleteCell.querySelector('.delete-btn').addEventListener('click', async () => {
            console.log('Deleting expense with id:', id); // Debugging output
            await window.api.deleteExpense(id);
            newRow.remove();
            this.updateTotal();
        });
    }

    updateTotal() {
        let total = 0;
        const rows = this.expenseTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const priceCell = rows[i].getElementsByTagName('td')[1];
            if (priceCell) {
                const price = parseFloat(priceCell.innerText); // Ensure we parse the price correctly
                console.log('Price in row:', price); // Debugging output
                if (!isNaN(price)) {
                    total += price; // Only add if it's a valid number
                }
            }
        }
        console.log('Total expenses:', total); // Debugging output
        this.totalLabel.innerText = total.toFixed(2);
    }

}

new UIManager();
