// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const taskName = document.querySelector('#taskname'),
        taskDescription = document.querySelector('#taskdescription'),
        assignerFirstName = document.querySelector('#assignerfirstname'),
        assignerLastName = document.querySelector('#assignerlastname'),
        assigneeFirstName = document.querySelector('#assigneefirstname'),
        assigneeLastName = document.querySelector('#assigneelastname'),
        json = { 
          taskName: taskName.value,
          taskDescription: taskDescription.value,
          assignerFirstName: assignerFirstName.value,
          assignerLastName: assignerLastName.value,
          assigneeFirstName: assigneeFirstName.value,
          assigneeLastName: assigneeLastName.value
         },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()
  console.log(`Got response text ${text}`)

  console.log( 'text:', text )
}

window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}