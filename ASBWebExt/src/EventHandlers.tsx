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


export async function changeLogo(sender:Layout, e: IEventArgs) {
    $('#company-logo').addClass('hidden-bef')
    $('#company-logo').append(`<div class="company-logo-img"></div>`)
    
}


export async function rewriteStyle () {
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
     ((stateId == createdStateId) ||  (stateId == isApprovedStateId)))
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
     ((stateId == draftingStateId) ||  (stateId == isApprovedStateId)))

    if (stateId == draftingStateId || stateId == isApprovedStateId) {
        await numerator.generateNewNumber()
        await sender.layout.changeState(registrateOperation)
        regDate.params.value = moment()
        regDate.save()
        setTimeout(() => { console.log("World!"); }, 3000);
        location.reload()
    } else {
        console.log('cant register from this state!')
    }
}


export async function registerOutCome(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("registerOutCome")

    let numerator = sender.layout.controls.regNum;
    let stateId = sender.layout.controls.state.params.value.stateId 
    const draftingStateId = "AAE1C071-82E9-4D4B-9219-9F172BF0B071"
    const isApprovedStateId = "5CF670C9-6EAE-40A2-974E-ADF269720177"
    let regDate = sender.layout.controls.regDate

    // console.log(typeof(numerator.params.value.number))
    console.log("(numerator.value.number == null)", (numerator.value.number == null))
    console.log("((stateId == draftingStateId) || (stateId == isApprovedStateId))",
     ((stateId == draftingStateId) ||  (stateId == isApprovedStateId)))

    if ((numerator.value.number == null)&&((stateId.toUpperCase() == draftingStateId.toUpperCase()) ||
     (stateId.toUpperCase() == isApprovedStateId.toUpperCase()))) {
        await sender.layout.changeState("A5875A98-12A7-4EB2-A581-4FF7912B32BB")
        await numerator.generateNewNumber();
        regDate.params.value = moment()
        regDate.save()
        location.reload()
    } else {
        console.log('wrong state now or number already exist!')
    }
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

        console.log("partnerEmplId=", partnersEmplId[i].params.value.id);
        
        await getPartnerDepId(urlResolver, requestManager, partnersEmplId[i].params.value.id)
            .then((data) => {
                console.log("depId=",data);
                partnerDepartments[i].params.value = data
                // partnerDepartments[i].params.value = findDep(partnersDepsModels,
                //      String(data))
            })
            .catch((ex) => {
                MessageBox.ShowError(ex, "Подразделение получателя не заполнено.");
            })
            
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
                    partnersSDLdate[i].params.value = Date.parse(data["dateSDL"])
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

    let partner = sender.layout.controls.recieverEmployee
    let recieverPosts = sender.layout.controls.recieverPost

    let partnerId = partner.params.value.id
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    await getPartnerPosition(urlResolver, requestManager, partnerId)
        .then((data: string) => {
            recieverPosts.params.value = data
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
    let url = urlResolver.resolveApiUrl("GetManagerModel", "EmployeeService");
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