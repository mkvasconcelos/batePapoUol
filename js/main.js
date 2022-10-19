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

setInterval((function (){
    const stay_online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',participant_object);
    stay_online.then(function success(response){
        console.log(response.status);
        return response.status;
    });
    stay_online.catch(function failure(response){
        console.log(response.status);
        return response.status;
    });
}),5000);

let search_messages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
search_messages.then(function success(response){
    console.log(response.data);
    return response.status;
});
search_messages.catch(function failure(response){
    console.log(response);
    return response.status;
});
