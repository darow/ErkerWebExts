import {IEventArgs} from "@docsvision/webclient/System/IEventArgs";
import {Layout} from "@docsvision/webclient/System/Layout";
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver";
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager";
import {layoutManager} from "@docsvision/webclient/System/LayoutManager";
import { UrlResolver } from "@docsvision/webclient/System/UrlResolver";
import moment from 'moment'
import { Tab } from "@docsvision/webclient/Platform/Tab";
import { ICancelableEventArgs } from "@docsvision/webclient/System/ICancelableEventArgs";


export async function newFunc(sender:Layout) {
    console.log("newFunc");


}


export async function createFileRows(sender:Layout) {
    console.log("createFileRows");

    let fileTable = sender.layout.controls.fileTable
    await fileTable.addRow();
    await fileTable.addRow();
    await fileTable.addRow();
    let fileLabels = sender.layout.controls.fileLabel
    fileLabels[0].value =  "Устав"
    fileLabels[1].value =  "Свидетельство"
    fileLabels[2].value =  "Паспорт"
}


export async function crtRmSignerFileRow(sender:Layout) {
    console.log("crtRmSignerFileRow");

    let fileTable = sender.layout.controls.fileTable
    let mainBossIsSigner = sender.layout.controls.mainBossIsSigner.value
    if (mainBossIsSigner) {
        if (fileTable.rows.length == 3) {
            await fileTable.addRow();
            sender.layout.controls.fileLabel[3].value = "Доверенность подписанта" 
        } 
    } else {
        if (fileTable.rows.length == 4) {
            await fileTable.removeRow(fileTable.rows[3]);
        } 
    }
    
}


export async function setPartnerSigner(sender:Layout) {
    console.log("setPartnerSigner");

    let mainBossIsSigner = sender.layout.controls.mainBossIsSigner.value
    let mainBossBlock = sender.layout.controls.mainBossBlock
    let partnerSignerControl = sender.layout.controls.partnerSigner
    let mainBossControl = sender.layout.controls.mainBoss


    if (mainBossIsSigner) {
        partnerSignerControl.params.required = false
        partnerSignerControl.params.visibility = false
        mainBossBlock.params.width = 100
    } else {
        partnerSignerControl.params.required = true
        partnerSignerControl.params.visibility = true
        mainBossBlock.params.width = 50
    }
    
}


export async function getCheckList(urlResolver: UrlResolver, requestManager: IRequestManager, itemID: String) {
    let url = urlResolver.resolveApiUrl("GetCheckList", "VZService");
    url += "?itemID=" + itemID;
    return requestManager.get(url);
}


export async function fillCheckListTable(sender:Layout) {
    console.log("fillCheckListTable");
   
    let tab = sender.layout.controls.get<Tab>("tabs"); 
    let myTab = tab.params.tabPages[1]; 
    let tabpageModel = await tab.loadTabPage(myTab);

    let checkListTable = sender.layout.controls.checkListTable

    let checkBoxes = sender.layout.controls.CLTCheckBox
    let isCheckedFlag = false
    if (checkBoxes) {
        checkBoxes.forEach(chBox => {
            if (chBox.params.value) {
                isCheckedFlag = true
            }             
        });
    }
    

    if (!isCheckedFlag) {
        while (checkListTable.rows.length>0) {
            await checkListTable.removeRow(checkListTable.rows[0])
        }

        let categoryControlValue = sender.layout.controls.partnerCategory.params.value
        let categoryId = categoryControlValue?categoryControlValue.id:""
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        let response = await getCheckList(urlResolver, requestManager, categoryId)
        let items = response["docName"]
        
        while (checkListTable.rows.length<items.length) {
            await checkListTable.addRow()
        }
        let tableDirDesRows
        for (let i = 0; i < items.length; i++) {
            tableDirDesRows = sender.layout.controls.get("CLTDirDesRow")    
            tableDirDesRows[i].params.value = items[i]
        }
    }
}


export async function getTrustedInfo(urlResolver: UrlResolver, requestManager: IRequestManager, emplID: String) {
    let url = urlResolver.resolveApiUrl("GetVZEmplModels", "VZService");
    url += "?emplID=" + emplID;
    return requestManager.get(url);
}


export async function fillTrustedInfo(sender:Layout, e:IEventArgs) {
    console.log("fillTrustedInfo");
    
    let doveritelControl = sender.layout.controls.Doveritel
    let doveritelId = doveritelControl.params.value ? doveritelControl.params.value.id:""
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);

    let trustedEmplPost = sender.layout.controls.EmployeeDolznost
    let contractNumControl = sender.layout.controls.textArea1
    let contractDateControl = sender.layout.controls.dateTimePicker1
    let employeeLastNameControl = sender.layout.controls.EmployeeLastName
    let employeeFirstNameControl = sender.layout.controls.EmployeeFirstName
    let employeeMiddleNameControl = sender.layout.controls.EmployeeMiddleName
    let employeeBirthdayDateControl = sender.layout.controls.EmployeeBirthdayDate
    let employeeCityBirthdayContract = sender.layout.controls.EmployeeCityBirthday
    let employeePassportSeriesControl = sender.layout.controls.EmployeePassportSeries
    let employeePassportNumberControl = sender.layout.controls.EmployeePassportNumber
    let employeePassportDeliveredControl = sender.layout.controls.EmployeePassportDelivered
    let employeePassportDeliveryCodeControl = sender.layout.controls.EmployeePassportDeliveryCode
    let employeePassportDateControl = sender.layout.controls.EmployeePassportDate

    if (doveritelId != "") {
        let data = await getTrustedInfo(urlResolver, requestManager, doveritelId)
        console.log(data);
        
        if (data["emplContractNum"]) {
            contractNumControl.params.value = data["emplContractNum"]
        }
        if (data["emplContractDate"]) {
            contractDateControl.params.value = moment(data["emplContractDate"])
        }

        if (data["lastName"]) {
            employeeLastNameControl.params.value = data["lastName"]
        }
        if (data["firstName"]) {
            employeeFirstNameControl.params.value = data["firstName"]
        }
        if (data["middleName"]) {
            employeeMiddleNameControl.params.value = data["middleName"]
        }
        if (data["birthDate"]) {
            employeeBirthdayDateControl.params.value = moment(data["birthDate"])
        }
        if (data["birthPlace"]) {
            employeeCityBirthdayContract.params.value = data["birthPlace"]
        }

        if (data["docS"]) {
            employeePassportSeriesControl.params.value = data["docS"]
        }
        if (data["docNumber"]) {
            employeePassportNumberControl.params.value = data["docNumber"]
        }
        if (data["docBy"]) {
            employeePassportDeliveredControl.params.value = data["docBy"]
        }
        if (data["depCode"]) {
            employeePassportDeliveryCodeControl.params.value = data["depCode"]
        }
        if (data["docDate"]) {
            employeePassportDateControl.params.value = moment(data["docDate"])
        }
        if (data["position"]) {
            trustedEmplPost.value = data["position"]
        }
    } else {
        contractNumControl.params.value = null
        contractDateControl.params.value = null
        employeeLastNameControl.params.value = null
        employeeFirstNameControl.params.value = null
        employeeMiddleNameControl.params.value = null
        employeeBirthdayDateControl.params.value = null
        employeeCityBirthdayContract.params.value = null
        employeePassportSeriesControl.params.value = null
        employeePassportNumberControl.params.value = null
        employeePassportDeliveredControl.params.value = null
        employeePassportDeliveryCodeControl.params.value = null
        employeePassportDateControl.params.value = null
        trustedEmplPost.value = null
    }
}


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




export async function preapareDocument(sender) {
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let cardId = sender.layout.cardInfo.id
    let rDate = moment(sender.layout.controls.regDate.params.value).format('DD.MM.YYYY')
    await sender.layout.saveCard()
    let timestamp = sender.layout.cardInfo.timestamp

    await prepareDocByTaskId(urlResolver, requestManager, timestamp, cardId, rDate)
        .then((data: string) => {
            console.log(data)
            location.reload()
        })
        .catch((ex) => {
            console.log(ex)
        })
}

export async function prepareDocByTaskId(urlResolver: UrlResolver, requestManager: IRequestManager, timestamp, cardId, rDate) {
    let url = urlResolver.resolveApiUrl("PrepareDocumentByTaskId", "DocumentProcessService")
    let postdata = {
        taskId: cardId,
        timestamp: timestamp,
        rDate: rDate
    }
    return requestManager.post(url, JSON.stringify(postdata))
}


// export async function prepareDocument(sender: Layout, e: IEventArgs) {
//     console.log("prepareDocument");
//     let timestamp = sender.layout.cardInfo.timestamp
//     let urlResolver = sender.layout.getService($UrlResolver);
//     let requestManager = sender.layout.getService($RequestManager);
//     let cardId = sender.layout.cardInfo.id
//     await PrepDoc(urlResolver, requestManager, cardId, timestamp)
//         .then(function (data) {
//             console.log(data["infoMessage"]);
//         })
//         .catch((ex) => {
//             console.log(ex)
//         })
// }

// export async function PrepDoc(urlResolver, requestManager, unitId, timestamp) {
//     let url = urlResolver.resolveApiUrl("PrepareDocumentByTaskId", "DocumentProcessService");
//     url += "?id=" + unitId;
//     return requestManager.get(url)
// }


export async function hideReconciliation(sender: Layout, e: IEventArgs) {
    console.log("hideReconciliation");
    let approvalMessageControl =  sender.layout.controls.approvalMessage
    let linkValue = sender.layout.controls.link.params.value

    if (!linkValue) {
        $('.decision-to-approval').attr("disabled", "true")
        $('.decision-to-approval').text("На согласование")
        $('.decision-to-approval').css("background", "grey")

        approvalMessageControl.params.visibility = true
        console.log("sender.layout.controls.link.params.value == null!!!!")
    }

    let CardID = linkValue.cardId
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    await CheckState(urlResolver, requestManager, CardID)
        .then(function (data) {
            console.log(data);
            if (data) {
                $('.decision-to-approval').removeAttr("disabled")
                $('.decision-to-approval').css("background", "rgba(0,149,218,.8)")
                approvalMessageControl.params.visibility = false
                // $('.decision-to-approval').removeClass("showHidden")
            } else {
                $('.decision-to-approval').attr("disabled", "true")
                $('.decision-to-approval').text("На согласование")
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



