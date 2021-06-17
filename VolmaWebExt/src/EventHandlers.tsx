import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import { $UrlResolver } from "@docsvision/webclient/System/$UrlResolver";
import { UrlResolver } from "@docsvision/webclient/System/UrlResolver";
import { $RequestManager, IRequestManager } from "@docsvision/webclient/System/$RequestManager";
import { AgreementList } from "@docsvision/webclient/Approval/AgreementList";
import { layoutManager } from "@docsvision/webclient/System/LayoutManager";
import moment from 'moment'



export async function prepFullAgrmntList(sender) {
    console.log("prepFullAgrmntList");

    var a = document.querySelector('div[data-control-name="label1"]')

    a.innerHTML = `<div id="myModal" class="agrmnt-modal">
    <div class="agrmnt-modal-content">
        <span class="agrmnt-close">&times;</span>
        <div id="printableArea" style="width:100%;">
            <style>
            #printableArea {
                line-height: 1.5 !important;
            }
            #full-agrmnt-main-header {
                text-align:center;
            }
            .list-label {
                font-weight:bold !important;
            }
            .header-cell {
                color:black !important;
                background: #ddd !important;
            }
            #agrmnt-main-header {
                font-size: 30px;
            }
            .font-bold {
                font-weight:bold !important;
            }
            h1 {
                font-size:40px;
            }
            table {
                // table-layout: fixed;
                margin-bottom: 26px;
                width: 100%;
                // border: 3px solid black;
            }
            
            .table-header-row>th {
                border: 2px solid black !important;
                background-color: Gainsboro !important;
            }
            // .cell-num {
            //     width: 4%;
            // }
            // .cell-fio {
            //     width: 37%;
            // }
            // .cell-dep {
            //     width: 14%;
            // }
            // .cell-dscn {
            //     width: 12%;
            // }
            // .cell-cmnt {
            //     width: 12%;
            // }
            // .cell-sdate {
            //     width: 10%;
            // }
            // .cell-edate {
            //     width: 11%;
            // }
            // #agrmnt-table-container{
            //     .table-header-row>th {
            //         padding: 0 5px;
            //         border: 2px solid black !important;
            //         background-color: Gainsboro !important;
            //     }
            //     td {
            //         border: 1px solid black !important;
            //         padding: 5px!important;
            //     }
            //   }

            @media screen and (max-width: 680px) {
                #agrmnt-table-container{
                    font-size: 70%
                }
            }

            #agrmnt-table-container>table>tbody>tr>td {
                border: 1px solid black !important;
                padding: 6px !important; 
                text-align: center;
            }
            .table-lable-cell {
                text-align: left !important;
                border: none !important;
            }
            #agrmnt-header {
                padding: 20px 0px 20px 0px !important;
            }
            </style>
            <h1 id="full-agrmnt-main-header">Лист согласования</h1>
            <p id="agrmnt-header">К документу </p>
            <div id="agrmnt-table-container">
                <tr>
                    <th>№</th>
                    <th>ФИО, должность</th>
                    <th>Подразделение</th>
                    <th> Решение</th>
                    <th>Дата</th>
                </tr>
            </div>
        </div>
        <div id="btn-container">
            <input id="printBtn" type="button" value="Печать"/>
        </div>     
    </div>`

    a.innerHTML += `
    <button id="myBtn">Лист согласования</button>
    <style>

    #btn-container {
        padding-top: 20px !important;
        display:flex;
    }

    #myBtn, #printBtn {
        margin-left: 4px !important;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
        -webkit-box-direction: normal;
        box-sizing: inherit;
        font-family: "Roboto";
        font-style: normal;
        border: none;
        line-height: 18px;
        max-width: 100%;
        background: #ccc;
        color: #000;
        cursor: pointer;
        margin: 3px 0;
        text-align: center;
        width: 97%;
        height: 36px;
        min-width: 64px;
        padding: 0 12px;
        font-size: .775rem;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
        border-radius: 4px;
        display: flex;
        align-items: center;
        -webkit-box-align: center;
        -webkit-box-flex: 0;
        flex: 0 0 auto;
        font-weight: 500;
        letter-spacing: .03em;
        -webkit-box-pack: center;
        justify-content: center;
        outline: 0;
        position: relative;
        text-decoration: none;
        text-indent: .0892857143em;
        text-transform: uppercase;
        transition-duration: .28s;
        transition-property: box-shadow,transform,opacity,-webkit-box-shadow,-webkit-transform;
        transition-timing-function: cubic-bezier(.4,0,.2,1);
        user-select: none;
        vertical-align: middle;
    }

    #myBtn:hover, printBtn:hover {  
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
        -webkit-box-direction: normal;
        box-sizing: inherit;
        font-family: "Roboto";
        font-style: normal;
        border: none;
        line-height: 18px;
        max-width: 100%;
        background: #ccc;
        color: #000;
        cursor: pointer;
        margin: 3px 0;
        text-align: center;
        height: 36px;
        min-width: 64px;
        padding: 0 12px;
        font-size: .775rem;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
        border-radius: 4px;
        display: flex;
        align-items: center;
        -webkit-box-align: center;
        -webkit-box-flex: 0;
        flex: 0 0 auto;
        font-weight: 500;
        letter-spacing: .03em;
        -webkit-box-pack: center;
        justify-content: center;
        outline: 0;
        position: relative;
        text-decoration: none;
        text-indent: .0892857143em;
        text-transform: uppercase;
        transition-duration: .28s;
        transition-property: box-shadow,transform,opacity,-webkit-box-shadow,-webkit-transform;
        transition-timing-function: cubic-bezier(.4,0,.2,1);
        user-select: none;
        vertical-align: middle;
    }

    @media screen and (min-width: 680px) {
        #myBtn {
            width: 180PX;
        }
    }


    #printBtn {
        width: 170px;
        margin-left:auto;
    }

    .agrmnt-modal {
      max-width: none !important;
      display: none;
      position: absolute; 
      z-index: 1;
      padding-top: 200px;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%; 
      overflow: auto; 
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.4); 
    }

    .agrmnt-modal-content {
      background-color: #fefefe;
      margin: auto !important;
      padding: 20px !important;
      border: 1px solid #888;
      width: 80%;
    }

    .agrmnt-close {
      color: #aaaaaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .agrmnt-close:hover,
    .agrmnt-close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
    </style>`
        
    function initAgreementModal() {
        let modal = document.getElementById("myModal");
        let btn = document.getElementById("myBtn");
        let span = document.getElementsByClassName("agrmnt-close")[0] as HTMLElement;

        btn.onclick = function () {
            modal.style.display = "block";
        }

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        let printDiv = function () {
            const divName = 'printableArea'
            let printContents = document.getElementById(divName).innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            window.location.reload()
        }
        var printBtn = document.getElementById("printBtn");
        printBtn.onclick = printDiv
    }
    initAgreementModal()

    let cardId = sender.cardInfo.id
    let url = document.location.href.split("#")[0] + "api/VolmaAPI/GetRecLogs?documentID=" + cardId
    console.log(url)
    let response = await fetch(url)
    response.json().then(async function (respBody) {
        console.log(respBody)
        let agreements = respBody.recLogs
        
        let tableContainer = document.querySelector('#agrmnt-table-container') 
        
        let mainHeaderText = `Лист согласования changed`
        console.log(mainHeaderText)
        // let mainHeader = document.querySelector('#agrmnt-main-header')
        // mainHeader.innerHTML = mainHeaderText

        // let insideNumCtrl = sender.layout.controls.textBox3
        // let initiatorCtrl = sender.layout.controls.registrar
        // let organizationCtrl = sender.layout.controls.staffDepartment1
        // let objectCtrl = sender.layout.controls.directoryDesignerRow1
        // let descriptionCtrl = sender.layout.controls.textBox2

        // let insideNum = insideNumCtrl.params.value ? insideNumCtrl.params.value.number : 'не определен'
        // let initiator = initiatorCtrl.params.value ? initiatorCtrl.params.value.displayName : 'не определен'
        // let organization = organizationCtrl.params.value ? organizationCtrl.params.value.name : 'не определена'
        // let object = objectCtrl.params.value ? objectCtrl.params.value.name : 'не определен'
        // let description = descriptionCtrl.params.value ? descriptionCtrl.params.value : 'не определено'

        //let insideNum =  'insideNum'
        //let initiator = 'initiator'
        //let organization =  'organization'
        //let object = 'object'
        //let description = 'description'



        let header = document.querySelector('#agrmnt-header')  
        header.innerHTML = `
            
        `     
        // header.innerHTML = `<span class="font-bold">Внутренний номер: </span> ${insideNum}<br>
        //     <span class="font-bold">Инициатор: </span> ${initiator}<br>
        //     <span class="font-bold">Организация: </span> ${organization}<br>
        //     <span class="font-bold">Объект: </span> ${object}<br>
        //     <span class="font-bold">Содержание/комментарий: </span> ${description}<br>
        // `
        let tablesHtmlText = '<table>'
        let tableNum = ''
        let tableState = ''
        for (const [tableKey, tableValue] of Object.entries(agreements)) {
            console.log(tableValue)
            tableState = tableValue["sateName"]
            tableNum = (parseInt(tableKey) + 1).toString()
            tablesHtmlText += `
                <tr>
                
                    <th  colspan="4" class="table-lable-cell">
                        <h4>Согласование <span class="font-weight-bold">${tableNum}</span> <span class="font-weight-bold">${tableState}</span></h4>
                    </th>
                </tr>
                <tr class = "table-header-row">
                    <th class="cell-num">№</th>
                    <th class="cell-fio">ФИО, должность</th>
                    <th class="cell-dep">Подразделение</th>
                    <th class="cell-dscn">Решение</th>
                    <th class="cell-cmnt">Комментарий</th>
                    <th class="cell-sdate">Дата начала</th>
                    <th class="cell-edate">Дата завершения</th>
                </tr>`
            for (const [rowKey, rowValue] of Object.entries(tableValue["recLog"])) {
                if (rowValue) {
                    let dateBegin = moment(rowValue["decDate"].split(' / ')[0], "DD.MM.YYYY hh:mm:ss")
                    let dateBeginStr = dateBegin.isValid()?dateBegin.format('DD.MM.YYYY'):''
                    let dateEnd = moment(rowValue["decDate"].split(' / ')[1], "DD.MM.YYYY hh:mm:ss")
                    let dateEndStr = dateEnd.isValid()?dateEnd.format('DD.MM.YYYY'):''
                    let rowNum = (parseInt(rowKey) + 1).toString()
                    tablesHtmlText += `<tr>
                            <td class="cell-num">${rowNum}</td>
                            <td class="cell-fio">${rowValue["fullName"] + ' ' + rowValue["posName"]}</td>
                            <td class="cell-dep">${rowValue["unitName"]}</td>
                            <td class="cell-dscn">${rowValue["decision"]}</td>
                            <td class="cell-cmnt">${rowValue["comment"]}</td>
                            <td class="cell-sdate">${dateBeginStr}</td>
                            <td class="cell-edate">${dateEndStr}</td>
                        </tr>`
                }
            }
            
            
        }
        tablesHtmlText += `</table>`
        tableContainer.innerHTML = tablesHtmlText

        let registrarCtrl = sender.layout.controls.registrar
        let registrarName = registrarCtrl.value?registrarCtrl.value.displayName:''
        let registrarPost = registrarCtrl.value?registrarCtrl.value.position?registrarCtrl.value.position:'':''    
        registrarPost = ', ' + registrarPost

        let depId = registrarCtrl.value.unitId
        let registrarDep 
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        await getDepName(urlResolver, requestManager, depId)
            .then(data=> {
                registrarDep = ', ' + data
                console.log(data)
            })

        let descriptionCtrl = sender.layout.controls.description
        let description = descriptionCtrl.value?'"' + descriptionCtrl.value + '"':''
        if (description.length>0) {
            if (description[0]=='"') {
                description = description.slice(1)
            }
            if (description[description.length-1]=='"') {
                description = description.slice(0, -1)
            }
        }

        let noteTypeCtrl = sender.layout.controls.docType
        let noteType = noteTypeCtrl.value?noteTypeCtrl.value.name.toLowerCase():'не указан'

        let numeratorCtrl = sender.layout.controls.numerator
        let number = numeratorCtrl.value?numeratorCtrl.value.number:''
        let documentNameCtrl = sender.layout.controls.documentName
        let documentName = documentNameCtrl.value?'"' + documentNameCtrl.value + '"':''
        let creationDateCtrl = sender.layout.controls.regDate
        let creationDate = creationDateCtrl.value?moment(creationDateCtrl.value).format("DD.MM.YYYY"):''

        
        let agreementListTitle = document.querySelector("#full-agrmnt-main-header")

        let textElem = document.createElement('div')
        textElem.classList.add("agreement-list-text")
        textElem.innerHTML = `<span class="font-weight-bold">Автор:</span> ${registrarName}${registrarPost}${registrarDep}<br><br>
        <span class="font-weight-bold">Краткое содержание:</span> ${description}`
        agreementListTitle.parentNode.insertBefore( textElem, agreementListTitle.nextSibling );

        // agreementListTitle.classList.add("text-center")

        let subtitleElem = document.createElement('div')
        subtitleElem.classList.add("agreement-list-subtitle")
        subtitleElem.innerHTML = `Тип служебной записки: ${noteType} № ${number}<br>
        ${documentName}<br>
        от ${creationDate}`
        agreementListTitle.parentNode.insertBefore( subtitleElem, agreementListTitle.nextSibling );
    });
}


export async function prepBuisNoteAgrmnt(sender: AgreementList) {
    console.log("prepBuisNoteAgrmnt");

    let agreementList = sender.layout.controls.agreementList;
    let cardId = sender.layout.cardInfo.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let registrarCtrl = sender.layout.controls.registrar
    let registrarName = registrarCtrl.value?registrarCtrl.value.displayName:''
    let registrarPost = registrarCtrl.value?registrarCtrl.value.position?registrarCtrl.value.position:'':''    
    registrarPost = ', ' + registrarPost
    let noteTypeCtrl = sender.layout.controls.docType
    let noteType = noteTypeCtrl.value?noteTypeCtrl.value.name.toLowerCase():'не указан'
    let numeratorCtrl = sender.layout.controls.numerator
    let number = numeratorCtrl.value?numeratorCtrl.value.number:''
    let documentNameCtrl = sender.layout.controls.documentName
    let documentName = documentNameCtrl.value?'"' + documentNameCtrl.value + '"':''
    let creationDateCtrl = sender.layout.controls.regDate
    let creationDate = creationDateCtrl.value?moment(creationDateCtrl.value).format("DD.MM.YYYY"):''
    let descriptionCtrl = sender.layout.controls.description
    let description = descriptionCtrl.value?'"' + descriptionCtrl.value + '"':''
    if (description.length>0) {
        if (description[0]=='"') {
            description = description.slice(1)
        }
        if (description[description.length-1]=='"') {
            description = description.slice(0, -1)
        }
    }
    let depId = registrarCtrl.value.unitId
    let registrarDep 
    await getDepName(urlResolver, requestManager, depId)
        .then(data=> {
            registrarDep = ', ' + data
            console.log(data)
        })
    

    layoutManager.cardLayout.controls.agreementList.params.agreementReportOpening.subscribe(async (handler, args) => {
        args.data.model.documentName = ``
    });

    agreementList.params.agreementReportOpened.subscribe(async (handler, args) => {
        console.log("agreementReportOpened");
        let showOnHovRows = document.querySelectorAll('.show-on-hover')
        showOnHovRows.forEach(element => {
            element.classList.remove("show-on-hover")
        });
        let tableItem = document.querySelectorAll('.system-agreement-list-content>div:last-child')
        tableItem[0].setAttribute("style", "font-size:80%; border: 2px solid black;")

        let contentControl = args.contentControl;
        console.log("contentControl");
        console.log(contentControl);
        args.contentControl.columns.splice(0, 6);
        let columns = contentControl.columns;
        console.log("columns after splice");
        console.log(columns);
        let index = args.contentControl.columns.indexOf(args.contentControl.commentColumn);
        columns.push({
            name: "ФИО",
            wieght: 1,
            value: (item) => item.employeeDisplayText,
            class: 'fio'
        },
        {
            name: "Должность/подразделение",
            wieght: 1,
            value: (item) => item.departmentName,
            class: 'dep'
        },
         {
            name: "Дата",
            wieght: 1,
            value: (item) => item.date,
            class: 'date'
        },
         {
            name: "Результат",
            wieght: 1,
            value: (item) => item.decisionText,
            class: 'decision'
        }, {
            name: "Комментарий",
            wieght: 1,
            value: (item) => item.comment,
            class: 'comments'
        });

        let receivedFromSererItems = await getAgreement(urlResolver, requestManager, cardId);
        let ObjectMas = receivedFromSererItems['items']

        args.model.items = ObjectMas.map(serverItem => (

            {
                employeeDisplayText: serverItem['employeeDisplayText'].split(',')[0],
                departmentName: serverItem['employeeDisplayText'].split(',')[1] + '/' + serverItem['departmentName'],
                date: moment(serverItem['date']).isValid() ? moment(serverItem['date']).format('DD.MM.YYYY HH:mm') : '',
                decisionText: serverItem['decisionText'],
                comment: serverItem['comment']

            }));
        let agreementListTitle = document.querySelector(".agreement-list-title")

        let textElem = document.createElement('div')
        textElem.classList.add("agreement-list-text")
        textElem.innerHTML = `<span class="font-weight-bold">Автор:</span> ${registrarName}${registrarPost}${registrarDep}<br><br>
        <span class="font-weight-bold">Краткое содержание:</span> ${description}`
        agreementListTitle.parentNode.insertBefore( textElem, agreementListTitle.nextSibling );

        // agreementListTitle.classList.add("text-center")

        let subtitleElem = document.createElement('div')
        subtitleElem.classList.add("agreement-list-subtitle")
        subtitleElem.innerHTML = `Тип служебной записки: ${noteType} № ${number}<br>
        ${documentName}<br>
        от ${creationDate}`
        agreementListTitle.parentNode.insertBefore( subtitleElem, agreementListTitle.nextSibling );
        

        args.contentControl.forceUpdate();
        let cellsElems = document.querySelectorAll('.table-helper-cell')
        cellsElems.forEach(element => {
            element.classList.add("text-center")
        });
        console.log(columns)

    });
}

export async function getAgreement(urlResolver: UrlResolver, requestManager: IRequestManager, cardId: String) {
    let url = urlResolver.resolveApiUrl("getAgreementList", "layoutAgreement");
    url += "?cardId=" + cardId;
    return requestManager.get(url);
}

export async function getDepName(urlResolver: UrlResolver, requestManager: IRequestManager, unitID: String) {
    let url = urlResolver.resolveApiUrl("GetUnitName", "EmployeeService");
    url += "?unitID=" + unitID;
    return requestManager.get(url);
}

