import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import moment from 'moment'
import { $UrlResolver } from "@docsvision/webclient/System/$UrlResolver";
import { UrlResolver } from "@docsvision/webclient/System/UrlResolver";
import { $RequestManager, IRequestManager } from "@docsvision/webclient/System/$RequestManager";
import { AgreementList } from "@docsvision/webclient/Approval/AgreementList";


// let cardId = layoutManager.cardLayout.getService($CardId);
// let urlResolver = sender.layout.getService($UrlResolver);
// let requestManager = sender.layout.getService($RequestManager);
// let agreementList = sender.layout.controls.agreementList;

// //////
// let appKind = sender.layout.controls.appKind
// let regNumber = sender.layout.controls.regNumber
// let regDate = sender.layout.controls.regDate
// let iniciator = sender.layout.controls.iniciator
// let partnersDepartment1 = sender.layout.controls.partnersDepartment1
// let summ = sender.layout.controls.summ
// let dateEnd = sender.layout.controls.dateEnd
// let dropdown1 = sender.layout.controls.dropdown1
// let description = sender.layout.controls.description
// let cardKind = sender.layout.controls.cardKind



// let receivedFromSererItems = await getAgreement(urlResolver, requestManager, cardId);
// layoutManager.cardLayout.controls.agreementList.params.agreementReportOpening.subscribe(async (handler, args) => {
//     let mainDocumentInfo = ' ';
//     if (receivedFromSererItems['baseDocumentAppKind'] != null) {
//         console.log('ne null')
//         mainDocumentInfo = ` к ${receivedFromSererItems['baseDocumentAppKind']} №${receivedFromSererItems['baseDocumentRegNumber']} от ${moment(receivedFromSererItems['baseDocumentDeliveryDate']).format('L')}`
//     }



//     args.data.model.documentName = `К документу ${appKind.params.value == null ? '' : appKind.params.value.name} № ${regNumber.params.value.number} от ${moment(regDate.params.value).format('L')} ${mainDocumentInfo}\n
//       Автор: ${iniciator.params.value == null ? '' : iniciator.params.value.displayName}\n
//       Контрагент: ${partnersDepartment1.params.value == null ? '' : partnersDepartment1.params.value.name}\n
//       Сумма договора: ${summ.params.value} (KZT)\n
//       Действителен до: ${moment(dateEnd.params.value).format('L')}\n
//       Порядок оплаты: ${dropdown1.params.value == null ? '' : dropdown1.params.value}\n
//       Предмет договора: ${description.params.value == null ? '' : description.params.value}
//       `






// });


// agreementList.params.agreementReportOpened.subscribe(async (handler, args) => {
//     let contentControl = args.contentControl;
//     let columns = contentControl.columns;
//     columns[0].hidden = true
//     columns[1].hidden = true;
//     columns[2].hidden = true;
//     columns[3].hidden = true;
//     columns[4].hidden = true;
//     columns[5].hidden = true;

//     let index = args.contentControl.columns.indexOf(args.contentControl.commentColumn);
//     args.contentControl.columns.splice(index, 1)

//     columns.push({
//         name: "ФИО, должность",
//         wieght: 1,
//         value: (item) => item.fioAndPosition,
//         class: 'fio'
//     }, {
//         name: "Подразделение",
//         wieght: 1,
//         value: (item) => item.unit,
//         class: 'beginDate'
//     }, {
//         name: "Результат",
//         wieght: 1,
//         value: (item) => item.result,
//         class: 'endDate'
//     }, {
//         name: "Комментарии",
//         wieght: 1,
//         value: (item) => item.comment,
//         class: 'decision'
//     }, {
//         name: "Дата",
//         wieght: 1,
//         value: (item) => item.date,
//         class: 'comments'
//     });


//     let ObjectMas = receivedFromSererItems['items']
//     args.model.items = ObjectMas.map(serverItem => (

//         {

//             fioAndPosition: serverItem['fio'],
//             unit: serverItem['department'],
//             result: serverItem['decision'],
//             comment: serverItem['comment'],
//             date: moment(serverItem['endDate']).isValid() ? moment(serverItem['endDate']).format('DD.MM.YYYY') : '',


//         }));
//     args.contentControl.forceUpdate();
// });

export async function fillAgreementList1(sender: AgreementList, e: IEventArgs) {
    console.log("fillAgreementList")

    let cardId = sender.layout.cardInfo.id
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    let agreementList = sender.layout.controls.agreementList;

    let appKind = sender.layout.controls.appKind
    let regNumber = sender.layout.controls.regNumber
    let regDate = sender.layout.controls.regDate
    let iniciator = sender.layout.controls.iniciator
    let partnersDepartment1 = sender.layout.controls.partnersDepartment1
    let summ = sender.layout.controls.summ
    let dateEnd = sender.layout.controls.dateEnd
    let dropdown1 = sender.layout.controls.dropdown1
    let description = sender.layout.controls.description
    let cardKind = sender.layout.controls.cardKind
    let valuteName = sender.layout.controls.dropdown4;

    let receivedFromServerItems = await getAgreement1(urlResolver, requestManager, cardId);
    sender.layout.controls.agreementList.params.agreementReportOpening.subscribe(
        async (handler, args) => {
            let mainDocumentInfo = ' ';
            if (receivedFromServerItems['baseDocumentInfo'] != null) {
                console.log('receivedFromServerItems["baseDocumentInfo"] != null')
                mainDocumentInfo = ` к ${receivedFromServerItems['baseDocumentInfo']}`
            }
            args.data.model.documentName = `К документу ${appKind.params.value == null ? '' : appKind.params.value.name} № ${regNumber.params.value.number} от ${moment(regDate.params.value).format('L')} ${mainDocumentInfo}\n
                Автор: ${iniciator.params.value == null ? '' : iniciator.params.value.displayName}\n
                Контрагент: ${partnersDepartment1.params.value == null ? '' : partnersDepartment1.params.value.name}\n
                Сумма договора: ${summ.params.value} (${valuteName.params.value ? valuteName.params.value : ''})\n
                Действителен до: ${moment(dateEnd.params.value).format('L')}\n
                Порядок оплаты: ${dropdown1.params.value == null ? '' : dropdown1.params.value}\n
                Предмет договора: ${description.params.value == null ? '' : description.params.value}
                `
        })


    agreementList.params.agreementReportOpened.subscribe(async (handler, args) => {
        let contentControl = args.contentControl;
        let columns = contentControl.columns;
        columns[0].hidden = true
        columns[1].hidden = true;
        columns[2].hidden = true;
        columns[3].hidden = true;
        columns[4].hidden = true;
        columns[5].hidden = true;

        let index = args.contentControl.columns.indexOf(args.contentControl.commentColumn);
        args.contentControl.columns.splice(index, 1)

        columns.push({
            name: "ФИО, должность",
            wieght: 1,
            value: (item) => item.fioAndPosition,
            class: 'fio'
        }, {
            name: "Подразделение",
            wieght: 1,
            value: (item) => item.unit,
            class: 'beginDate'
        }, {
            name: "Результат",
            wieght: 1,
            value: (item) => item.result,
            class: 'endDate'
        }, {
            name: "Комментарии",
            wieght: 1,
            value: (item) => item.comment,
            class: 'decision'
        }, {
            name: "Дата",
            wieght: 1,
            value: (item) => item.date,
            class: 'comments'
        });

        let ObjectMas = receivedFromServerItems['items']
        args.model.items = ObjectMas.map(serverItem => (
            {
                fioAndPosition: serverItem['fio'],
                unit: serverItem['department'],
                result: serverItem['decision'],
                comment: serverItem['comment'],
                date: moment(serverItem['endDate']).isValid() ? moment(serverItem['endDate']).format('DD.MM.YYYY') : '',
            }));
        args.contentControl.forceUpdate();
    });

}



export async function getAgreement1(urlResolver: UrlResolver, requestManager: IRequestManager, cardId: String) {
    let url = urlResolver.resolveUrl("GetReconciliationList", "Reconciliation");
    url += "?documentId=" + cardId;
    return requestManager.get(url);
}


function hasStringSubstring(string) {
    console.log(string)
    if (string.includes('Доп.соглашение') || string.includes('Приложение') || string.includes('Спецификация')) {
        return true
    } else {
        return false
    }
}


export async function setRequiredFields(sender:Layout, e:IEventArgs) {
    console.log("setRequiredFields")

    let numerator = sender.layout.controls.numerator1
    let textBox3 = sender.layout.controls.textBox3

    let cardLink1 = sender.layout.controls.cardLink1

    let directoryDesignerRow1 = sender.layout.controls.directoryDesignerRow1
    let directoryDesignerRow1Name = directoryDesignerRow1.params.value.name
    let hasSubstring = hasStringSubstring(directoryDesignerRow1Name)

    if (hasSubstring) {
        textBox3.params.required = true
        cardLink1.params.required = true
    } else {
        textBox3.params.required = false
        cardLink1.params.required = false
    }
}