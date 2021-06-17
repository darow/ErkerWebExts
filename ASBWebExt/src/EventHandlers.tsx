import { $UrlResolver } from "@docsvision/webclient/System/$UrlResolver";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import { $RequestManager, IRequestManager } from "@docsvision/webclient/System/$RequestManager";
import { UrlResolver } from "@docsvision/webclient/System/UrlResolver";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { $Router, $RouterNavigation, IRouterNavigation } from "@docsvision/webclient/System/$Router";
import { layoutManager } from "@docsvision/webclient/System/LayoutManager";
import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import { LayoutControlFactory } from "@docsvision/webclient/System/LayoutControlFactory";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import moment from 'moment'
import { $CurrentEmployee } from "@docsvision/webclient/StandardServices";
import { AgreementList } from "@docsvision/webclient/Approval/AgreementList";
import { Numerator, NumeratorParams } from "@docsvision/webclient/BackOffice/Numerator";
import { ICardSavingEventArgs } from "@docsvision/webclient/System/ICardSavingEventArgs";
import { ICancelableEventArgs } from "@docsvision/webclient/System/ICancelableEventArgs";
import { Links } from "@docsvision/webclient/BackOffice/Links";




export async function tryReadFile(sender: Layout) {
    console.log("newFunc");

    var fr=new FileReader();
    fr.onload=function(){
        console.log(fr.result);
    }
        
    console.log(fr.readAsText(this.files[0]));
}



export async function newFunc(sender: Layout) {
    console.log("newFunc");


}


export async function checkRegNum(urlResolver: UrlResolver,
    requestManager: IRequestManager, documentId: String, numberId: String) {
    let url = urlResolver.resolveUrl("IsNumberFromNumerator", "DocumentASB", false);
    url += "?documentId=" + documentId + "&numberId=" + numberId;
    console.log("checkRegNum: " + url);
    return requestManager.get(url)
}


export async function setRegDate(sender: Layout, args: CancelableEventArgs<ICardSavingEventArgs>) {
    console.log("setRegDate");

    args.wait()
    layoutManager.cardLayout.controls.regDate.params.value = moment()
    layoutManager.cardLayout.controls.regDate.save()
    args.accept()
}



export async function fixButtonsWidth(sender: Layout) {
    console.log("fixButtonsWidth1");

    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000);
    console.log("fixButtonsWidth2");

    $("div[data-control-name='cardKindBlock']")[1].style.width = "100%"
    let buttonContainers = $("div.state-button-wrapper")
    let buttons = $("div.state-button-wrapper>button")
    for (let i = 0; i < buttonContainers.length; i++) {
        buttonContainers[i].style.width = "100%"
        buttons[i].style.width = "100%"
    }
}


export async function hideTaskInfoBlock(sender: Layout) {
    console.log("hideTaskInfoBlock");

    let taskControl = sender.layout.controls.taskBlock
    let linkInfo = sender.layout.controls.links11.params.links[0].data
    let contractFlag = linkInfo.displayName.includes("Договорной документ")
    if (contractFlag) {
        taskControl.params.visibility = true
    } else {
        taskControl.params.visibility = false
    }
}


export async function registerAgrmntTaskRequest(urlResolver: UrlResolver,
    requestManager: IRequestManager, taskId: String, timestamp: String) {
    let url = urlResolver.resolveUrl("RegistrateMainDocumentAndFillWordFile", "TaskASB", false);
    url += "?taskId=" + taskId + "&timestamp=" + timestamp;
    console.log("registerAgrmntTaskRequest: " + url);
    return requestManager.get(url)
}


export async function registerAgrmntTask(sender: Layout) {
    console.log("registerAgrmntTask");

    let taskId = layoutManager.cardLayout.cardInfo.id
    let timestamp = layoutManager.cardLayout.cardInfo.timestamp.toString()

    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);

    let resp = await registerAgrmntTaskRequest(urlResolver, requestManager, taskId, timestamp)
    location.reload()
    console.log("resp: "+resp);
}


export async function getLinksRequest(urlResolver: UrlResolver,
    requestManager: IRequestManager, cardId: String) {
    let url = urlResolver.resolveApiUrl("getLinks", "layoutLinks");
    let postdata = {
        "cardId": cardId,
        "bindingInfo": {
            "dataSourceResolverId": "00000000-0000-0000-0000-000000000000",
            "sectionId": "30eb9b87-822b-4753-9a50-a1825dca1b74",
            "fieldAlias": "ReferenceList"
        },
        "fileKindId": "00000000-0000-0000-0000-000000000000",
        "showFilesForLinksTypesIds": [],
        "allowedLinkTypes": ["90d0724e-08f4-4391-a0b0-3f4b6bbeefa3",
            "2b959168-d2c6-4350-b0a8-c276ff3496d7"],
        "columnViewMode": 2, "columnViewExtensionName": null
    }
    return requestManager.post(url, JSON.stringify(postdata));
}


export async function showRegBtn(sender: Layout, e: IEventArgs) {
    console.log("showRegBtn");

    let linksControl = sender.layout.controls.get<Links>("links")
    let links = linksControl.params.links
    let regBtnCntrl = sender.layout.controls.regBtn
    let state = sender.layout.controls.state.params.value.caption
    
    let docId = links.length ? links[0].data.cardId : ""
    if (docId) {
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        let resp = await getLinksRequest(urlResolver, requestManager, docId)
        console.log(resp);
    }

    if ((state == "Не начато") || (state == "В работе")) {
        regBtnCntrl.params.visibility = true
    } else {
        regBtnCntrl.params.visibility = false
    }
}


export async function hideAdlAgrsCtrl(sender: Layout) {
    console.log("hideAdlAgrsCtrl");

    let typicalFlag = sender.layout.controls.checkBox1
    let contractTypeControl = sender.layout.controls.directoryDesignerRow2
    let contractType = contractTypeControl.params.value ? contractTypeControl.params.value.name : ""
    let contractTypes = ["Ковер-нота", "Договор-оферта контрагента до 100 тыс.", "Соглашение о конфиденциальности"]
    let adlAgrsCtrl = sender.layout.controls.multipleEmployees1

    if ((typicalFlag.params.value) || (contractTypes.includes(contractType))) {
        adlAgrsCtrl.params.visibility = false
    } else {
        adlAgrsCtrl.params.visibility = true
    }
}


export async function saveToStrg(key, value) {
    console.log("saveToStrg " + JSON.stringify(value));

    if (value) {
        localStorage.setItem(key, JSON.stringify(value))
    } else {
        localStorage.setItem(key, "")
    }
}


export async function createCopyCntrct(sender: Layout) {
    console.log("createCopyCntrct")

    let controls = sender.layout.controls

    localStorage.setItem("cardToCopy", "Cntrct")
    saveToStrg("contractSubject", controls.contractSubject.params.value)
    saveToStrg("directoryDesignerRow2", controls.directoryDesignerRow2.params.value)
    saveToStrg("directoryDesignerRow1", controls.directoryDesignerRow1.params.value)
    saveToStrg("checkBox2", controls.checkBox2.params.value)
    saveToStrg("checkBox1", controls.checkBox1.params.value)
    saveToStrg("staffDepartment1", controls.staffDepartment1.params.value)
    saveToStrg("dateOfContract", controls.dateOfContract.params.value)
    saveToStrg("finishDate", controls.finishDate.params.value)
    saveToStrg("dateTimePicker2", controls.dateTimePicker2.params.value)
    saveToStrg("multipleEmployees1", controls.multipleEmployees1.params.value)
    saveToStrg("addtnlAgrPrsns", controls.addtnlAgrPrsns1.params.value)

    // перенести в localStorage таблицу контрагентов
    let numRows = sender.layout.controls.personsTable.rows.length
    let partnersControls = sender.layout.controls.get("recieverEmployee")
    let partnersList = []
    for (let i = 0; i < numRows; i++) {
        if (partnersControls[i].params.value) {
            let partner = partnersControls[i].params.value
            partnersList.push(partner)
        }
    }
    saveToStrg("partnersList", partnersList)

    window.open('#/NewCard/b9f7bfd7-7429-455e-a3f1-94ffb569c794/0c7cfc61-1c03-438e-b4c6-a6a6288d71c8/00000000-0000-0000-0000-000000000000', '_blank');
}


function popFromStrg(key) {
    console.log("popFromStrg");

    let value = JSON.parse(localStorage.getItem(key) ? localStorage.getItem(key) : null)

    localStorage.removeItem(key);
    return value
}


export async function fillCntrctFromStrg(sender: Layout) {
    console.log("fillCntrctFromStrg")

    if (localStorage.getItem("cardToCopy") == "Cntrct") {
        let controls = sender.layout.controls
        controls.name.params.value = popFromStrg("contractSubject")
        controls.directoryDesignerRow2.params.value = popFromStrg("directoryDesignerRow2")
        controls.directoryDesignerRow1.params.value = popFromStrg("directoryDesignerRow1")
        controls.checkBox2.params.value = popFromStrg("checkBox2")
        controls.checkBox1.params.value = popFromStrg("checkBox1")
        controls.staffDepartment2.params.value = popFromStrg("staffDepartment1")
        let tempDate = moment(popFromStrg("dateOfContract"))
        controls.dateTimePicker2.params.value = tempDate.isValid() ? tempDate : null
        tempDate = moment(popFromStrg("finishDate"))
        controls.dateTimePicker3.params.value = tempDate.isValid() ? tempDate : null
        tempDate = moment(popFromStrg("dateTimePicker2"))
        controls.dateTimePicker4.params.value = tempDate.isValid() ? tempDate : null
        controls.multipleEmployees1.params.value = popFromStrg("multipleEmployees1")
        controls.addtnlAgrPrsns1.params.value = popFromStrg("addtnlAgrPrsns")

        let partnersList = await popFromStrg("partnersList")
        let personsTable = sender.layout.controls.personsTable
        let partnersControls
        for (let i = 0; i < partnersList.length; i++) {
            if (partnersList[i]) {
                await personsTable.addRow();
                partnersControls = sender.layout.controls.get("recieverEmployee")
                partnersControls[i].params.value = partnersList[i]
            }
        }
    }
    localStorage.removeItem("cardToCopy");
}



export async function createCopyOfOutLetter(sender: Layout) {
    console.log("createCopyOfCurrentOutLetter")

    let controls = sender.layout.controls
    let name = controls.name.params.value ? controls.name.params.value : ""
    let importantFlag = controls.checkBox1.params.value
    let signer = JSON.stringify(controls.signer.params.value)
    let registrarBoss = JSON.stringify(controls.registrarBoss.params.value)
    let approvePersons = JSON.stringify(controls.approvePersons.params.value)
    let sendingType = JSON.stringify(controls.sendingType.params.value)
    let foreignBlank = controls.foreignBlank.params.value
    let signingWithES = controls.signingWithES.params.value
    let addtnlAgrPrsns = JSON.stringify(controls.addtnlAgrPrsns.params.value)
    let description = controls.description.params.value ? controls.description.params.value : ""
    let numRows = sender.layout.controls.personsTable.rows.length
    let partnersControls = sender.layout.controls.get("recieverEmployee")
    let partnersList = []

    for (let i = 0; i < numRows; i++) {
        if (partnersControls[i].params.value) {
            let partner = partnersControls[i].params.value
            partnersList.push(partner)
        }
    }

    localStorage.setItem("partnersList", JSON.stringify(partnersList))
    localStorage.setItem("cardToCopy", "OutLetter")
    localStorage.setItem("name", name)
    localStorage.setItem("importantFlag", importantFlag)
    localStorage.setItem("registrarBoss", registrarBoss)
    localStorage.setItem("approvePersons", approvePersons)
    localStorage.setItem("sendingType", sendingType)
    localStorage.setItem("signer", signer)
    localStorage.setItem("foreignBlank", foreignBlank)
    localStorage.setItem("signingWithES", signingWithES)
    localStorage.setItem("addtnlAgrPrsns", addtnlAgrPrsns)
    localStorage.setItem("description", description)
    window.open('#/NewCard/b9f7bfd7-7429-455e-a3f1-94ffb569c794/c8fa6b08-d0ff-4642-9eb3-667153def92f', '_blank');
}


export async function fillOutLetterFromLocalStorage(sender: Layout) {
    console.log("fillOutLetterFromLocalStorage")

    if (localStorage.getItem("cardToCopy") == "OutLetter") {
        let controls = sender.layout.controls
        controls.name.params.value = localStorage.getItem("name")
        controls.checkBox1.params.value = localStorage.getItem("importantFlag")
        controls.registrarBoss.params.value = JSON.parse(localStorage.getItem("registrarBoss"))
        controls.approvePersons.params.value = JSON.parse(localStorage.getItem("approvePersons"))
        controls.sendingType.params.value = JSON.parse(localStorage.getItem("sendingType"))
        controls.signer.params.value = JSON.parse(localStorage.getItem("signer"))
        controls.foreignBlank.params.value = localStorage.getItem("foreignBlank")
        controls.signingWithES.params.value = localStorage.getItem("signingWithES")
        controls.addtnlAgrPrsns.params.value = JSON.parse(localStorage.getItem("addtnlAgrPrsns"))
        controls.description.params.value = localStorage.getItem("description")

        let partnersList = JSON.parse(localStorage.getItem("partnersList"))
        let personsTable = sender.layout.controls.personsTable
        let partnersControls
        for (let i = 0; i < partnersList.length; i++) {
            if (partnersList[i]) {
                await personsTable.addRow();
                partnersControls = sender.layout.controls.get("recieverEmployee")
                partnersControls[i].params.value = partnersList[i]
            }
        }
        localStorage.removeItem("cardToCopy");
        localStorage.removeItem("name");
        localStorage.removeItem("importantFlag");
        localStorage.removeItem("registrarBoss");
        localStorage.removeItem("approvePersons");
        localStorage.removeItem("sendingType");
        localStorage.removeItem("signer");
        localStorage.removeItem("foreignBlank");
        localStorage.removeItem("signingWithES");
        localStorage.removeItem("addtnlAgrPrsns");
        localStorage.removeItem("description");
        localStorage.removeItem("partnersList");
        localStorage.removeItem("partnersList");
        localStorage.removeItem("recieverEmployee");
    }
}


export async function hideReportPanelHeader(sender: Layout) {
    console.log("hideReportPanelHeader")
    console.log($(".report-panel>.header"));

    $(".report-panel>.header").attr("style", "display: none !important;")
}


export async function SZcreateFile(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("SZcreateFile")

    let cardId = sender.layout.cardInfo.id
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let res = await SZcreateFileRequest(urlResolver, requestManager, cardId)
    location.reload()
}



export async function SZcreateFileRequest(urlResolver: UrlResolver,
    requestManager: IRequestManager, docId: String) {
    let url = urlResolver.resolveUrl("FillSZDocumentWordFile", "FillTemplates", false);
    console.log(url);
    url += "?documentId=" + docId;
    return requestManager.get(url)
}



export async function fillUISAgrContract(sender: LayoutControl, e: IEventArgs) {
    console.log("fillUISAgrContract");

    let contractTypeControl = sender.layout.controls.directoryDesignerRow2
    let contractType = contractTypeControl.params.value ? contractTypeControl.params.value.name : ""
    let approvePersonsControl = sender.layout.controls.addtnlAgrPrsns1

    if ((contractType == "Ковер-нота") || (contractType == "Перестраховочный слип")) {
        let registrarControl = sender.layout.controls.registrar
        let registrarId = registrarControl.params.value ? registrarControl.params.value.id : ""
        approvePersonsControl.params.value = []

        if (registrarId != "") {
            let urlResolver = sender.layout.getService($UrlResolver);
            let requestManager = sender.layout.getService($RequestManager);
            let additionalApprovers = await getAdditionalApprovers(urlResolver, requestManager, registrarId)
            if (additionalApprovers) {
                let empls = []
                additionalApprovers["empModels"].forEach(element => {
                    empls.push(element)
                    console.log(empls);

                });
                approvePersonsControl.params.value = empls
            }
        }
    } else {
        approvePersonsControl.params.value = []
    }
}


export async function fillUISAgr(sender: LayoutControl, e: IEventArgs) {
    console.log("fillUISAgrmnts");

    let registrarControl = sender.layout.controls.registrar
    let registrarId = registrarControl.params.value ? registrarControl.params.value.id : ""
    let approvePersonsControl = sender.layout.controls.addtnlAgrPrsns
    approvePersonsControl.params.value = []

    if (registrarId != "") {
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        let additionalApprovers = await getAdditionalApprovers(urlResolver, requestManager, registrarId)
        if (additionalApprovers) {
            let empls = []
            additionalApprovers["empModels"].forEach(element => {
                empls.push(element)
            });
            approvePersonsControl.params.value = empls
        }
    }
}


export async function getAdditionalApprovers(urlResolver: UrlResolver, requestManager: IRequestManager, userId: String) {
    let url = urlResolver.resolveUrl("GetAdditionalApprovers", "Employyes");
    url += "?id=" + userId;
    return requestManager.get(url);
}



// export async function fillUISAgrContract(sender: LayoutControl, args: CancelableEventArgs<ICardSavingEventArgs>) {
//     console.log("fillUISAgrContract");

//     args.wait();
//     let contractTypeControl = sender.layout.controls.directoryDesignerRow2
//     let contractType = contractTypeControl.params.value ? contractTypeControl.params.value.name : ""
//     if ((contractType == "Ковер-нота") || (contractType == "Перестраховочный слип")) {

//         let registrarControl = sender.layout.controls.registrar
//         let registrarId = registrarControl.params.value ? registrarControl.params.value.id : ""
//         let approvePersonsControl = sender.layout.controls.addtnlAgrPrsns
//         const sladkihId = "9e32bc82-1d87-41a9-a726-f565480a24a7"
//         const michailovaModel = {
//             "id": "27d8bd37-41a8-4341-b12a-7f3c67de83af",
//             "isCurrent": false,
//             "accountName": null,
//             "displayName": "Михайлова А. О.",
//             "firstName": "Анастасия",
//             "lastName": "Михайлова",
//             "middleName": "Олеговна",
//             "position": "Главный специалист Управления имущественного страхования",
//             "sdid": "62882bc4-1fd9-4cf0-a30d-7463adae5a86",
//             "isFavoritePerformer": false,
//             "unitId": "2730aa74-e40f-4594-9c09-848b0350f8c5",
//             "email": null,
//             "status": 0,
//             "departmentName": null,
//             "dataType": 64
//         }

//         const lukyanovId = "10c2181f-91e5-473c-a112-951b6f66eb06"
//         const kompanenkoModel = {
//             "id": "650b6f83-a34c-4816-ae65-59ef6548c0b3",
//             "isCurrent": false,
//             "accountName": null,
//             "displayName": "Компаненко Ю. А.",
//             "firstName": "Юлия",
//             "lastName": "Компаненко",
//             "middleName": "Александровна",
//             "position": "Заместитель начальника Управления имущественного страхования",
//             "sdid": "62882bc4-1fd9-4cf0-a30d-7463adae5a86",
//             "isFavoritePerformer": false,
//             "unitId": "2730aa74-e40f-4594-9c09-848b0350f8c5",
//             "email": null,
//             "status": 0,
//             "departmentName": null,
//             "dataType": 64
//         }

//         let testovId = "2a4c01c9-3c7a-4d68-adb2-d419ace031d4"
//         const avdushkModel = {
//             "id": "fbc45882-0b18-4759-8124-e35605dc9ca3",
//             "isCurrent": false,
//             "accountName": null,
//             "displayName": "Авдюшкин Н. Н.",
//             "firstName": "Николай",
//             "lastName": "Авдюшкин",
//             "middleName": "Николаевич",
//             "position": "Начальник административного Управления",
//             "sdid": "d2225cca-9f10-421d-b072-1b853aada668",
//             "isFavoritePerformer": false,
//             "unitId": "074e11dd-34d6-42be-bd61-711b4226f97a",
//             "email": null,
//             "status": 0,
//             "departmentName": null,
//             "dataType": 64
//         }

//         let usersid = [avdushkModel.id, kompanenkoModel.id, michailovaModel.id]

//         // for (let i = 0; i < approvePersonsControl.params.value.length; i++) {
//         //     if (usersid.includes(approvePersonsControl.params.value[i].id)) {
//         //         approvePersonsControl.params.value.pop(i)
//         //     }
//         // }

//         if (registrarId == sladkihId) {
//             approvePersonsControl.params.value.push(michailovaModel)
//         }
//         if (registrarId == lukyanovId) {
//             approvePersonsControl.params.value.push(kompanenkoModel)
//         }
//         if (registrarId == testovId) {
//             await approvePersonsControl.params.value.push(avdushkModel)
//         }
//     }
//     args.accept();
// }


// export function fillUISAgr(sender: LayoutControl, e: IEventArgs) {
//     console.log("fillUISAgrmnts");


//     let registrarControl = sender.layout.controls.registrar
//     let registrarId = registrarControl.params.value ? registrarControl.params.value.id : ""
//     let approvePersonsControl = sender.layout.controls.addtnlAgrPrsns
//     const sladkihId = "9e32bc82-1d87-41a9-a726-f565480a24a7"
//     const michailovaModel = {
//         "id": "27d8bd37-41a8-4341-b12a-7f3c67de83af",
//         "isCurrent": false,
//         "accountName": null,
//         "displayName": "Михайлова А. О.",
//         "firstName": "Анастасия",
//         "lastName": "Михайлова",
//         "middleName": "Олеговна",
//         "position": "Главный специалист Управления имущественного страхования",
//         "sdid": "62882bc4-1fd9-4cf0-a30d-7463adae5a86",
//         "isFavoritePerformer": false,
//         "unitId": "2730aa74-e40f-4594-9c09-848b0350f8c5",
//         "email": null,
//         "status": 0,
//         "departmentName": null,
//         "dataType": 64
//     }
//     const lukyanovId = "10c2181f-91e5-473c-a112-951b6f66eb06"
//     const kompanenkoModel = {
//         "id": "650b6f83-a34c-4816-ae65-59ef6548c0b3",
//         "isCurrent": false,
//         "accountName": null,
//         "displayName": "Компаненко Ю. А.",
//         "firstName": "Юлия",
//         "lastName": "Компаненко",
//         "middleName": "Александровна",
//         "position": "Заместитель начальника Управления имущественного страхования",
//         "sdid": "62882bc4-1fd9-4cf0-a30d-7463adae5a86",
//         "isFavoritePerformer": false,
//         "unitId": "2730aa74-e40f-4594-9c09-848b0350f8c5",
//         "email": null,
//         "status": 0,
//         "departmentName": null,
//         "dataType": 64
//     }

//     let testovId = "2a4c01c9-3c7a-4d68-adb2-d419ace031d4"
//     const avdushkModel = {
//         "id": "fbc45882-0b18-4759-8124-e35605dc9ca3",
//         "isCurrent": false,
//         "accountName": null,
//         "displayName": "Авдюшкин Н. Н.",
//         "firstName": "Николай",
//         "lastName": "Авдюшкин",
//         "middleName": "Николаевич",
//         "position": "Начальник административного Управления",
//         "sdid": "d2225cca-9f10-421d-b072-1b853aada668",
//         "isFavoritePerformer": false,
//         "unitId": "074e11dd-34d6-42be-bd61-711b4226f97a",
//         "email": null,
//         "status": 0,
//         "departmentName": null,
//         "dataType": 64
//     }


//     let usersid = [avdushkModel.id, kompanenkoModel.id, michailovaModel.id]

//     for (let i = 0; i < approvePersonsControl.params.value.length; i++) {
//         if (usersid.includes(approvePersonsControl.params.value[i].id)) {
//             approvePersonsControl.params.value.pop(i)
//         }
//     }
//     if (registrarId == sladkihId) {
//         approvePersonsControl.params.value.push(michailovaModel)
//     }
//     if (registrarId == lukyanovId) {
//         approvePersonsControl.params.value.push(kompanenkoModel)
//     }

//     if (registrarId == testovId) {
//         approvePersonsControl.params.value.push(avdushkModel)
//     }

// }


export async function hidePartnerEmployeeTableId(sender: Layout, e: IEventArgs) {
    console.log("hidePartnerEmployeeTableId");
    $("div[data-tipso-text*='ID сотрудника']").attr("style", "display: none !important;")
}


export async function getHeaderInfo(urlResolver: UrlResolver, requestManager: IRequestManager, cardId: String) {
    let url = urlResolver.resolveUrl("GetHeaderInfo", "Reconciliation");
    url += "?documentId=" + cardId;
    return requestManager.get(url);
}


export async function prepAgrORD(sender: AgreementList) {
    console.log("prepAgrORD");

    let cardId = sender.layout.cardInfo.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let agreementList = sender.layout.controls.agreementList;
    let didgest = sender.layout.controls.textBox1.params.value
    let registrarCtrl = sender.layout.controls.registrar
    let registrarName = registrarCtrl.params.value?registrarCtrl.params.value.displayName:"_________________"
    
    layoutManager.cardLayout.controls.agreementList.params.agreementReportOpening.subscribe(
        async (handler, args) => {
        args.data.model.documentName = `${didgest}. Инициатор: ${registrarName}`
    });


    agreementList.params.agreementReportOpened.subscribe(async (handler, args) => {
        console.log("agreementReportOpened");
        let showOnHovRows = document.querySelectorAll('.show-on-hover')
        showOnHovRows.forEach(element => {
            element.classList.remove("show-on-hover")
        });
        let tableItem = document.querySelectorAll('.system-agreement-list-content>div:last-child')
        tableItem[0].setAttribute("style", "font-size:80%;")

        let contentControl = args.contentControl;
        console.log(contentControl);
        args.contentControl.columns.splice(1, 5);
        let columns = contentControl.columns;
        let index = args.contentControl.columns.indexOf(args.contentControl.commentColumn);
        columns.push({
            name: "ФИО согласующего",
            wieght: 1,
            value: (item) => item.fio,
            class: 'fio'
        }, {
            name: "Дата начала",
            wieght: 1,
            value: (item) => item.beginDate,
            class: 'beginDate'
        }, {
            name: "Дата завершения",
            wieght: 1,
            value: (item) => item.endDate,
            class: 'endDate'
        }, {
            name: "Принятое решение",
            wieght: 1,
            value: (item) => item.decision,
            class: 'decision'
        }, {
            name: "Комментарии",
            wieght: 1,
            value: (item) => item.comment,
            class: 'comments'
        });

        let receivedFromSererItems = await getAgreement(urlResolver, requestManager, cardId);
        let ObjectMas = receivedFromSererItems['items']

        args.model.items = ObjectMas.map(serverItem => (
            {
                fio: serverItem['fio'],
                beginDate: moment(serverItem['beginDate']).format('DD.MM.YYYY HH:mm'),
                endDate: moment(serverItem['endDate']).isValid() ? moment(serverItem['endDate']).format('DD.MM.YYYY HH:mm') : '',
                decision: serverItem['decision'],
                comment: serverItem['comment']

            }));
        args.contentControl.forceUpdate();
        let cellsElems = document.querySelectorAll('.table-helper-cell')
        cellsElems.forEach(element => {
            element.classList.add("text-center")
        });
        console.log(columns)
    });
}


export async function prepAgrSZ(sender: AgreementList) {
    console.log("prepAgrSZ");

    let cardId = sender.layout.cardInfo.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let agreementList = sender.layout.controls.agreementList;
    let didgest = sender.layout.controls.textBox1.params.value
    let registrarCtrl = sender.layout.controls.registrar
    let registrarName = registrarCtrl.params.value?registrarCtrl.params.value.displayName:"_________________"
    
    layoutManager.cardLayout.controls.agreementList.params.agreementReportOpening.subscribe(
        async (handler, args) => {
        args.data.model.documentName = `${didgest}. Инициатор: ${registrarName}`
    });


    agreementList.params.agreementReportOpened.subscribe(async (handler, args) => {
        console.log("agreementReportOpened");
        let showOnHovRows = document.querySelectorAll('.show-on-hover')
        showOnHovRows.forEach(element => {
            element.classList.remove("show-on-hover")
        });
        let tableItem = document.querySelectorAll('.system-agreement-list-content>div:last-child')
        tableItem[0].setAttribute("style", "font-size:80%;")

        let contentControl = args.contentControl;
        console.log(contentControl);
        args.contentControl.columns.splice(1, 5);
        let columns = contentControl.columns;
        let index = args.contentControl.columns.indexOf(args.contentControl.commentColumn);
        columns.push({
            name: "ФИО согласующего",
            wieght: 1,
            value: (item) => item.fio,
            class: 'fio'
        }, {
            name: "Дата начала",
            wieght: 1,
            value: (item) => item.beginDate,
            class: 'beginDate'
        }, {
            name: "Дата завершения",
            wieght: 1,
            value: (item) => item.endDate,
            class: 'endDate'
        }, {
            name: "Принятое решение",
            wieght: 1,
            value: (item) => item.decision,
            class: 'decision'
        }, {
            name: "Комментарии",
            wieght: 1,
            value: (item) => item.comment,
            class: 'comments'
        });

        let receivedFromSererItems = await getAgreement(urlResolver, requestManager, cardId);
        let ObjectMas = receivedFromSererItems['items']

        args.model.items = ObjectMas.map(serverItem => (
            {
                fio: serverItem['fio'],
                beginDate: moment(serverItem['beginDate']).format('DD.MM.YYYY HH:mm'),
                endDate: moment(serverItem['endDate']).isValid() ? moment(serverItem['endDate']).format('DD.MM.YYYY HH:mm') : '',
                decision: serverItem['decision'],
                comment: serverItem['comment']

            }));
        args.contentControl.forceUpdate();
        let cellsElems = document.querySelectorAll('.table-helper-cell')
        cellsElems.forEach(element => {
            element.classList.add("text-center")
        });
        console.log(columns)
    });
}


export async function prepFillAgreementContract(sender: AgreementList) {
    console.log("prepFillAgreementContract");

    let typicalFormFlagControl = sender.layout.controls.checkBox1.params.value
    let TFFLabel = typicalFormFlagControl ? " (типовая форма)" : ""

    let cardId = sender.layout.cardInfo.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);

    let headerInfo = await getHeaderInfo(urlResolver, requestManager, cardId)
    let fioSDL = headerInfo["fioSDL"] ? headerInfo["fioSDL"] : "_________________"
    let dateSDL = headerInfo["dateSDl"] ? headerInfo["dateSDl"] : "_________________"
    let fioReadTask = headerInfo["fioReadTask"] ? headerInfo["fioReadTask"] : "_________________"
    let dateReadTask = headerInfo["dateReadTask"] ? headerInfo["dateReadTask"] : "_________________"

    console.log(headerInfo);

    let advicerHeader = `\n\nСоветник по вопросам безопасности ${fioSDL}: «Сведения и документы о клиенте, предоставителе клиента, выгодоприобретателе, бенефициарном владельце в соответствии с Правилами внутреннего контроля получены ${dateSDL}»`
    


    let bossReadHeader = `\n\nРуководитель подразделения, исполняющего договор ${fioReadTask} с проектом договора ознакомлен ${dateReadTask}`
    let agreementList = sender.layout.controls.agreementList

    let docTypeControl = sender.layout.controls.directoryDesignerRow2
    let docType = docTypeControl.params.value == null ? "" : docTypeControl.params.value.name

    if (docType=="Соглашение о конфиденциальности") {
        advicerHeader = ''
    }
    let docTypeNumControl = sender.layout.controls.regNumber
    let docTypeNum = (docTypeNumControl.params.value) == null ? "" : docTypeNumControl.params.value.number
    docType += docTypeNum == "" ? '' : " № " + docTypeNum
    let docKindControl = sender.layout.controls.directoryDesignerRow1
    let docKind = docKindControl.params.value == null ? "" : docKindControl.params.value.name
    let docKindNumControl = sender.layout.controls.DSNumber
    let docKindNum = docKindNumControl.params.value ? docKindNumControl.params.value : ""
    docKind += docKindNum == "" ? '' : " № " + docKindNum

    if (docType != "" && docKind != "") {
        docKind += " к "
    }
    let docDescr = docKind + docType

    let contractDateControl = sender.layout.controls.dateOfContract
    let contractDate = contractDateControl.params.value ?
        moment(contractDateControl.params.value).format('L') : "_________________"
    let initiatorControl = sender.layout.controls.employee1

    layoutManager.cardLayout.controls.agreementList.params.agreementReportOpening.subscribe(async (handler, args) => {
        args.data.model.documentName = `${docDescr} от ${contractDate}. Инициатор: ${initiatorControl.params.value.displayName}`
        args.data.model.documentName += advicerHeader
        args.data.model.documentName += bossReadHeader
    });


    agreementList.params.agreementReportOpened.subscribe(async (handler, args) => {
        console.log("agreementReportOpened");
        $(".agreement-list-title").html("Лист согласования" + TFFLabel)
        let showOnHovRows = document.querySelectorAll('.show-on-hover')
        showOnHovRows.forEach(element => {
            element.classList.remove("show-on-hover")
        });
        let tableItem = document.querySelectorAll('.system-agreement-list-content>div:last-child')
        tableItem[0].setAttribute("style", "font-size:80%;")

        let contentControl = args.contentControl;
        console.log(contentControl);
        args.contentControl.columns.splice(1, 5);
        let columns = contentControl.columns;
        let index = args.contentControl.columns.indexOf(args.contentControl.commentColumn);
        columns.push({
            name: "ФИО согласующего",
            wieght: 1,
            value: (item) => item.fio,
            class: 'fio'
        }, {
            name: "Дата начала",
            wieght: 1,
            value: (item) => item.beginDate,
            class: 'beginDate'
        }, {
            name: "Дата завершения",
            wieght: 1,
            value: (item) => item.endDate,
            class: 'endDate'
        }, {
            name: "Принятое решение",
            wieght: 1,
            value: (item) => item.decision,
            class: 'decision'
        }, {
            name: "Комментарии",
            wieght: 1,
            value: (item) => item.comment,
            class: 'comments'
        });

        let receivedFromSererItems = await getAgreement(urlResolver, requestManager, cardId);
        let ObjectMas = receivedFromSererItems['items']

        args.model.items = ObjectMas.map(serverItem => (

            {

                fio: serverItem['fio'],
                beginDate: moment(serverItem['beginDate']).format('DD.MM.YYYY HH:mm'),
                endDate: moment(serverItem['endDate']).isValid() ? moment(serverItem['endDate']).format('DD.MM.YYYY HH:mm') : '',
                decision: serverItem['decision'],
                comment: serverItem['comment']

            }));

        args.contentControl.forceUpdate();
        let cellsElems = document.querySelectorAll('.table-helper-cell')
        cellsElems.forEach(element => {
            element.classList.add("text-center")
        });
        console.log(columns)
    });
}


export async function prepAgrListOutLettr(sender: AgreementList) {
    console.log("prepAgrListOutLettr");

    let cardId = sender.layout.cardInfo.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let agreementList = sender.layout.controls.agreementList;
    let initiatorControl = sender.layout.controls.employee1
    let didgest = sender.layout.controls.textBox3.params.value

    layoutManager.cardLayout.controls.agreementList.params.agreementReportOpening.subscribe(async (handler, args) => {
        args.data.model.documentName = `${didgest}. Инициатор: ${initiatorControl.params.value.displayName}`
    });


    agreementList.params.agreementReportOpened.subscribe(async (handler, args) => {
        console.log("agreementReportOpened");
        let showOnHovRows = document.querySelectorAll('.show-on-hover')
        showOnHovRows.forEach(element => {
            element.classList.remove("show-on-hover")
        });
        let tableItem = document.querySelectorAll('.system-agreement-list-content>div:last-child')
        tableItem[0].setAttribute("style", "font-size:80%;")

        let contentControl = args.contentControl;
        console.log(contentControl);
        args.contentControl.columns.splice(1, 5);
        let columns = contentControl.columns;
        let index = args.contentControl.columns.indexOf(args.contentControl.commentColumn);
        columns.push({
            name: "ФИО согласующего",
            wieght: 1,
            value: (item) => item.fio,
            class: 'fio'
        }, {
            name: "Дата начала",
            wieght: 1,
            value: (item) => item.beginDate,
            class: 'beginDate'
        }, {
            name: "Дата завершения",
            wieght: 1,
            value: (item) => item.endDate,
            class: 'endDate'
        }, {
            name: "Принятое решение",
            wieght: 1,
            value: (item) => item.decision,
            class: 'decision'
        }, {
            name: "Комментарии",
            wieght: 1,
            value: (item) => item.comment,
            class: 'comments'
        });


        let receivedFromSererItems = await getAgreement(urlResolver, requestManager, cardId);
        let ObjectMas = receivedFromSererItems['items']

        args.model.items = ObjectMas.map(serverItem => (

            {
                fio: serverItem['fio'],
                beginDate: moment(serverItem['beginDate']).format('DD.MM.YYYY HH:mm'),
                endDate: moment(serverItem['endDate']).isValid() ? moment(serverItem['endDate']).format('DD.MM.YYYY HH:mm') : '',
                decision: serverItem['decision'],
                comment: serverItem['comment']

            }));

        args.contentControl.forceUpdate();
        let cellsElems = document.querySelectorAll('.table-helper-cell')
        cellsElems.forEach(element => {
            element.classList.add("text-center")
        });
        console.log(columns)

    });
}


export async function getAgreement(urlResolver: UrlResolver, requestManager: IRequestManager, cardId: String) {
    let url = urlResolver.resolveUrl("GetReconciliationList", "Reconciliation");
    url += "?documentId=" + cardId;
    return requestManager.get(url);
}



export async function addProfileTableClasses(sender: Layout, e: IEventArgs) {
    console.log("addProfileTableClasses()")
    let cellsElems = document.querySelectorAll('.table-helper-cell')
    console.log(cellsElems)
    for (let i = 0; i < cellsElems.length / 3; i++) {
        console.log("cycle")
        cellsElems[i * 3].classList.add("file-icon-cell")
        // cellsElems[i*4].children[0].classList.add("file-icon")
        cellsElems[i * 3 + 1].classList.add("checkbox-input-cell")
        cellsElems[i * 3 + 1].children[0].classList.add("checkbox-input")
        cellsElems[i * 3 + 2].classList.add("rubbish-cell")
    }
}


export async function addClassesToFileControl(sender: Layout, e: IEventArgs) {
    console.log("addClassesToFileControl()")
    let cellsElems = document.querySelectorAll('.file-table-body div.table-helper-cell')
    console.log(cellsElems)
    for (let i = 0; i < cellsElems.length / 4; i++) {
        console.log("cycle")
        cellsElems[i * 4].classList.add("file-icon-cell")
        cellsElems[i * 4].children[0].classList.add("file-icon")
        cellsElems[i * 4 + 1].classList.add("file-name-cell")
        cellsElems[i * 4 + 1].children[0].classList.add("file-version")
        cellsElems[i * 4 + 2].classList.add("file-version-cell")
        cellsElems[i * 4 + 2].children[0].classList.add("file-version")
        cellsElems[i * 4 + 3].classList.add("file-settings-cell")
        cellsElems[i * 4 + 3].children[0].classList.add("file-settings")
    }
}


export async function cancel(sender: Layout) {
    console.log("cancel")
    window.history.back();
}


export async function changeLastAuthorAndSave(sender: Layout) {
    console.log("changeLastAuthorAndSave")
    let lastAuthorControl = sender.layout.controls.lastChangeAuthor
    let CurrentUser = sender.layout.getService($CurrentEmployee)
    lastAuthorControl.params.value = CurrentUser
    // await lastAuthorControl.save()
    await layoutManager.cardLayout.save()
    let viewUrl = window.location.href.replace("CardEdit", "CardView")
    window.location.href = viewUrl;
    console.log("success")
}



export async function changeLogo(sender: Layout, e: IEventArgs) {
    console.log("changeLogo")
    $('#company-logo').addClass('hidden-bef')
    $('#company-logo').append(`<div class="company-logo-img"></div>`)

}


export async function rewriteStyle() {
    console.log("rewriteStyle")
    $('.label-cell_align-top').removeAttr('style')
}


// Флаг "Не резидент" меняет видимость и обязательность некоторых полей
export async function setNotResOrgFormVis(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("setOrgFormVis")

    let notResidentFlag = sender.layout.controls.notResidentFlag
    let notResOrganizationForm = sender.layout.controls.notResOrganizationForm
    let country = sender.layout.controls.country
    let TIN = sender.layout.controls.TIN
    let INN = sender.layout.controls.INN

    if (notResidentFlag.params.value) {
        notResOrganizationForm.params.visibility = true
        country.params.visibility = true
        TIN.params.visibility = true
        INN.params.required = false
    } else {
        notResOrganizationForm.params.visibility = false
        country.params.visibility = false
        TIN.params.visibility = false
        INN.params.required = true
    }
}


export async function changeStateToArchive(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("changeStateToArchive")


    let stateId = sender.layout.controls.state.params.value.stateId.toUpperCase()
    const toArchiveTransitionId = "D0DAD72C-E7C2-4BC3-B816-667C48AFC9EE"
    const createdStateId = "32EC920B-9263-492B-81A0-3F4BF50F7E4B".toUpperCase()
    const isApprovedStateId = "72ADF2C6-239B-49BE-B0AF-49A8E580EBC1".toUpperCase()

    console.log("((stateId == draftingStateId) || (stateId == isApprovedStateId))",
        ((stateId == createdStateId) || (stateId == isApprovedStateId)))
    if (stateId == createdStateId || stateId == isApprovedStateId) {
        await sender.layout.changeState(toArchiveTransitionId)
        location.reload()
    } else {
        console.log('you cant archive from this state!')
    }
}


export async function createFile(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("createFile")

    let cardId = sender.layout.cardInfo.id
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let res = await createFileRequest(urlResolver, requestManager, cardId)
    location.reload()

}



export async function createFileRequest(urlResolver: UrlResolver,
    requestManager: IRequestManager, docId: String) {
    let url = urlResolver.resolveUrl("FillOutgoingDocumentWordFile", "FillTemplates", false);
    console.log(url);
    url += "?documentId=" + docId;
    return requestManager.get(url)
}


export async function registerORD(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("registerORD")

    let stateId = sender.layout.controls.state.params.value.stateId.toUpperCase()
    const draftingStateId = "bfc5eff9-8a46-4edb-b821-5be2b9cb69d8".toUpperCase()
    const isApprovedStateId = "8D7E3866-9908-4B52-95E4-6801B6A2D201".toUpperCase()
    const registrateOperation = "72A89008-4EA0-448D-9BA9-9F6181DACD3D"
    let regDate = sender.layout.controls.regDate
    let numerator = sender.layout.controls.numerator

    console.log("((stateId == draftingStateId) || (stateId == isApprovedStateId))",
        ((stateId == draftingStateId) || (stateId == isApprovedStateId)))

    if (stateId == draftingStateId || stateId == isApprovedStateId) {
        if (numerator.value.number == null) {
            await numerator.generateNewNumber()
        }
        regDate.params.value = moment()
        await regDate.save()
        await sender.layout.changeState(registrateOperation)
    } else {
        console.log('cant register from this state!')
        return
    }
    location.reload()
}



// export async function hideRegisterSignedBtn(sender: Layout) {
//     console.log("hideRegisterSignedBtn");

//     const signedStateId = "9aec79df-4f1f-4d57-a481-f21b9f3428ba"
//     let currentStateId = sender.layout.controls.state.params.value.stateId.toLowerCase()
//     if (currentStateId != signedStateId) {
//         let regBtn = sender.layout.controls.registerSignedBtn.params.visibility = false
//     }
// }


// export async function registerSignedOutCome(sender: Layout) {
//     console.log("registerSignedOutCome");

//     let numId = layoutManager.cardLayout.controls.regNumber.value.id
//     let documentId = layoutManager.cardLayout.cardInfo.id

//     let urlResolver = sender.layout.getService($UrlResolver);
//     let requestManager = sender.layout.getService($RequestManager);

//     if (numId) {
//         var resp = await checkRegNum(urlResolver, requestManager, documentId, numId)
//     } 
    
//     if ((!numId)||(!resp)) {
//         await sender.layout.controls.regNumber.generateNewNumber() 
//         let regDate = sender.layout.controls.regDate 
//         regDate.value = moment() 
//         regDate.save() 
//     } else {
//         MessageBox.ShowInfo('Попытка повторной генерации номера', 'Существующий номер уже был сгенерирован.')
//     }
// }


export async function registerOutCome(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("registerOutCome")

    let numerator = sender.layout.controls.regNumber;
    let stateId = sender.layout.controls.state.params.value.stateId
    const draftingStateId = "AAE1C071-82E9-4D4B-9219-9F172BF0B071"
    const isApprovedStateId = "5CF670C9-6EAE-40A2-974E-ADF269720177"
    let regDate = sender.layout.controls.regDate

    // console.log("(numerator.value.number == null)", (numerator.value.number == null))
    console.log("((stateId == draftingStateId) || (stateId == isApprovedStateId))",
        ((stateId == draftingStateId) || (stateId == isApprovedStateId)))

    if ((stateId.toUpperCase() == draftingStateId.toUpperCase()) ||
        (stateId.toUpperCase() == isApprovedStateId.toUpperCase())) {
        if (numerator.value.number == null) {
            await numerator.generateNewNumber()
        }
        regDate.params.value = moment()
        await regDate.save()
        await sender.layout.changeState("A5875A98-12A7-4EB2-A581-4FF7912B32BB")
    } else {
        
        console.log('wrong state now or number already exist!')
        // В состоянии подписано
        const signedStateId = "9aec79df-4f1f-4d57-a481-f21b9f3428ba"
        let currentStateId = sender.layout.controls.state.params.value.stateId.toLowerCase()
        if (currentStateId == signedStateId) {
            let numId = layoutManager.cardLayout.controls.regNumber.value.id
            let documentId = layoutManager.cardLayout.cardInfo.id

            let urlResolver = sender.layout.getService($UrlResolver);
            let requestManager = sender.layout.getService($RequestManager);

            if (numId) {
                var resp = await checkRegNum(urlResolver, requestManager, documentId, numId)
            } 
            
            if ((!numId)||(!resp)) {
                await sender.layout.controls.regNumber.generateNewNumber() 
                let regDate = sender.layout.controls.regDate 
                regDate.value = moment() 
                regDate.save() 
            } else {
                MessageBox.ShowInfo('Попытка повторной генерации номера', 'Существующий номер уже был сгенерирован.')
            }
        }
        return
    }
    location.reload()
}


export async function loadPartnersDepsTree(urlResolver: UrlResolver, requestManager: IRequestManager) {
    let url = urlResolver.resolveApiUrl("loadTree", "layoutPartner");
    let postdata = {
        maxCount: 31,
        refreshToken: 0,
        searchMode: 0,
        skip: 0,
    }
    return requestManager.post(url, JSON.stringify(postdata));
}


export async function fillPartnersDep(sender: Layout, e: IEventArgs) {
    console.log("fillPartnersDep")

    let numRows = sender.layout.controls.personsTable.rows.length
    let partnersEmplId = sender.layout.controls.get("recieverEmployee")
    let partnerDepartments = sender.layout.controls.get("partnerDepartment")
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)

    for (let i = 0; i < numRows; i++) {
        partnerDepartments[i].params.value = null
        if (partnersEmplId[i].params.value) {

            console.log("partnerEmplId=", partnersEmplId[i].params.value.id);

            await getPartnerDepId(urlResolver, requestManager, partnersEmplId[i].params.value.id)
                .then((data) => {
                    console.log("depId=", data);
                    partnerDepartments[i].params.value = data
                    // partnerDepartments[i].params.value = findDep(partnersDepsModels,
                    //      String(data))
                })
                .catch((ex) => {
                    MessageBox.ShowError(ex, "Подразделение получателя не заполнено.");
                })
        }

    }
}


export async function getPartnerDepId(urlResolver: UrlResolver,
    requestManager: IRequestManager, emplId: String) {
    let url = urlResolver.resolveApiUrl("GetPartnerByEmployee", "PartnerService");
    url += "?id=" + emplId;
    return requestManager.get(url)
}


export async function sendToReceiverOnWatch(sender: Layout, e: IEventArgs) {
    console.log("sendToAcquaintance")

    let cardId = sender.layout.cardInfo.id

    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    await sendToRecieverOnWatchRequest(urlResolver, requestManager, cardId)
        .then((data) => {
            console.log(data);
            location.reload()
        })
        .catch((ex) => {
            MessageBox.ShowError(ex, "Задание на ознакомление не отправлено.");
        })
}


export async function sendToRecieverOnWatchRequest(urlResolver: UrlResolver,
    requestManager: IRequestManager, cardId: String) {
    let url = urlResolver.resolveApiUrl("CreateRedingTask", "TaskService");
    url += "?CardId=" + cardId;
    return requestManager.get(url)
}


export async function addRedirect(button, partnerCardId, buttonCtrl) {
    console.log("addRedirect")

    let cardViewLink = "#/CardView/" + partnerCardId
    console.log(cardViewLink);
    button.addEventListener('click', function () {
        window.open(cardViewLink, "ParnterCard#" + partnerCardId).focus()
    })

    buttonCtrl.params.visibility = true

}


export async function addTableButtonsLinks(sender: Layout, e: IEventArgs) {
    console.log("addTableButtonsLinks")

    let numRows = sender.layout.controls.personsTable.rows.length
    let partners = sender.layout.controls.get("partnerDepartment")
    let buttons = document.querySelectorAll(".dv-control.system-button.compact-mode")
    let buttonsCtrls = sender.layout.controls.get("customButton1")

    for (let i = 0; i < numRows; i++) {
        buttonsCtrls[i].params.visibility = false
        if (partners[i].params.value) {
            let partnerId = partners[i].params.value.id
            let urlResolver = sender.layout.getService($UrlResolver)
            let requestManager = sender.layout.getService($RequestManager)
            await getPartnerInfo(urlResolver, requestManager, partnerId)
                .then((data) => {
                    console.log("numRow:", i);
                    console.log(partners[i].params.value.name);
                    addRedirect(buttons[i], data["partnerCardID"], buttonsCtrls[i])
                })
                .catch((ex) => {
                    MessageBox.ShowError(ex, "ID и датаСДЛ партнера не заполнена.");
                })
        }

    }
}


export async function fillPartnersIdDate(sender: Layout, e: IEventArgs) {
    console.log("fillPartnersIdDate")

    let numRows = sender.layout.controls.personsTable.rows.length
    let partners = sender.layout.controls.get("partnerDepartment")
    let partnersSDLdate = sender.layout.controls.get("partnerSDLdate")
    let buttonsCtrls = sender.layout.controls.get("customButton1")
    let buttons = document.querySelectorAll(".dv-control.system-button.compact-mode")

    for (let i = 0; i < numRows; i++) {
        buttonsCtrls[i].params.visibility = false
        partnersSDLdate[i].params.value = null
        if (partners[i].params.value) {

            let partnerId = partners[i].params.value.id
            let urlResolver = sender.layout.getService($UrlResolver)
            let requestManager = sender.layout.getService($RequestManager)
            await getPartnerInfo(urlResolver, requestManager, partnerId)
                .then((data) => {
                    addRedirect(buttons[i], data["partnerCardID"], buttonsCtrls[i])
                    if (data["dateSDL"] != "0001-01-01T00:00:00") {
                        partnersSDLdate[i].params.value = Date.parse(data["dateSDL"])
                    }

                })
                .catch((ex) => {
                    MessageBox.ShowError(ex, "Кнопка перехода и датаСДЛ партнера не заполнена.");
                })
        }
    }
}


export async function fillPartnersIdDateOld(sender: Layout, e: IEventArgs) {
    console.log("fillPartnersIdDate")

    let numRows = sender.layout.controls.personsTable.rows.length
    let partners = sender.layout.controls.get("partnerDepartment")
    let partnersSDLdate = sender.layout.controls.get("partnerSDLdate")
    let partnersCardId = sender.layout.controls.get("partnerCardId")
    let buttons = document.querySelectorAll(".dv-control.system-button.compact-mode")
    let cardViewLink = ''

    for (let i = 0; i < numRows; i++) {
        if (partners[i].params.value) {
            let partnerId = partners[i].params.value.id
            let urlResolver = sender.layout.getService($UrlResolver)
            let requestManager = sender.layout.getService($RequestManager)
            await getPartnerInfo(urlResolver, requestManager, partnerId)
                .then((data) => {

                    console.log(data["partnerCardID"]);
                    cardViewLink = "#/CardView/" + data["partnerCardID"]
                    buttons[i].addEventListener('click', function () {
                        window.open(cardViewLink, cardViewLink).focus()
                    })
                    partnersSDLdate[i].params.value = Date.parse(data["dateSDL"])
                    partnersCardId[i].params.value = data["partnerCardID"]

                })
                .catch((ex) => {
                    MessageBox.ShowError(ex, "ID и датаСДЛ партнера не заполнена.");
                })
        }
    }
}


export async function getPartnerInfo(urlResolver: UrlResolver,
    requestManager: IRequestManager, id: String) {
    let url = urlResolver.resolveApiUrl("GetPartnerCardInfo", "PartnerService");
    url += "?id=" + id;
    return requestManager.get(url)
}


export async function fillPartnerPosition(sender: Layout, e: IEventArgs) {
    console.log("fillPartnerPosition")

    let recieverPost = sender.layout.controls.recieverPost
    recieverPost.params.value = null
    let partnerControl = sender.layout.controls.recieverEmployee
    let partnerId = partnerControl.params.value.id


    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    await getPartnerPosition(urlResolver, requestManager, partnerId)
        .then((data: string) => {
            recieverPost.params.value = data
        })
        .catch((ex) => {
            MessageBox.ShowError(ex, "Должность партнера не заполнена.");
        })
}


export async function fillPartnersPositions(sender: Layout, e: IEventArgs) {
    console.log("fillPartnersPositions")

    let numRows = sender.layout.controls.personsTable.rows.length
    let partners = sender.layout.controls.get("recieverEmployee")
    let recieverPosts = sender.layout.controls.get("recieverPost")

    for (let i = 0; i < numRows; i++) {
        if (partners[i].params.value) {
            let partnerId = partners[i].params.value.id

            let urlResolver = sender.layout.getService($UrlResolver)
            let requestManager = sender.layout.getService($RequestManager)
            await getPartnerPosition(urlResolver, requestManager, partnerId)
                .then((data: string) => {
                    recieverPosts[i].params.value = data
                })
                .catch((ex) => {
                    MessageBox.ShowError(ex, "Должность партнера не заполнена.");
                })
        } else {
            recieverPosts[i].params.value = null
        }
    }
}


export async function getPartnerPosition(urlResolver: UrlResolver,
    requestManager: IRequestManager, id: String) {
    let url = urlResolver.resolveApiUrl("GetPartnerPosition", "PartnerService");
    url += "?id=" + id;
    return requestManager.get(url)
}


export async function fillNumeratorControl(sender: Layout, e: IEventArgs) {
    console.log("fillNumeratorControl")

    let numerator = sender.layout.controls.numerator
    if (numerator) {
        console.log(123);
    }
    // if (numerator.params.value.number == null) {
    numerator.generateNewNumber()

    await layoutManager.cardLayout.changeState('ac38bdc0-a8e7-4429-88b8-ae2e4157d727');
    // }
}


export async function SZhideExtraBlocks(sender: Layout, e: IEventArgs) {
    console.log("hideExtraBlocks")

    let educationNoteInfoBlock = sender.layout.controls.educationNoteInfoBlock
    let businessTripBlock = sender.layout.controls.businessTripBlock
    let otherInfoBlock = sender.layout.controls.otherInfoBlock

    educationNoteInfoBlock.params.visibility = false
    businessTripBlock.params.visibility = false
    otherInfoBlock.params.visibility = false

    let noteTypeControl = sender.layout.controls.noteType
    let noteTypeName = ""
    if (noteTypeControl.params.value) {
        noteTypeName = noteTypeControl.params.value.name
    }


    if (noteTypeName == "На обучение") {
        educationNoteInfoBlock.params.visibility = true
    }
    if (noteTypeName == "На командирование") {
        businessTripBlock.params.visibility = true
    }
    if (noteTypeName == "Иного характера") {
        otherInfoBlock.params.visibility = true
    }
}


export async function SZfillRegistrarBossControl(sender: Layout, e: IEventArgs) {
    console.log("SZfillRegistrarBossControl")
    let registrarControl = sender.layout.controls.registrar
    let registrarBoss = sender.layout.controls.registrarBoss
    registrarBoss.params.value = null
    if (registrarControl.params.value) {
        let registrarId = sender.layout.controls.registrar.params.value.id
        let urlResolver = sender.layout.getService($UrlResolver)
        let requestManager = sender.layout.getService($RequestManager)
        await getEmployeeBoss(urlResolver, requestManager, registrarId)
            .then((data: string) => {
                registrarBoss.params.value = data
            })
            .catch((ex) => {
                MessageBox.ShowError(ex, "Руководитель не заполнен.");
            })
    }
}


export async function getEmployeeBoss(urlResolver: UrlResolver, requestManager: IRequestManager, id: String) {
    let url = urlResolver.resolveUrl("GetManagerModel", "Employyes");
    url += "?id=" + id;
    return requestManager.get(url)
}


export async function SZfillZGDCuratorControl(sender: Layout, e: IEventArgs) {
    console.log("SZfillZGDCuratorControl")
    let ZGDCurator = sender.layout.controls.ZGDCurator
    ZGDCurator.params.value = null
    let registrarId = sender.layout.controls.registrar.params.value.id
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    await getZGDModel(urlResolver, requestManager, registrarId)
        .then((data: string) => {
            ZGDCurator.params.value = data
        })
        .catch((ex) => {
            MessageBox.ShowError(ex, "ЗГД Куратор не заполнен.");
        })
}


export async function getZGDModel(urlResolver: UrlResolver, requestManager: IRequestManager, id: String) {
    let url = urlResolver.resolveApiUrl("getZGDModel", "EmployeeService");
    url += "?id=" + id;
    return requestManager.get(url)
}


export async function savePartner(sender: Layout, e: IEventArgs) {
    console.log("savePartner")

    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let timestamp = sender.layout.cardInfo.timestamp
    let cardId = sender.layout.cardInfo.id
    let dataPartners = await savePartnerRequest(urlResolver, requestManager, cardId)
    console.log("savePartnerRequest.success:", dataPartners["success"]);
    // let router = sender.layout.getService($Router)  
    // router.goTo('/CardView/' + cardId)      
}


export async function savePartnerRequest(urlResolver: UrlResolver, requestManager: IRequestManager, cardId: String) {
    let url = urlResolver.resolveApiUrl("CreatePartnerFromCard", "PartnerService");
    url += "?cardID=" + cardId;
    return requestManager.get(url)
}


export async function setDefaultSigner(sender: Layout, e: IEventArgs) {
    console.log("setDefaultSigner");
    let signerControl = sender.layout.controls.signer
    if (signerControl) {
        signerControl.params.value = {
            "id": "28cbfb2a-c3d6-4e34-a6fe-c7f0e5ad1f66",
            "isCurrent": false,
            "accountName": null,
            "displayName": "Кутумов А. М.",
            "firstName": "Алексей",
            "lastName": "Кутумов",
            "middleName": "Михайлович",
            "position": "Генеральный директор",
            "sdid": "62882bc4-1fd9-4cf0-a30d-7463adae5a86",
            "isFavoritePerformer": false,
            "unitId": "f5946893-9fe8-474e-a09f-30198199dccd",
            "email": null,
            "status": 0,
            "departmentName": null,
            "dataType": 64
        }
    }
}