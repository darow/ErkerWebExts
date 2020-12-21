// import { $RequestManager, IRequestManager } from "@docsvision/webclient/System/$RequestManager";
// import { $UrlResolver } from "@docsvision/webclient/System/$UrlResolver";
// import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
// import { Layout } from "@docsvision/webclient/System/Layout";
// import {UrlResolver} from "@docsvision/webclient/System/UrlResolver";
//
// // Все функции, классы и переменные используемые за пределами модуля (т.е. файла)
// // должны экспортироваться (содержать ключевое слово export в объявлении).
// async function getFromDadata(INN) {
//     console.log(3);
//
//     let xmlhttp = new XMLHttpRequest(); //Создаем и открываем запрос
//     xmlhttp.open('POST', 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', true);
//     let json = JSON.stringify({query: INN}); //тут формируется JSON из строки ИНН.
//     xmlhttp.onreadystatechange = async function () {
//         console.log(4);
//
//         if (xmlhttp.readyState == 4) {
//             if (xmlhttp.status == 200) {
//                 let json_parsed = JSON.parse(xmlhttp.response); //...тут парсим хмл в объект JSON при успешном ответе.
//                 return (json_parsed.suggestions[0]);
//             }
//         }
//         return {"data": 1}
//     }
//     //Отсылаем запрос
//     xmlhttp.setRequestHeader('Content-Type', 'application/json');
//     xmlhttp.setRequestHeader('Accept', 'application/json');
//     xmlhttp.setRequestHeader('Authorization', 'Token f98d705857ee5a78874c532251d2f3e739fe9705');
//     xmlhttp.send(json);
//     return {"data": 2}
// }
//
// async function getINNFromDialog() {
//     console.log(2);
//
//     let INN = prompt('Введите ИНН', '');
//     if (INN != '') {
//         return INN;
//     }
//     alert('Вы не ввели ИНН');
//     return null
// }
//
// export async function dadataPostRequest(urlResolver: UrlResolver, requestManager: IRequestManager, INNDig) {
//
//     let url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party'
//     let postdata = {
//         query: "701702387350"
//     }
//     return requestManager.post(url, JSON.stringify(postdata));
// }
//
// export async function fillCredsByINN(sender: Layout, e: IEventArgs) {
//     let layout = sender.layout;
//     let respJSON: Object = null;
//     console.log(1);
//     let INNDig = getINNFromDialog();
//     let urlResolver = sender.layout.getService($UrlResolver);
//     let requestManager = sender.layout.getService($RequestManager);
//
//
//
//     await dadataPostRequest(urlResolver, requestManager, INNDig)
//         .then((data: string) => {
//             console.log(data)
//         })
//         .catch((ex) => {
//             console.log(ex)
//         })
//
//     console.log(5);
//
//     if ("data" in Object.keys(respJSON)) {
//         console.log(11111111111)
//         let dadata = respJSON["data"]; //сокращаем пути
//         console.log(dadata)
//
//
//     }
//
//
//
// }