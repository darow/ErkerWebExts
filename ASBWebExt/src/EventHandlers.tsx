import { $UrlResolver } from "@docsvision/webclient/System/$UrlResolver";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager";
import { UrlResolver } from "@docsvision/webclient/System/UrlResolver";
import {MessageBox} from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import {$Router, $RouterNavigation, IRouterNavigation} from "@docsvision/webclient/System/$Router";
import {layoutManager} from "@docsvision/webclient/System/LayoutManager";
import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import { LayoutControlFactory } from "@docsvision/webclient/System/LayoutControlFactory";


export async function addTableButtonsLinks(sender: Layout, e: IEventArgs) {
    console.log("addTableButtonsLinks")

    let numRows = sender.layout.controls.personsTable.rows.length 
    let partners = sender.layout.controls.get("partnersDepartment")
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
                cardViewLink = "#/CardView/"+data["partnerCardID"]
                buttons[i].addEventListener('click', function() {
                    window.open(cardViewLink,cardViewLink).focus()
                })
            })
            .catch((ex) => {
                MessageBox.ShowError( ex,"ID и датаСДЛ партнера не заполнена.");
            })
        }

    }
}


export async function fillPartnersIdDate(sender: Layout, e: IEventArgs) {
    console.log("fillPartnersIdDate")

    let numRows = sender.layout.controls.personsTable.rows.length    
    let partners = sender.layout.controls.get("partnersDepartment")
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
                    cardViewLink = "#/CardView/"+data["partnerCardID"]
                    buttons[i].addEventListener('click', function() {
                        window.open(cardViewLink,cardViewLink).focus()
                    })
                    partnersSDLdate[i].params.value = Date.parse(data["dateSDL"])
                    partnersCardId[i].params.value = data["partnerCardID"]

                })
                .catch((ex) => {
                    MessageBox.ShowError( ex,"ID и датаСДЛ партнера не заполнена.");
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
        MessageBox.ShowError( ex,"Должность партнера не заполнена.");
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
                    MessageBox.ShowError( ex,"Должность партнера не заполнена.");
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
                MessageBox.ShowError( ex,"Руководитель не заполнен.");
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
            MessageBox.ShowError( ex,"ЗГД Куратор не заполнен.");
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