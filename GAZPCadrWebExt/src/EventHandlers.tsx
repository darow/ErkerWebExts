import {IEventArgs} from "@docsvision/webclient/System/IEventArgs";
import {Layout} from "@docsvision/webclient/System/Layout";
import {IDataChangedEventArgs} from "@docsvision/webclient/System/IDataChangedEventArgs";
import {NumberControl} from "@docsvision/webclient/Platform/Number";
import moment from 'moment'
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver";
import {UrlResolver} from "@docsvision/webclient/System/UrlResolver";
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager";
import {MessageBox} from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { $Router } from "@docsvision/webclient/System/$Router";


export async function createNewOrder(sender){
    console.log("createNewOrder");

    let inputs = document.getElementsByTagName('input')
    let tr = document.getElementsByClassName('system-grid-data-row')
    let trueArray = []
    let arrayIds = []

    for(let i=0; i<inputs.length; i++){
            if(inputs[i].classList.length == 0 && inputs[i].id != 'search-context-option'){
                    trueArray.push(inputs[i])
            }
    }

    console.log(trueArray)
    trueArray.splice(0, 1);
    console.log(trueArray)
    for(let i=0; i<trueArray.length; i++){

        if(trueArray[i].checked == true){
            let trueId = tr[i].id.substring(0, tr[i].id.length-1)
            trueId = trueId.substring(1)
            arrayIds.push(trueId)
        }
    }

    let router = sender.layout.getService($Router)
    localStorage.setItem('cardIds', JSON.stringify(arrayIds))
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let folderId = window.location.href.split("Folder/")[1].split("?")[0]

    let data = await getAgreementPersonsAndBookKeepers(urlResolver, requestManager, folderId)
    let payOrderFolderId = data['payOrderFolderId']

    router.goTo('#/NewCard/b9f7bfd7-7429-455e-a3f1-94ffb569c794/fc35d243-e36d-49f8-bcb0-60c1e6ff99b2/'+payOrderFolderId)
    console.log(arrayIds)
}


export async function checkCand(sender){
    console.log("checkCand");

    let controls = sender.layout.controls
    let checkCandidate = controls.checkCandidate
    let candidate:TextArea = controls.candidate
    let OtchetKandidat:TextArea = controls.OtchetKandidat
    let commentControl = controls.textComment

    let rowIndex = checkCandidate.indexOf(sender);
    console.log(rowIndex)
    for(let i=0; i<checkCandidate.length; i++){
        if(i!=rowIndex && checkCandidate[i].params.value == true){
            console.log(checkCandidate[i].params.value)
            checkCandidate[i].params.value = false
        }
    }

    for(let i=0; i<checkCandidate.length; i++){

        if(checkCandidate[i].params.value == true){
            let text = candidate[i].params.value

            OtchetKandidat.params.value = null
            OtchetKandidat.params.value = text
            commentControl.value = "Согласован - " + text
            commentControl.save()
            OtchetKandidat.save()
        }
    }
}


export async function fillStaffDep(sender) {
    let controls = sender.layout.controls
    let unitId = controls.declarant.value.unitId;
    if (unitId != null) {
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        await getStaffDepById(urlResolver, requestManager, unitId)
            .then((data: string) => {
                controls.departmentName.value = data["staffDepModel"]
            })
    }
}

export async function getStaffDepById(urlResolver: UrlResolver, requestManager: IRequestManager, unitId: string) {
    let url = urlResolver.resolveApiUrl("GetDepartmentModelById", "RowDesignerService");
    url += "?id=" + unitId;
    return requestManager.get(url);
}

export async function fillCandAgreementInfo(sender) {
    let controls = sender.layout.controls
    let links = controls.links1.params.links
    let cardId = null
    links.map((i) => {
        if (i.data.isDocument)
            cardId = i.data.cardId
    })
    console.log(cardId)
    let infLabel = controls.infoLabel

    if (cardId != null) {
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        await getCandAgreementInfo(urlResolver, requestManager, cardId)
            .then((data: string) => {
                let permTemp = (data['permanentlyTemporary'] == 0)?"Постоянно":"Временно"
                infLabel.params.text = `
               Вам на рассмотрение поступил "Отчет о кандидатах" на должность <${data['plannedPosition']}> в подразделение
                <${data['staffDep']}> (руководитель <${data['staffDepManager']}>)!
                  Характер работы: <${permTemp}>.
               `
            })
    }
}

export async function getCandAgreementInfo(urlResolver: UrlResolver, requestManager: IRequestManager, agreementCardId: string) {
    let url = urlResolver.resolveApiUrl("GetAgreementListInfo", "RowDesignerService");
    url += "?id=" + agreementCardId;
    return requestManager.get(url);
}

export async function fillStaffDepManager(sender) {
    let staffDepControl = sender.layout.controls.staffDepartment
    let staffDepManagerControl = sender.layout.controls.staffDepartmentManager
    let staffDepId = staffDepControl.value.id
    if (staffDepId != null) {
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        await getStaffDepManager(urlResolver, requestManager, staffDepId)
            .then((data: string) => {
                staffDepManagerControl.value = data;
            })
    }
}

export async function getStaffDepManager(urlResolver: UrlResolver, requestManager: IRequestManager, staffDepId: string) {
    let url = urlResolver.resolveApiUrl("GetStaffDepManById", "RowDesignerService");
    url += "?id=" + staffDepId;
    return requestManager.get(url);
}

export async function fillAgreementAndBookKeepers(sender: Layout, e:IEventArgs) {
    console.log("fillAgreementAndBookKeepers")
    let hash = window.location.hash
    console.log(hash)
    let splitHash = hash.split('/')
    console.log(splitHash)
    let splitIdHash = splitHash[4].split("?")
    console.log(splitIdHash)
    let idFolder = splitIdHash[0]
    console.log(idFolder)
    let controls = sender.layout.controls
    let cardKind = controls.cardKind1.params.value.cardKindName

    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);

    await getAgreementPersonsAndBookKeepers(urlResolver, requestManager, idFolder)
        .then((data: string) => {
            
            if ((data['staffDepartment'])&&(controls.staffDepartment)) {
                controls.staffDepartment.value = data["staffDepartment"]
            }
            if (cardKind == "Приказ по благотворительности") {
                if (data['charityOrderMainBookKeeper']) {
                    controls.mainBookKeeper.value = data["charityOrderMainBookKeeper"]
                }
                if (data['charityOrderBookKeeper']) {
                    controls.bookKeeper.value = data["charityOrderBookKeeper"]
                }
                if (data['charityOrderController']) {
                    controls.controller.value = data["charityOrderController"]
                }
                if (data['charityOrderAgreementEmployees']) {
                    controls.agreementPersons.value = data['charityOrderAgreementEmployees']
                }
            } else if (cardKind == "Лист согласования кандидата") {
                if (data['candidateAgreementCPKBoss']) {
                    controls.CPKChief.value = data['candidateAgreementCPKBoss']
                }
                if (data['candidateAgreementOUandOTOBoss']) {
                    controls.OUandOTOChief.value = data['candidateAgreementOUandOTOBoss']
                }
                if (data['candidateAgreementAgreementEmployees']) {
                    controls.agreementEmployees.value = data['candidateAgreementAgreementEmployees']
                }
            } else if (cardKind == 'Карточка документов при приеме') {
                if (data['recruitmentDocsOUandOTOClerk']) {
                    controls.OUandOTOClerk.value = data['recruitmentDocsOUandOTOClerk']
                }
                if (data['recruitmentDocsOUandOTOBoss']) {
                    controls.OUandOTOChief.value = data['recruitmentDocsOUandOTOBoss']
                }
                if ((data['recruitmentDocsAgreementEmployees1'])&&(data['recruitmentDocsHeadOfDepartment'])) {
                    let agreementArr = [data['recruitmentDocsHeadOfDepartment']]
                    if ((controls.acceptOrTranslate.value == "Перевод")||(controls.acceptOrTranslate.value == "Приём"))
                        agreementArr = agreementArr.concat(data['recruitmentDocsAgreementEmployees1'])
                    controls.coordinatingPersons.value = agreementArr
                }
                if (data['recruitmentDocsAgreementEmployees2']) {
                    controls.coordinatingPersons1.value = data['recruitmentDocsAgreementEmployees2']
                }
            } else if (cardKind == "Приказ на выплату") {
                if (data['payOrderMainBookKeeper']) {
                    controls.mainBookKeeper.value = data['payOrderMainBookKeeper']
                }
                if (data['payOrderBookKeeper']) {
                    controls.bookKeeper.value = data['payOrderBookKeeper']
                }
                if (data['payOrderAgreementEmployees']) {
                    controls.contributePersons.value = data['payOrderAgreementEmployees']
                }
            }
            if ((data['filial'])&&(controls.directoryDesignerRow1)) {
                controls.directoryDesignerRow1.value = data["filial"]
            }
        })
        .catch((e) => {
            MessageBox.ShowError(e, "Поймана ошибка")
        })
}

export async function getAgreementPersonsAndBookKeepers(urlResolver: UrlResolver, requestManager: IRequestManager, folderId: string) {
    let url = urlResolver.resolveApiUrl("GetOrganizationByFolderId", "RowDesignerService");
    url += "?id=" + folderId;
    return requestManager.get(url);
}

export async function logPostRequest(sender) {
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);

    await postRequest(urlResolver, requestManager)
        .then((data: string) => {
            console.log(data)
        })
        .catch((ex)=>{
            console.log(ex)
        })
}

export async function postRequest(urlResolver: UrlResolver, requestManager: IRequestManager) {
    let url = urlResolver.resolveApiUrl("ChangeState", "RowDesignerService");
    let postdata = {
        idList: ["df4d5173-a3f6-483c-bdcf-c14a1c1fb068", "cba42eca-bf18-4702-93b8-29390937020a", "b6da23af-d66b-485b-a04a-9a096d975e0e"],
        stateName: "AddedToOrder"
    }
    return requestManager.post(url, JSON.stringify(postdata));
}

export async function showOrHideAdditionalControlsAndFillCode(sender) {
    let paymentKindControl = sender.layout.controls.paymentKind;
    let paymentKindId = paymentKindControl.params.value.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    await getAdditionalControlsFlag(urlResolver, requestManager, paymentKindId)
        .then((data: string) => {
            sender.layout.controls.paymentKindCode.params.value = data['payCode'];
            if (data['showAdditionalControls'] == "true")
                toggleAdditionalSanatoryControls(true, sender)
            else if (data['showAdditionalControls'] == "false")
                toggleAdditionalSanatoryControls(false, sender)
            else {
                console.log("Unknown value from Get request!!");
                toggleAdditionalSanatoryControls(false, sender);
            }
        })
        .catch((e) => {
            MessageBox.ShowError(e, "Поймана ошибка")
        })
}

export function toggleAdditionalSanatoryControls(value: boolean, sender) {
    let layout = sender.layout.controls
    let controlsArray = [layout.sanatoryName, layout.fullPrice, layout.summerPrice,
        layout.notSummerPrice, layout.dateStart, layout.dateEnd, layout.summerDaysQuantity,
        layout.notSummerDaysQuantity, layout.workersQuantity, layout.childrenQuantity, layout.spouseQuantity,]
    controlsArray.map((i) => {
        i.params.required = value;
    });
    let additionalBlock = layout.additionalData;
    additionalBlock.params.visibility = value;
}

export async function getAdditionalControlsFlag(urlResolver: UrlResolver, requestManager: IRequestManager, paymentKindid: string) {
    let url = urlResolver.resolveApiUrl("GetPaymentKindInfo", "RowDesignerService");
    url += "?id=" + paymentKindid;
    return requestManager.get(url);
}

export function SetCreationDate(sender: Layout, e: IEventArgs) {
    let CreationDateControl = sender.layout.controls.CreatedDate;
    CreationDateControl.params.value = moment();
}

export function UpdateCandidateFIO(sender: Layout, e: IEventArgs) {
    let candiadateFIOControl = sender.layout.controls.candidate;
    let candiadateSurNameControl = sender.layout.controls.candidateSurname;
    let candiadateNameControl = sender.layout.controls.candidateName;
    let candiadatePatronymicControl = sender.layout.controls.candidatePatronymic;
    let FIO = '';

    if (candiadateSurNameControl.params.value != null) {
        FIO += candiadateSurNameControl.params.value + ' ';
    }
    if (candiadateNameControl.params.value != null) {
        FIO += candiadateNameControl.params.value + ' ';
    }
    if (candiadatePatronymicControl.params.value != null) {
        FIO += candiadatePatronymicControl.params.value;
    }
    candiadateFIOControl.params.value = FIO;
}



export async function hideCreateButton(sender: Layout, e: IEventArgs) {
    console.log("hideCreateButton")
    
    const foldersWithoutCreateButton = { "Главная":"/Dashboard",
        "УПЦ":"/Folder/9b28e172-0ba3-42b2-a083-58fb76bb5e0e", 
        "Резерв":"/Folder/af7eeb05-2daf-4927-9496-bc7849d1d16f",
        "ОУиОТО":"/Folder/d1d1cb50-7594-431c-82f0-000ea44d225f", 
        "ОУиОТО(г.Краснодар)":"/Folder/cb70f261-d442-4c80-8f66-2857f15ce1fd",
        "ОУиОТО(ст.Каневская)":"/Folder/76f8d460-2420-4bb4-bc3d-9752b3590092", 
        "ОУиОТО(Вуктыльское ГПУ)":"/Folder/a448e45b-edda-4754-96f7-d79e0208c3fb",
        "ОУиОТО(ЛПУМТ)":"/Folder/f06b7e1b-87c9-42d7-a3cd-e8c16195246a", 
        "ОСР":"/Folder/be5ce7f4-5dc8-4b69-9599-09302c41dba9",
        "Администрация":"/Folder/dd18f1d3-4c77-43b3-acfc-d603147e0b99", 
        "Вуктыльское ГПУ":"/Folder/6f71e996-2c6b-4eff-8e81-1d3b632957d5",
        "ИТЦ":"/Folder/50ab5ca1-dbca-4bcd-baf0-669a7936e9b2", 
        "Каневское ГПУ":"/Folder/aaf608a4-5756-4680-bf2a-38d2d0e44d42",
        "ЛПУМТ":"/Folder/dcfff06e-0bdb-41c2-8e14-156f5cfec2ee", 
        "Светлоградское ГПУ":"/Folder/0fafe4d9-7f67-45de-8d32-9bed8cc060eb",
        "СКЗ":"/Folder/3fc4b66d-5bbf-4f2d-b644-0cd7d3d697c8", 
        "УАВР":"/Folder/88830e4c-10fd-428b-a8e3-ac7b53b025e5",
        "УМТСиК":"/Folder/7e3b329c-7c47-4115-8d9e-2213c16934f9", 
        "УТТиСТ":"/Folder/b771e21f-1924-4054-93e2-e98cf23e846a",
    }

    let currentLocation = window.location.href

    function isSliceOfCurrentLocation(element, index, array) {

        return currentLocation.includes(element)
      }
    
    if (Object.values(foldersWithoutCreateButton).find(isSliceOfCurrentLocation)) {
        $('.new-card').css('display', 'none')
    } else {
        $('.new-card').css('display', 'inline-block')
    }
}