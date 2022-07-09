let db;

const request = indexDB.open('budget', 1);

request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine) {
    sendTransaction();
  }
}

request.onerror = function(event) {
  console.log(event.target.errorCode);
}

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
}

function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjStore = transaction.createObjectStore('new_transaction');
    budgetObjStore.add(record);
}

function uploadTransactions() {
    if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application'
            }
        })
        .then(response => response.json())
        .then(serverResposne => {
            if (serverResposne.message) {
                throw new Error(serverResponse);
            }
            const transaction = db.transaction(['new_transaction'], 'readwrite');
            const budgetObjStore = transaction.createObjectStore('new_transaction');
            budgetObjStore.clear();
            
            alert('Saved transactions have been submitted successfully.');
        })
        .catch(err => {
            console.log(err);
        })
    }
}

window.addEventListener('online', uploadTransactions);