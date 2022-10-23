const header = document.querySelector("header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const aside_right = document.querySelector('.right_side');
const aside_left = document.querySelector('.left_side');
let ul = main.children[0];
let participant = "";

start_chat();

function start_chat(){
    participant = prompt("Qual seu nome de usuário?");
    const enter_room = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',{'name':participant});
    enter_room.then(function success(response){
        add_participant();
        return response.status;
    });
    enter_room.catch(function failure(response){
        alert("Nome já em uso.");
        console.log("falha", response);
        start_chat();
        return response.status;
    });
}

const stay_online_interval= setInterval((function (){
    const stay_online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',{'name':participant});
    stay_online.then(function success(response){
        return response.status;
    });
    stay_online.catch(function failure(response){
        console.log("falha", response);
        return response.status;
    });
}),5000);

const participant_online_interval = setInterval(add_participant,10000);;

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

function participant_online(){
    aside_right.classList.toggle('sidebar_on');
    aside_left.classList.toggle('sidebar_on');
}

function add_participant(){
    const ul_aside = aside_right.children[1].children[0];
    ul_aside.innerHTML = 
    `<li>
        <ion-icon name="people"></ion-icon>
        <h2>Todos</h2>
    </li>`;
    const inside_room = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    inside_room.then(function success(response){
        for(let i = 0; i < response.data.length; i++){
            ul_aside.innerHTML += 
            `<li>
                <ion-icon name="person-circle-outline"></ion-icon>
                <h2>${response.data[i].name}</h2>
            </li>`; 
        }
        return response.status;
    });
    inside_room.catch(function failure(response){
        console.log("falha", response);
        return response.status;
    });
}

const input = footer.children[0];
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    footer.children[1].click();
  }
});