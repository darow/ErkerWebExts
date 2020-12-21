import {IEventArgs} from "@docsvision/webclient/System/IEventArgs";
import {Layout} from "@docsvision/webclient/System/Layout";
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver";
import {$RequestManager} from "@docsvision/webclient/System/$RequestManager";
import {layoutManager} from "@docsvision/webclient/System/LayoutManager";

async function getFromDadata(INN) {
    let xhr = new XMLHttpRequest() //Создаем и открываем запрос
    xhr.open('POST', 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', true)
    let json = JSON.stringify({query: INN}) //тут формируется JSON из строки ИНН.
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Authorization', 'Token f98d705857ee5a78874c532251d2f3e739fe9705')
    xhr.timeout = 5000
    xhr.send(json)
    return xhr
}

function PassINN() {
    let INN = prompt('Введите ИНН', '')
    if (INN != '') {
        return INN
    }
    alert('Вы не ввели ИНН')
    return null
}

export async function fillCredsByINN(sender: Layout, e: IEventArgs) {
    let INN = PassINN()
    await getFromDadata(INN)
        .then((xhr) => {
            xhr.onreadystatechange = async function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let json_parsed = JSON.parse(xhr.response) //...тут парсим хмл в объект JSON при успешном ответе.
                        fillTheControls(sender, e, json_parsed.suggestions[0])
                    } else
                        throw DOMException
                }
            }
        })
        .catch((ex) => {
            console.log(ex)
        })
}

export async function fillTheControls(sender: Layout, e: IEventArgs, respJSON) {
    console.log(respJSON)
    let layout = sender.layout
    let controls = sender.layout.controls

    let dadata = respJSON["data"] //сокращаем пути
    let adrdata = dadata.address.data //сокращаем-сокращаем
    //Вот тут запихиваем все в соответствующие строки
    let Name = layout.controls.Name
    let FullName = layout.controls.FullName
    let ManagerLastName = layout.controls.ManagerLastName
    let ManagerFirstName = layout.controls.ManagerFirstName
    let ManagerMiddleName = layout.controls.ManagerMiddleName
    let LegalZIP = layout.controls.LegalZIP
    let LegalCountry = layout.controls.LegalCountry
    let LegalCity = layout.controls.LegalCity
    let INN = layout.controls.INN
    let KPP = layout.controls.KPP
    let OKPO = layout.controls.OKPO
    let OKVED = layout.controls.OKVED
    let OGRN = layout.controls.OGRN
    let LegalAddress = layout.controls.LegalAddress
    Name.params.value = dadata.name.short_with_opf //Краткое название компании
    FullName.params.value = dadata.name.full_with_opf //Полное название компании
    LegalZIP.params.value = adrdata.postal_code //Индекс
    LegalCountry.params.value = adrdata.country //Страна
    if (dadata.address.data.city) {
        LegalCity.params.value = adrdata.city
    } //город...
    else {
        LegalCity.params.value += adrdata.region_with_type + ' , ' + adrdata.area_with_type + ' , ' + adrdata.settlement_with_type
    }
    //...или область + район + поселение
    LegalAddress.params.value = adrdata.street_with_type + ' , ' + adrdata.house_with_type //адрес - улица плюс дом
    INN.params.value = dadata.inn //ну
    KPP.params.value = dadata.kpp //тут
    OKPO.params.value = dadata.okpo //и так
    OKVED.params.value = dadata.okved //все
    OGRN.params.value = dadata.ogrn //понятно
    try {
        LegalAddress.params.value = LegalAddress.params.value.split(", null ,").join('').split("null ,").join('')
            .split(", null").join('').split(", undefined ,").join('').split(", undefined").join('').split("undefined , ")
            .join('').split("null").join('').split("undefined").join('')
    } catch(ex) {
        console.log(ex)
    }
    if (dadata.management) {
        let split_name = dadata.management.name.full.split(" ", 3) //Разделяем ФИО владельца компании на три поля
        ManagerLastName.params.value = split_name[0]
        ManagerFirstName.params.value = split_name[1]
        ManagerMiddleName.params.value = split_name[2]
    }
}

export async function prepareDocument(sender: Layout, e: IEventArgs) {
    console.log("prepareDocument");
    let timestamp = sender.layout.cardInfo.timestamp
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let id = "ecf6ac08-96c9-4d87-b349-137e38a6950f";
    await PrepDoc(urlResolver, requestManager, id, timestamp)
        .then(function (data) {
            console.log(data["infoMessage"]);
        })
        .catch((ex) => {
            console.log(ex)
        })
}

export async function PrepDoc(urlResolver, requestManager, unitId, timestamp) {
    let url = urlResolver.resolveApiUrl("PrepareDocumentByTaskId", "DocumentProcessService");
    url += "?id=" + unitId;
    return requestManager.get(url)
}


export async function hideReconciliation(sender: Layout, e: IEventArgs) {
    console.log("hideReconciliation");
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let CardID = sender.layout.controls.link.params.value.cardId
    let approvalMessageControl =  sender.layout.controls.approvalMessage
    await CheckState(urlResolver, requestManager, CardID)
        .then(function (data) {
            console.log(data);
            if (data) {
                $('.decision-to-approval').attr("disabled", "false")
                $('.decision-to-approval').css("background", "rgba(0,149,218,.8)")
                approvalMessageControl.params.visibility = false
                // $('.decision-to-approval').removeClass("showHidden")
            } else {
                $('.decision-to-approval').attr("disabled")
                $('.decision-to-approval').css("background", "grey")
                approvalMessageControl.params.visibility = true
                // $('.decision-to-approval').addClass("showHidden")
            }

        })
        .catch((ex) => {
            console.log(ex)
        })
}

export async function CheckState(urlResolver, requestManager, CardID) {
    let url = urlResolver.resolveApiUrl("CheckState", "EWSE");
    url += "?CardID=" + CardID;
    return requestManager.get(url)
}

export async function fakeHideReconciliation(sender: Layout, e: IEventArgs) {
    console.log("hideReconciliation");
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let CardID = sender.layout.controls.link.params.value.cardId
    let approvalMessageControl =  sender.layout.controls.approvalMessage
    await fakeCheckState(urlResolver, requestManager, CardID)
        .then(function (data) {
            console.log(data);
            if (data) {
                $('.decision-to-approval').removeAttr("disabled")
                $('.decision-to-approval').css("background", "rgba(0,149,218,.8)")
                approvalMessageControl.params.visibility = false
                // $('.decision-to-approval').removeClass("showHidden")
            } else {
                $('.decision-to-approval').html("На согласование")
                $('.decision-to-approval').attr("disabled")
                $('.decision-to-approval').css("background", "grey")
                approvalMessageControl.params.visibility = true
                // $('.decision-to-approval').addClass("showHidden")
            }

        })
        .catch((ex) => {
            console.log(ex)
        })
}

export async function fakeCheckState(urlResolver, requestManager, CardID) {
    let url = urlResolver.resolveApiUrl("CheckState", "EWSE");
    url += "?CardID=" + "225a366e-50c6-4ef3-9830-f171862517ed";
    return requestManager.get(url)
}

