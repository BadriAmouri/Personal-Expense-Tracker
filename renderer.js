class ExpenseManager {
    async addExpense(name, price) {
        const { id } = await window.api.addExpense(name, price);
        return { id, name, price };
    }

    async deleteExpense(id) {
        const changes = await window.api.deleteExpense(id);
        return changes;
    }

    async getExpenses() {
        const expenses = await window.api.getExpenses();
        return expenses;
    }
}

class UIManager {
    constructor() {
        this.addExpenseBtn = document.getElementById('addExpenseBtn');
        this.expenseInput = document.getElementById('expense');
        this.priceInput = document.getElementById('price');
        this.expenseTable = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
        this.totalLabel = document.getElementById('total');
        this.expenseManager = new ExpenseManager();

        this.addExpenseBtn.addEventListener('click', () => this.handleAddExpense());
        document.addEventListener('DOMContentLoaded', () => this.loadInitialExpenses());  // Ensure expenses load on window load
    }

    async loadInitialExpenses() {
        window.api.loadExpenses((event, expenses) => {
            expenses.forEach(expense => {
                this.addExpenseToTable(expense.id, expense.name, expense.price);
            });
            this.updateTotal();
        });
    }

    async handleAddExpense() {
        const expenseName = this.expenseInput.value.trim();
        const priceText = this.priceInput.value.trim();

        if (expenseName && priceText && !isNaN(priceText)) {
            const price = parseFloat(priceText);

            if (price > 0) {
                const { id } = await this.expenseManager.addExpense(expenseName, price);
                this.addExpenseToTable(id, expenseName, price);

                // Clear input fields
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
        priceCell.innerText = price.toFixed(2);
        deleteCell.innerHTML = '<button class="delete-btn">Delete</button>';

        deleteCell.querySelector('.delete-btn').addEventListener('click', async () => {
            await this.expenseManager.deleteExpense(id);
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
                total += parseFloat(priceCell.innerText);
            }
        }
        this.totalLabel.innerText = total.toFixed(2);
    }
}

// Initialize the UIManager
new UIManager();
