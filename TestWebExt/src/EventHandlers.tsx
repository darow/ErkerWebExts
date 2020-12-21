import {IEventArgs} from "@docsvision/webclient/System/IEventArgs"
import {Layout} from "@docsvision/webclient/System/Layout"
import {IDataChangedEventArgs} from "@docsvision/webclient/System/IDataChangedEventArgs"
import {NumberControl} from "@docsvision/webclient/Platform/Number"
// import moment from 'moment'
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver"
import {UrlResolver} from "@docsvision/webclient/System/UrlResolver"
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager"
import {MessageBox} from "@docsvision/webclient/Helpers/MessageBox/MessageBox"

// Все функции, классы и переменные используемые за пределами модуля (т.е. файла)
// должны экспортироваться (содержать ключевое слово export в объявлении).
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

    await postRequest(urlResolver, requestManager, timestamp)
        .then((data: string) => {
            console.log(data)
        })
        .catch((ex) => {
            console.log(ex)
        })
}

export async function postRequest(urlResolver: UrlResolver, requestManager: IRequestManager, timestamp) {
    let url = urlResolver.resolveApiUrl("PrepareDocumentByTaskId", "DocumentProcessService")
    let postdata = {
        taskId: "3672de1e-c6eb-42f1-a2fb-2be218a1d748",
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

