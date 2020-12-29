import { $UrlResolver } from "@docsvision/webclient/System/$UrlResolver";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager";
import { UrlResolver } from "@docsvision/webclient/System/UrlResolver";
import {MessageBox} from "@docsvision/webclient/Helpers/MessageBox/MessageBox";


export async function savePartner(sender: Layout, e: IEventArgs) {
    console.log("savePartner")
    await sender.layout.saveCard()
        .then(async (data) => {
            console.log(data == undefined)
            if (data == undefined) {
                let urlResolver = sender.layout.getService($UrlResolver)
                let requestManager = sender.layout.getService($RequestManager)
                let timestamp = sender.layout.cardInfo.timestamp
                let cardId = sender.layout.cardInfo.id
                await savePartnerRequest(urlResolver, requestManager, timestamp, cardId)
                    .then((data: string) => {
                        console.log(data)
                    })
                    .catch((ex) => {
                        MessageBox.ShowError( ex,"Контрагент не сохранен! ");
                    })
            }
        })
}

export async function savePartnerRequest(urlResolver: UrlResolver, requestManager: IRequestManager, timestamp, partnerCardId) {
    let url = urlResolver.resolveApiUrl("SavePartner", "PartnerService")
    let postdata = {
        docId: partnerCardId,
        timestamp: timestamp
    }
    return requestManager.post(url, JSON.stringify(postdata))
}