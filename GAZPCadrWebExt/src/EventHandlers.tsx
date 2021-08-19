const foldersWithCreateButton = { 
    "УПЦ/Карточки согласования кандидатов":"/Folder/56f3755b-d4ac-4285-87c1-37d4e9af931d",
    "УПЦ/Согласование кандидатов для прохождения практики":"/Folder/adf95f2b-49e5-4fce-bd43-3dd81fce42f0", 
    "ОУиОТО/г.Краснодар/Карточки докумнетов кандидатов":"/Folder/8793a4e8-c30e-4dc5-aa18-0eb993f186bc",
    "ОСР/Администрация/01":"/Folder/cddcb73b-02b9-453c-b1c4-54a1dcefc68c", 
    "ОСР/Администрация/02":"/Folder/b4d6c4e2-900a-4982-9f84-804be11eb488",
    "ОСР/Администрация/03":"/Folder/48700c94-65b0-4af2-8787-ffb429f469d1", 
    "ОСР/Вуктыльское ГПУ/01":"/Folder/79efbde6-0239-4d8b-ac6a-4c98860305e7",
    "ОСР/Вуктыльское ГПУ/02":"/Folder/b5ac4bb1-9490-4ac0-a035-70f4b1da4ca8", 
    "ОСР/ИТЦ/01":"/Folder/1f3a6b90-cc85-4ce4-8581-4488004b5218",
    "ОСР/ИТЦ/02":"/Folder/7da0f777-26f6-4410-97aa-c4e4fba2082d", 
    "ОСР/Каневское ГПУ/01":"/Folder/037ab8af-abb5-4d0e-afae-45f5e0d38f3e",
    "ОСР/Каневское ГПУ/02":"/Folder/a29db86d-4c0e-4a4a-86ac-273389c63ac3", 
    "ОСР/ЛПУМТ/01":"/Folder/149d7b53-b9b2-45b2-a7d7-c690aa92a9f2",
    "ОСР/ЛПУМТ/02":"/Folder/6e74b359-3158-4c45-b197-783d9649428f", 
    "ОСР/Светлогратское ГПУ/01":"c760d9b4c62f",
    "ОСР/Светлогратское ГПУ/02":"a68c0f83f48b", 
    "ОСР/СКЗ/01":"1a89c1c204ed",
    "ОСР/СКЗ/02":"94b7d448db54", 
    "ОСР/УАВР/01":"2abd78e82819",
    "ОСР/УАВР/02":"0c6d4e249a14", 
    "ОСР/УМТСиК/01":"24a2c6e9d320",
    "ОСР/УМТСиК/02":"cdaef6a66e21", 
    "ОСР/УТТиСТ/01":"418ef822208d",
    "ОСР/УТТиСТ/02":"5bd743175d6c", 
    "ОСР/04.Личные дела/Администрация":"d9c216987143",  
}


const foldersWithCreateOrderButton = { 
    "ОСР/Администрация/Заявления на выплату":"54a1dcefc68c",
    "ОСР/Вуктыльское ГПУ/01":"/Folder/79efbde6-0239-4d8b-ac6a-4c98860305e7",
    "ОСР/ИТЦ/01":"/Folder/1f3a6b90-cc85-4ce4-8581-4488004b5218",
    "ОСР/Каневское ГПУ/01":"/Folder/037ab8af-abb5-4d0e-afae-45f5e0d38f3e",
    "ОСР/ЛПУМТ/01":"/Folder/149d7b53-b9b2-45b2-a7d7-c690aa92a9f2",
    "ОСР/Светлогратское ГПУ/01":"c760d9b4c62f",
    "ОСР/СКЗ/01":"1a89c1c204ed",
    "ОСР/УАВР/01":"2abd78e82819",
    "ОСР/УМТСиК/01":"24a2c6e9d320",
    "ОСР/УТТиСТ/01":"418ef822208d",
}


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
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import { $CardId } from "@docsvision/webclient/System/LayoutServices";


export async function showCreateOrderBtn(sender){
    console.log("showCreateOrderBtn")

    let currentLocation = window.location.href
    let createOrderBtn = sender.layout.controls.createOrderButton
    function isSliceOfCurrentLocation(element, index, array) {
        return currentLocation.includes(element)
      }
    
    if (Object.values(foldersWithCreateOrderButton).find(isSliceOfCurrentLocation)) {
        createOrderBtn.params.visibility = true
        // $('.new-card').css('display', 'inline-block')
    } else {
        createOrderBtn.params.visibility = false
        // $('.new-card').css('display', 'none')
    }
}


export async function showCandidateCtrls(sender){
    let controls = sender.layout.controls
    let acceptOrTranslate = controls.acceptOrTranslate
    let candidateBlock = controls.candidateBlock
    let candidateSurnameBlock = controls.candidateSurnameBlock
    let candadateNameBlock = controls.candadateNameBlock
    let candidatePatronymicBlock = controls.candidatePatronymicBlock
    let employeeBlock = controls.employeeBlock

    let acceptOrTranslateValue = acceptOrTranslate.params.value
    if(acceptOrTranslateValue== 'Перевод' || acceptOrTranslateValue== 'Увольнение'){
        candidateBlock.params.visibility = false
        employeeBlock.params.visibility = true
        candidateSurnameBlock.params.visibility = false
        candadateNameBlock.params.visibility = false
        candidatePatronymicBlock.params.visibility = false
    } else {
        candidateBlock.params.visibility = true
        employeeBlock.params.visibility = false
        candidateSurnameBlock.params.visibility = true
        candadateNameBlock.params.visibility = true
        candidatePatronymicBlock.params.visibility = true
    }
}


export async function fillCuratorTask(sender) {
    console.log('fillCuratorTask')

    let docNameCtrl = sender.layout.controls.taskName
    let descriptionCtrl = sender.layout.controls.description
    docNameCtrl.params.value = "Подготовьте трудовой договор и приказ о приеме на работу."
    descriptionCtrl.params.value = `Подготовьте трудовой договор и приказ о приеме на работу.
    Подготовьте оценочный лист и отправьте руководителю подразделения (филиала) в которое принимается (переводится) сотрудник, далее в ОТиЗ.`
}


export function clearComment(sender: LayoutControl, e: CancelableEventArgs<any>) {
    let cardId = sender.layout.getService($CardId);
    let requestManager = sender.layout.getService($RequestManager);
    let {controls} = sender.layout;

    let comment = controls.get<TextArea>("textComment")
    console.log(e);

    const commentInModal = e.data.layout.childControls[0].childControls[1].childControls[0].childControls[0];
    let OtchetKandidatCtrl = sender.layout.controls.OtchetKandidat

    if(e.data.operationData.additionalInfo.decisionName === "Отказано"){
        // e.wait()
        // OtchetKandidatCtrl.params.value = ''
        // comment.params.value = ""
        commentInModal.params.required = false
        commentInModal.params.value = ""
        // e.accept()
    }    
    console.log("Работает 3");  
}


export async function watchArgs(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("watchArgs")

    args.wait()

    console.log(args);
    let commentControl = sender.layout.controls.textComment

    let cancelBtn = document.querySelector('button[class="button-helper card-type-background-color-hover card-type-background-color-light primary-button align-center"]') as HTMLElement
    if (cancelBtn==args["target"]) {
        let input = document.querySelector('div[data-control-name="Comment_completeTaskConditionsTable"]>div>div>div>input') as HTMLInputElement
        // input.value = "_" 
        commentControl.value = '_'
        await commentControl.save()
    }
    args.accept()
}


export async function clearCmntOnCancel(sender: Layout, args: CancelableEventArgs<any>) {
    console.log("clearCmntOnCancel")

    console.log(args);
    let commentControl = sender.layout.controls.textComment
    let cancelBtn = document.querySelector('button[data-button-name="Отказано"]') as HTMLElement
    cancelBtn.onclick = function() {
        args.wait()
        commentControl.value = ''
        sender.layout.save()
        args.accept()
    }
    
    
    // const mainNode = document.querySelector('aside#right-sidebar-helper')

    // function callback(mutationsList, observer) {
    //     console.log('Mutations:', mutationsList)
    //     console.log('Observer:', observer)
    //     mutationsList.forEach(mutation => {
    //         if (mutation.attributeName === 'class') {
    //             alert('Ch-ch-ch-changes!')
    //         }
    //     })
    // }
    
    // const mutationObserver = new MutationObserver(callback)
    
    // mutationObserver.observe(mainNode, { attributes: true })


    // args.wait()
    // // let cancelBtn = document.querySelector('button[data-tipso-text="Отказано"]')
    // let commentControl = sender.layout.controls.textComment
    // $('button[data-tipso-text="Отказано"]').mouseenter(function() {
    //     commentControl = ''
    //     commentControl.save() 
    // })
    // // cancelBtn.mouseenter("click", function(sender) {
        
    // //     .mouseenter(function() {
        
    // // })
    // args.accept()
}



export async function createFakeAgrBtn(sender){
    console.log('createFakeAgrBtn')

    let fakeBtn = document.createElement('button')
    fakeBtn.classList.add('fake-agreement-btn')
    fakeBtn.innerHTML = 'СОГЛАСОВАНО'
    fakeBtn.onclick = function() {
        MessageBox.ShowInfo('Не выбран кандидат', 'Согласовать нельзя')
    }
    let agrBtnElmnt = document.querySelector('button[data-button-name="Согласовано"]') as HTMLElement
    let parentNode = agrBtnElmnt.parentNode
    
    agrBtnElmnt.classList.remove('align-center')  
    parentNode.insertBefore(fakeBtn, agrBtnElmnt)
    showFakeAgrBtn(sender, true)
}


export async function showFakeAgrBtn(sender, hideTrueBtn){
    console.log('showFakeAgrBtn')

    let trueAgrBtn = document.querySelector('button[data-button-name="Согласовано"]') as HTMLElement
    let fakeAgrBtn = document.querySelector('button.fake-agreement-btn') as HTMLElement
    if (hideTrueBtn) {
        trueAgrBtn.style.display='none'
        fakeAgrBtn.style.display='block'
    } else {
        trueAgrBtn.style.display='flex'
        fakeAgrBtn.setAttribute('style', 'display:none !important');
    }
}


export async function changeCandAgrmntLayout(sender){
    console.log('changeCandAgrmnt')
    
    let tableHelperCell = document.querySelector('.links_table-row>.table-helper-cell') as HTMLElement;
    if (tableHelperCell) {
        tableHelperCell.style.paddingLeft = '0px'
    }
    let nameCell = document.querySelector('.links_table-row>.table-helper-cell>.name-cell') as HTMLElement;
    if (nameCell) {
        nameCell.style.paddingLeft = '6px'
    }
    let infoCell = document.querySelector('.info-cell') as HTMLElement;
    if (infoCell) {
        infoCell.style.display = 'none'
    }
}


export async function addLinksToCard1(sender){
    console.log('addLinksToCard1')

    let links = sender.layout.controls.links
    if (localStorage.getItem('cardIds') !== null) {
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        let cards = JSON.parse(localStorage.getItem('cardIds'))
        console.log(cards)
        let length = cards.length
        let parentCardId = sender.layout.cardInfo.id;

        let timestamp
        let childrenCardId

        for(let i=0; i< length; i++) {
            timestamp = sender.layout.cardInfo.timestamp;
            childrenCardId = cards[i]
            console.log(childrenCardId)
            await addLinkToLinks1(urlResolver, requestManager, childrenCardId, parentCardId,
                 timestamp).then((data: string) => {
                    console.log(data)
                })
                .catch((ex) => {
                    console.log(ex)
                })
            console.log("123")
        }
        console.log("1233")
    }
    
    console.log('Начало')
    localStorage.removeItem('cardIds')
    localStorage.getItem('cardIds')
    console.log('конец')
}


export async function addLinkToLinks1(urlResolver: UrlResolver, requestManager: IRequestManager,
     childrenCardId, parentCardId, timestamp) {
    console.log('addLinkToLinks1')

    let url = urlResolver.resolveApiUrl("addExistingCardLink", "layoutLinks");
    let postdata = {
        sourceCardId: parentCardId,
        sourceCardTimestamp: timestamp,
        destinationCardId: childrenCardId,
        linkTypeId: "90d0724e-08f4-4391-a0b0-3f4b6bbeefa3",
        saveHardLink: false,
        editOperation: "00000000-0000-0000-0000-000000000000",
        isReport: false,
        isFile: false,
        linksBinding: {
            dataSourceResolverId: "00000000-0000-0000-0000-000000000000",
            sectionId: "30eb9b87-822b-4753-9a50-a1825dca1b74",
            fieldAlias: "ReferenceList"
        }
    }
    let pd = JSON.stringify(postdata)
    // setTimeout(console.log(pd), 1500)
    return await requestManager.post(url, pd)
}


export async function createNewOrder1(sender){
    console.log("createNewOrder1");

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

    let checkExist = false
    for(let i=0; i<checkCandidate.length; i++){
        if(checkCandidate[i].params.value == true){
            checkExist = true
            let text = candidate[i].params.value
            OtchetKandidat.params.value = null
            OtchetKandidat.params.value = text
            commentControl.value = "Согласован - " + text
            showFakeAgrBtn(sender, false)
        }
    }
    if (!checkExist) {
        commentControl.value = ""
        showFakeAgrBtn(sender, true)
    } 
    commentControl.save()
    OtchetKandidat.save()
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
                  Характер работы: <${permTemp}>. Укажите фамилию одного выбранного Вами кандидата и завершите задание выбрав решение.
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
    let staffDepControl = sender.layout.controls.staffDepartment1
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
            
            // if ((data['staffDepartment'])&&(controls.staffDepartment)) {
            //     controls.staffDepartment1.value = data["staffDepartment"]
            // }
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
                if ((data['recruitmentDocsAgreementEmployees1'])||(data['recruitmentDocsHeadOfDepartment'])) {
                    let agreementArr = data['recruitmentDocsAgreementEmployees1']
                    if ((controls.acceptOrTranslate.value == "Перевод")||(controls.acceptOrTranslate.value == "Приём"))
                        if (data['recruitmentDocsHeadOfDepartment'])
                            agreementArr = agreementArr.concat([data['recruitmentDocsHeadOfDepartment']])
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
    
    // const foldersWithoutCreateButton = { 
    //     "Главная":"/Dashboard",
    //     "УПЦ":"/Folder/9b28e172-0ba3-42b2-a083-58fb76bb5e0e", 
    //     "Резерв":"/Folder/af7eeb05-2daf-4927-9496-bc7849d1d16f",
    //     "ОУиОТО":"/Folder/d1d1cb50-7594-431c-82f0-000ea44d225f", 
    //     "ОУиОТО(г.Краснодар)":"/Folder/cb70f261-d442-4c80-8f66-2857f15ce1fd",
    //     "ОУиОТО(ст.Каневская)":"/Folder/76f8d460-2420-4bb4-bc3d-9752b3590092", 
    //     "ОУиОТО(Вуктыльское ГПУ)":"/Folder/a448e45b-edda-4754-96f7-d79e0208c3fb",
    //     "ОУиОТО(ЛПУМТ)":"/Folder/f06b7e1b-87c9-42d7-a3cd-e8c16195246a", 
    //     "ОСР":"/Folder/be5ce7f4-5dc8-4b69-9599-09302c41dba9",
    //     "Администрация":"/Folder/dd18f1d3-4c77-43b3-acfc-d603147e0b99", 
    //     "Вуктыльское ГПУ":"/Folder/6f71e996-2c6b-4eff-8e81-1d3b632957d5",
    //     "ИТЦ":"/Folder/50ab5ca1-dbca-4bcd-baf0-669a7936e9b2", 
    //     "Каневское ГПУ":"/Folder/aaf608a4-5756-4680-bf2a-38d2d0e44d42",
    //     "ЛПУМТ":"/Folder/dcfff06e-0bdb-41c2-8e14-156f5cfec2ee", 
    //     "Светлоградское ГПУ":"/Folder/0fafe4d9-7f67-45de-8d32-9bed8cc060eb",
    //     "СКЗ":"/Folder/3fc4b66d-5bbf-4f2d-b644-0cd7d3d697c8", 
    //     "УАВР":"/Folder/88830e4c-10fd-428b-a8e3-ac7b53b025e5",
    //     "УМТСиК":"/Folder/7e3b329c-7c47-4115-8d9e-2213c16934f9", 
    //     "УТТиСТ":"/Folder/b771e21f-1924-4054-93e2-e98cf23e846a",
    //     "Входящие":"/Folder/5bf0fb94-23fa-4212-80c3-c598e9859901",
    //     "В работе":"/Folder/658af190-d102-406a-9869-581405a9cbb4", 
    //     "На контроле":"/Folder/1b1f4bce-b3e6-42fe-a1e5-e64aadbe8479",
    //     "Ответственное исполнение":"/Folder/778646ed-2625-4ce8-9386-b0e720fa1abe", 
    //     "Исходящие":"/Folder/93deb151-eeca-4591-b0fc-94a7c5833794",
    //     "Делегировано":"/Folder/27a8f99f-6cd8-47aa-9e19-205c8e0039b3", 
    //     "Завершено":"/Folder/ecd3e0a0-7da4-4d47-83a9-809f6137b548",
    //     "Поиск заданий":"/Folder/01edd5ee-73db-4c8b-b62c-50bd4c498ef7", 
    //     "Входящие(поиск)":"/Folder/6b69a304-add2-458c-ac02-6e059e451bcd",
    //     "Исходящие(поиск)":"/Folder/43a36416-2c8a-4edf-9d59-43c25ab96e60", 
    // }

    let currentLocation = window.location.href

    function isSliceOfCurrentLocation(element, index, array) {

        return currentLocation.includes(element)
      }
    
    if (Object.values(foldersWithCreateButton).find(isSliceOfCurrentLocation)) {
        $('.new-card').css('display', 'inline-block')
    } else {
        $('.new-card').css('display', 'none')
    }
}


// export async function hideCreateButtonRev(sender: Layout, e: IEventArgs) {
//     console.log("hideCreateButtonRev")
    
//     console.log(foldersWithoutCreateButton1)
    
//     const fileUrl = './file.txt' // provide file location

//     fetch(fileUrl)
//         .then( r => r.text() )
//         .then( t => console.log(t) )

//     var txt = '';
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function(){
//     if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
//         txt = xmlhttp.responseText;

//     }
//     };
//     xmlhttp.open("GET","file.txt",true);
//     xmlhttp.send();

//     const foldersWithoutCreateButton = { 
//         "Главная":"/Dashboard",
//         "УПЦ":"/Folder/9b28e172-0ba3-42b2-a083-58fb76bb5e0e", 
//         "Резерв":"/Folder/af7eeb05-2daf-4927-9496-bc7849d1d16f",
//         "ОУиОТО":"/Folder/d1d1cb50-7594-431c-82f0-000ea44d225f", 
//         "ОУиОТО(г.Краснодар)":"/Folder/cb70f261-d442-4c80-8f66-2857f15ce1fd",
//         "ОУиОТО(ст.Каневская)":"/Folder/76f8d460-2420-4bb4-bc3d-9752b3590092", 
//         "ОУиОТО(Вуктыльское ГПУ)":"/Folder/a448e45b-edda-4754-96f7-d79e0208c3fb",
//         "ОУиОТО(ЛПУМТ)":"/Folder/f06b7e1b-87c9-42d7-a3cd-e8c16195246a", 
//         "ОСР":"/Folder/be5ce7f4-5dc8-4b69-9599-09302c41dba9",
//         "Администрация":"/Folder/dd18f1d3-4c77-43b3-acfc-d603147e0b99", 
//         "Вуктыльское ГПУ":"/Folder/6f71e996-2c6b-4eff-8e81-1d3b632957d5",
//         "ИТЦ":"/Folder/50ab5ca1-dbca-4bcd-baf0-669a7936e9b2", 
//         "Каневское ГПУ":"/Folder/aaf608a4-5756-4680-bf2a-38d2d0e44d42",
//         "ЛПУМТ":"/Folder/dcfff06e-0bdb-41c2-8e14-156f5cfec2ee", 
//         "Светлоградское ГПУ":"/Folder/0fafe4d9-7f67-45de-8d32-9bed8cc060eb",
//         "СКЗ":"/Folder/3fc4b66d-5bbf-4f2d-b644-0cd7d3d697c8", 
//         "УАВР":"/Folder/88830e4c-10fd-428b-a8e3-ac7b53b025e5",
//         "УМТСиК":"/Folder/7e3b329c-7c47-4115-8d9e-2213c16934f9", 
//         "УТТиСТ":"/Folder/b771e21f-1924-4054-93e2-e98cf23e846a",
//         "Входящие":"/Folder/5bf0fb94-23fa-4212-80c3-c598e9859901",
//         "В работе":"/Folder/658af190-d102-406a-9869-581405a9cbb4", 
//         "На контроле":"/Folder/1b1f4bce-b3e6-42fe-a1e5-e64aadbe8479",
//         "Ответственное исполнение":"/Folder/778646ed-2625-4ce8-9386-b0e720fa1abe", 
//         "Исходящие":"/Folder/93deb151-eeca-4591-b0fc-94a7c5833794",
//         "Делегировано":"/Folder/27a8f99f-6cd8-47aa-9e19-205c8e0039b3", 
//         "Завершено":"/Folder/ecd3e0a0-7da4-4d47-83a9-809f6137b548",
//         "Поиск заданий":"/Folder/01edd5ee-73db-4c8b-b62c-50bd4c498ef7", 
//         "Входящие(поиск)":"/Folder/6b69a304-add2-458c-ac02-6e059e451bcd",
//         "Исходящие(поиск)":"/Folder/43a36416-2c8a-4edf-9d59-43c25ab96e60", 
//     }

//     let currentLocation = window.location.href

//     function isSliceOfCurrentLocation(element, index, array) {

//         return currentLocation.includes(element)
//       }
    
//     if (Object.values(foldersWithoutCreateButton).find(isSliceOfCurrentLocation)||currentLocation.includes('CardView')) {
//         $('.new-card').css('display', 'none')
//     } else {
//         $('.new-card').css('display', 'inline-block')
//     }
// }