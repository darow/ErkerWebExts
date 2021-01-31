import * as EventHandlers from "./EventHandlers";
import { extensionManager } from "@docsvision/webclient/System/ExtensionManager";
import {ILocalizationsMap} from "@docsvision/webclient/System/ILocalizationsMap";


// Главная входная точка всего расширения
// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
// чтобы rollup смог собрать их все в один бандл.

// Регистрация расширения позволяет корректно установить все
// обработчики событий, сервисы и прочие сущности web-приложения.
extensionManager.registerExtension({
    name: "Template web extension",
    version: "5.5.14",
    globalEventHandlers: [ EventHandlers ],
    getLocalizations: getLocalizations
})

function getLocalizations(): ILocalizationsMap {
    let cultureMap = {};
    cultureMap["ru"] = {
        "AgreementList_Caption": "{1}",
        "AgreementList_CaptionNoNumber": "{0}"
    };
    cultureMap["en"] = {
        "AgreementList_Caption": "{1}",
        "AgreementList_CaptionNoNumber": "{0}"

    };
    return cultureMap;
}