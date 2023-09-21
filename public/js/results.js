const getServerData = async function() {
    console.log('Results.js loaded and working')
    const response = await fetch('results', {method: 'GET'});
    const text = await response.text();

    let entries = JSON.parse(text);
    console.log(entries);

    let body = document.querySelector('body');
    let ul = document.createElement('ul');
    body.append(ul);

    for (const entry of entries) {
        console.log(entry);
        let li = document.createElement('li');
        li.innerHTML = `
        <div class='todo-item'>
            <div class='task-name'>${entry.taskName}:</div>
            <div class='task-description'><strong>Description</strong>: ${entry.taskDescription}</div>
            <div class='assigner-assignee-row'>
                <div class='assigner-box'>
                    <div class='assigned-by-label'>Assigned by: </div>
                    <div class='assigner-name'>${entry.assignerFirstName} ${entry.assignerLastName}</div>
                </div>
                <div class='assignee-box'>
                    <div class='assigned-to-label'>Assigned to: </div>
                    <div class='assignee-name'>${entry.assigneeFirstName} ${entry.assigneeLastName}</div>
                </div>
                <div class='email-box'>
                    <div class='email-label'>Assignee email:</div>
                    <div><address>${entry.assigneeEmail}</address></div>
                </div>
            </div>
        </div>
        `;
        ul.append(li);
    }
}

window.onload = getServerData;