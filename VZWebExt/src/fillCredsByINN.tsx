import {IEventArgs} from "@docsvision/webclient/System/IEventArgs";
import {Layout} from "@docsvision/webclient/System/Layout";
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver";
import {$RequestManager} from "@docsvision/webclient/System/$RequestManager";


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
    LegalAddress.params.value += adrdata.street_with_type + ' , ' + adrdata.house_with_type //адрес - улица плюс дом
    LegalAddress.params.value = LegalAddress.params.value.split(", null ,").join('').split("null ,").join('')
        .split(" , null").join('').split(" , undefined , ").join('').split(" , undefined").join('').split("undefined , ").join('')
    INN.params.value = dadata.inn //ну
    KPP.params.value = dadata.kpp //тут
    OKPO.params.value = dadata.okpo //и так
    OKVED.params.value = dadata.okved //все
    OGRN.params.value = dadata.ogrn //понятно
    let split_name = dadata.management.name.full.split(" ", 3) //Разделяем ФИО владельца компании на три поля
    ManagerLastName.params.value = split_name[0]
    ManagerFirstName.params.value = split_name[1]
    ManagerMiddleName.params.value = split_name[2]
}
