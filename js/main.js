const main = document.querySelector("main");
const footer = document.querySelector("footer");
let ul = main.children[0];

let trigger = 400;
// while(trigger !== 200){
const participant = prompt("Qual seu nome de usuário?");
let participant_object = {'name':participant};
const enter_room = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',participant_object);
enter_room.then(function success(response){
    return response.status;
});
enter_room.catch(function failure(response){
    console.log("falha", response);
    return response.status;
});
// }

const stay_online_interval= setInterval((function (){
    const stay_online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',participant_object);
    stay_online.then(function success(response){
        return response.status;
    });
    stay_online.catch(function failure(response){
        console.log("falha", response);
        return response.status;
    });
}),5000);

let last_message = ["","","","",""];
const search_messages_interval= setInterval((function (){
    let search_messages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    search_messages.then(function success(response){
        let current_message = [response.data[response.data.length-1].from, response.data[response.data.length-1].to, response.data[response.data.length-1].text, response.data[response.data.length-1].type, response.data[response.data.length-1].time];
        // console.log(current_message);
        // console.log(last_message);
        // console.log(current_message[0] === last_message[0] && current_message[1] === last_message[1] && current_message[2] === last_message[2] && current_message[3] === last_message[3] && current_message[4] === last_message[4]);
        if (current_message[0] === last_message[0] && current_message[1] === last_message[1] && current_message[2] === last_message[2] && current_message[3] === last_message[3] && current_message[4] === last_message[4]){
            return response.data;
        }
        else {
            if(search_name(response.data[response.data.length-1],participant)){
                add_messages(response.data[response.data.length-1]);
            }
            for(let i = 0; i < current_message.length; i++){
                last_message[i] = current_message[i];
            }  
        }
    });
    search_messages.catch(function failure(response){
        console.log("falha", response);
        return response.status;
    });
}),3000);

function add_messages(object){
    if (object.type === 'status'){
        ul.innerHTML += 
        `<li class=${object.type}>
            <p><span class="time">(${object.time})</span> <span>${object.from}</span> ${object.text}</p> 
        </li>`
    } else if (object.type === 'message'){
        ul.innerHTML +=
        `<li>
            <p><span class="time">(${object.time})</span> <span>${object.from}</span> para <span>${object.to}</span>: ${object.text}</p> 
        </li>`
    } else{
        ul.innerHTML +=
        `<li class=${object.type}>
            <p><span class="time">(${object.time})</span> <span>${object.from}</span> reservadamente para <span>${object.to}</span>: ${object.text}</p> 
        </li>`  
    }
}

function search_name(object, name){
    if(object.from === name || object.to === 'Todos' || object.to === name){
        return true;
    };
    return false;
}

function send_messages(){
    const message = footer.children[0].value;
    let message_object = {'from': participant, 'to': 'Todos', 'text': message, 'type': 'message'};
    const message_api = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",message_object);
    message_api.then(function success(response){
        clear_message();
        return response;
    });
    message_api.catch(function failure(response){
        console.log("falha", response);
        return response;
    });
}

function clear_message(){
    return footer.children[0].value = "";
}

const input = footer.children[0];
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    footer.children[1].click();
  }
});