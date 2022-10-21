const main = document.querySelector("main");
let ul = main.children[0];
// let date = new Date().toJSON().split("T")[1].split(".")[0];
// let date_hour = Number(date.split(":")[0]);
// let date_minute = Number(date.split(":")[1]);

let trigger = 400;
// while(trigger !== 200){
const participant = prompt("Qual seu nome de usuário?");
let participant_object = {'name':participant};
const enter_room = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',participant_object);
enter_room.then(function success(response){
    console.log(response.status);
    return response.status;
});
enter_room.catch(function failure(response){
    console.log(response.status);
    return response.status;
});
// }

const stay_online_interval= setInterval((function (){
    const stay_online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',participant_object);
    stay_online.then(function success(response){
        // console.log(response.status);
        return response.status;
    });
    stay_online.catch(function failure(response){
        // console.log(response.status);
        return response.status;
    });
}),5000);

let last_message = "";
const search_messages_interval= setInterval((function (){
    let search_messages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    search_messages.then(function success(response){
        let current_message = response.data[response.data.length-1];
        console.log(current_message);
        console.log(last_message);
        console.log(current_message === last_message);
        // for(let i = 0; i < response.data.length; i++){
        //     if(search_name(response.data[i],participant)){
        //         add_messages(response.data[i]);
        //     }
        // }
        if (current_message != last_message){
            if(search_name(response.data[response.data.length-1],participant)){
                add_messages(response.data[response.data.length-1]);
            }
            last_message = current_message;
        }
        
        return response.data;
    });
    search_messages.catch(function failure(response){
        // console.log(response);
        return response.status;
    });
}),5000);

function add_messages(object){
    if (object.type === 'status'){
        ul.innerHTML += 
        `<li class=${object.type}>
            <p><span class="time">(${object.time})</span> <span>${object.from}</span> ${object.text}</p> 
        </li>`
    } else if (object.type === 'message'){
        `<li>
            <p><span class="time">(${object.time})</span> <span>${object.from}</span> para <span>${object.to}</span>: ${object.text}</p> 
        </li>`
    } else{
        `<li class=${object.type}>
            <p><span class="time">(${object.time})</span> <span>${object.from}</span> reservadamente para <span>${object.to}</span>: ${object.text}</p> 
        </li>`  
    }
}

function search_name(object, name){
    // const hour = Number(object.time.split(":")[0]);
    // const minute = Number(object.time.split(":")[1]);
    if(object.from === name || object.to === 'Todos' || object.to === name){
        return true;
    };
    return false;
}

// function formatAMPM(date) {
//     var hours = date.getHours();
//     var minutes = date.getMinutes();
//     var ampm = hours >= 12 ? 'pm' : 'am';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     minutes = minutes < 10 ? '0'+minutes : minutes;
//     var strTime = hours + ':' + minutes + ' ' + ampm;
//     return strTime;
//   }
  
//   console.log(formatAMPM(new Date));