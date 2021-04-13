import {IEventArgs} from "@docsvision/webclient/System/IEventArgs"
import {Layout} from "@docsvision/webclient/System/Layout"
import {IDataChangedEventArgs} from "@docsvision/webclient/System/IDataChangedEventArgs"
import {NumberControl} from "@docsvision/webclient/Platform/Number"
import moment from 'moment'
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver"
import {UrlResolver} from "@docsvision/webclient/System/UrlResolver"
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager"
import {MessageBox} from "@docsvision/webclient/Helpers/MessageBox/MessageBox"
import { $CurrentEmployee } from "@docsvision/webclient/StandardServices"


export async function showReportAboutEmployees(sender: Layout) {
    console.log("showReportAboutEmployees")
    
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let startDate = moment(sender.layout.controls.reportStartDate.value).format('M.D.YYYY')
    let endDate = moment(sender.layout.controls.reportEndDate.value).format('M.D.YYYY')
    let empls = sender.layout.controls.multipleEmployees1.value;
    let employeesData = []
    for (let i = 0; i < empls.length; i++) {
        console.log(empls[i].id)
        let employeeId = empls[i].id
        let emplTasksCount = await getEmplTasksCount(urlResolver, requestManager, employeeId)
        let emplTasksPerDayCount = await getEmplTasksPerDayCount(urlResolver, requestManager, employeeId, startDate, endDate)
        employeesData.push({
            'fio': empls[i].displayName,
            'taskCount': emplTasksCount['taskCount'],
            'expiredCount': emplTasksCount['expiredCount'],
            'emplTasksPerDayCount': emplTasksPerDayCount['employeeTasksList']
        })
    }
    let data = JSON.stringify(employeesData)
    console.log(data);
    window.open(
        `http://localhost:8002/?operation=tasksReport&employeesData=${data}`,
        '_blank'
    )   
}


export async function callReportAboutCurrentEmpl(sender: Layout) {
    console.log("callReportAboutCurrentEmpl")
    
    let currentUser = sender.layout.getService($CurrentEmployee)
    let currentEmplId = currentUser.id;
    callReport(sender, currentEmplId)
}


export async function callReportAboutEmplInForm(sender: Layout) {
    console.log("callReportAboutEmplInForm")
    
    let employeeId = sender.layout.controls.employee.value.id
    callReport(sender, employeeId)
}


export async function callReport(sender, emplId) {
    console.log("callReport")
    
    let employeeId = sender.layout.controls.employee.value.id
    let employeeName = sender.layout.controls.employee.value.displayName
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let startDate = moment(sender.layout.controls.reportStartDate.value).format('M.D.YYYY')
    let endDate = moment(sender.layout.controls.reportEndDate.value).format('M.D.YYYY')

    let emplTasksCount = await getEmplTasksCount(urlResolver, requestManager, employeeId)
    let emplTasksPerDayCount = await getEmplTasksPerDayCount(urlResolver, requestManager, employeeId, startDate, endDate)
    let dataToSend = [{
        'fio': employeeName,
        'taskCount': emplTasksCount['taskCount'],
        'expiredCount': emplTasksCount['expiredCount'],
        'emplTasksPerDayCount': emplTasksPerDayCount['employeeTasksList']
    }]
    let data = JSON.stringify(dataToSend)

    window.open(
        `http://localhost:8002/?operation=tasksReport&employeesData=${data}`,
        '_blank'
    )  
}


export async function getEmplTasksPerDayCount(urlResolver: UrlResolver, requestManager: IRequestManager, emplId, startDate, endDate) {
    let url = urlResolver.resolveUrl("GetEmployeeTasks", "Chart")
    url += "?startDate=" + startDate + "&endDate=" + endDate + "&employeeId=" + emplId
    // http://localhost:83/DocsvisionWebClient/Chart/GetEmployeeTasks?startDate=6/1/2020&endDate=1/1/2021&employeeId=59CDDEB1-0FA8-4581-A088-2EE555FE5B84
    return requestManager.get(url)
}


export async function getEmplTasksCount(urlResolver: UrlResolver, requestManager: IRequestManager, emplId) {
    let url = urlResolver.resolveApiUrl("GetTaskCount", "EmployeeService")
    url += "?emplID=" + emplId
    return requestManager.get(url)
}


export async function pythTest(sender: Layout) {
    console.log("pythTest")
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["/script1.py", "arg1", "arg2"]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(data)
    });
}

export async function pythTestt(sender: Layout) {
    console.log("pythTestt")
    
}


export async function prepareDocument(sender: Layout, e: IEventArgs) {
    console.log(sender.layout.cardInfo.timestamp)
    let timestamp = sender.layout.cardInfo.timestamp
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let taskId = "bdcaffe5-f830-43d7-a019-e696d06f85b8"
    await prepareDocById(urlResolver, requestManager, taskId, timestamp)
        .then((data: string) => {
            console.log(data["infoMessage"])
        })
}

export async function prepareDocById(urlResolver: UrlResolver, requestManager: IRequestManager, taskId: string, timestamp) {
    let url = urlResolver.resolveApiUrl("PrepareDocumentByTaskId", "DocumentProcessService")
    url += "?taskId=" + taskId + "&timestamp=" + timestamp
    return requestManager.get(url)
}

export async function logPostRequest(sender) {
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let timestamp = sender.layout.cardInfo.timestamp
    let cardId = sender.layout.cardInfo.id
    await postRequest(urlResolver, requestManager, timestamp, cardId)
        .then((data: string) => {
            console.log(data)
        })
        .catch((ex) => {
            console.log(ex)
        })
}

export async function postRequest(urlResolver: UrlResolver, requestManager: IRequestManager, timestamp, cardId) {
    let url = urlResolver.resolveApiUrl("PrepareDocumentByTaskId", "DocumentProcessService")
    let postdata = {
        taskId: cardId,
        timestamp: timestamp
    }
    return requestManager.post(url, JSON.stringify(postdata))
}

//Задачи
export async function FillState(sender: Layout, e: IEventArgs) {
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let tableLength = sender.layout.controls.table1.rows.length
    let linkCardControls = sender.layout.controls.get("cardLink1")
    let textAreaControls = sender.layout.controls.get("textArea1")
    let cardId = ""
    for (let i = 0; i < tableLength; i++) {
        if (linkCardControls[i].params.value != null) {
            cardId = linkCardControls[i].params.value.cardId
            console.log(cardId)
            textAreaControls[i].params.value = `Состояние для cardId: ${cardId}`
            // await getCardStateAndSum(urlResolver, requestManager, cardId)
            //     .then((data: string) => {
            //                    console.log(data["state"])
            //     })
        }
    }
}

export async function getCardStateAndSum(urlResolver: UrlResolver, requestManager: IRequestManager, cardId: string) {
    let url = urlResolver.resolveApiUrl("getCardStateAndSum", "getCardInfo")
    url += "?Id=" + cardId
    return requestManager.get(url)
}

export async function makeRequired(sender: Layout, e: IEventArgs) {
    let textBox = sender.layout.controls.bl2textbox
    let requ = sender.layout.controls.Requ
    if (requ.params.value == "Обяз") {
        textBox.params.required = true
    } else {
        textBox.params.required = false
    }
}

export async function makeVisible(sender: Layout, e: IEventArgs) {
    let employee1 = sender.layout.controls.employee1
    let customButton1 = sender.layout.controls.customButton1
    if (employee1.params.value.id == "2f7a53b6-7919-4e7d-aeb9-c9897f311ff7") {
        customButton1.params.visibility = true
    } else {
        customButton1.params.visibility = false
    }
}

export async function createNewCard(sender: Layout, e: IEventArgs) {
    let theme = sender.layout.controls.theme.params.value
    let cardId = sender.layout.cardInfo.id
    let timestamp = sender.layout.cardInfo.timestamp.toString()
    localStorage.setItem('theme', theme)
    localStorage.setItem('parentCardId', cardId)
    localStorage.setItem('parentCardTimeStamp', timestamp)

    console.log("Open New Card!")
    window.open('#/NewCard/b9f7bfd7-7429-455e-a3f1-94ffb569c794/92c1871e-634a-4121-8faf-e33596abca10')
}

export async function createLinksRequest(urlResolver: UrlResolver, requestManager: IRequestManager, childrenCardId, parentCardId, timestamp) {
    let url = urlResolver.resolveApiUrl("addExistingCardLink", "layoutLinks")
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
    return requestManager.post(url, JSON.stringify(postdata))
}

export async function createLinks(sender: Layout, e: IEventArgs) {
    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    let parentCardId = localStorage.getItem('parentCardId')
    let parentTimestamp = localStorage.getItem('parentCardTimeStamp')
    let themeValue = localStorage.getItem('theme')


    let childrenCardId = sender.layout.cardInfo.id

    if ((parentCardId != null) && (parentTimestamp != null)) {
        setTimeout(async function () {
            await createLinksRequest(urlResolver, requestManager, parentCardId, childrenCardId, parentTimestamp)
            localStorage.removeItem('parentCardId')
            localStorage.removeItem('parentCardTimeStamp')
            localStorage.removeItem('theme')
            sender.layout.controls.theme.params.value = themeValue
        }, 5000)
    }
}

export async function markState(sender: Layout, e: IEventArgs) {
    let stateControl = sender.layout.controls.state1
    let stateValue = stateControl.params.value.caption
    if (stateValue == "Зарегистрирован") {
        stateControl.params.customCssClasses = 'text-red'
    }
}

export async function leaveComment(sender: Layout, e: IEventArgs) {
    let commentsControl = sender.layout.controls.comments
    let txtInput = prompt("Введите текст комментария", "Комментарий")
    if (txtInput != "") {
        commentsControl.addComment(txtInput)
    } else {
        alert("Добавьте непустой комментарий")
    }
}

export async function markThemeIfStateReg(sender: Layout, e: IEventArgs) {
    let stateControl = sender.layout.controls.state1
    let cardLinkControl = sender.layout.controls.cardLink2
    let cardId = cardLinkControl.params.value.cardId

    let urlResolver = sender.layout.getService($UrlResolver)
    let requestManager = sender.layout.getService($RequestManager)
    if (cardId != null) {
        await getCardStateAndSum(urlResolver, requestManager, cardId)
            .then((data: string) => {
                console.log(data["state"])
                if (data["State"] == "Зарегистрирован") {
                    cardLinkControl.params.customCssClasses = 'text-red'
                }
            })
    }
}

export async function hideCreateButtonNew(sender: Layout, e: IEventArgs) {
    console.log(window.location.hash)
    if ((window.location.hash.includes('#/Dashboard')) || (window.location.hash.includes('#/Folder/e9572bcb-' +
        'c590-4624-9005-9b657812ba1f?Color=folder-default'))) {
        $('.new-card').css('display', 'none')
    } else {
        $('.new-card').css('display', 'inline-block')
    }
}

export async function addClassesToFileControl(sender:Layout, e:IEventArgs) {
    console.log("addClassesToFileControl()")
    let cellsElems = document.querySelectorAll('.file-table-body div.table-helper-cell')
    for (let i = 0; i<cellsElems.length/4; i++) {
        cellsElems[i*4].classList.add("file-icon-cell")
        cellsElems[i*4].children[0].classList.add("file-icon")
        cellsElems[i*4+1].classList.add("file-name-cell")
        cellsElems[i*4+1].children[0].classList.add("file-version")
        cellsElems[i*4+2].classList.add("file-version-cell")
        cellsElems[i*4+2].children[0].classList.add("file-version")
        cellsElems[i*4+3].classList.add("file-settings-cell")
        cellsElems[i*4+3].children[0].classList.add("file-settings")
    }
}
