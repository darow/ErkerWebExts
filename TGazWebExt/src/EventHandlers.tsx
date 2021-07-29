import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";

export function newExpertizeSaveFields(sender: Layout, e: IEventArgs) {
    console.log('newExpSaveFields')

    let directoryDesignerRow1Val = sender.layout.controls.directoryDesignerRow1.params.value
    let textArea1Val = sender.layout.controls.textArea1.params.value
    let directoryDesignerRow2Val = sender.layout.controls.directoryDesignerRow1.params.value
    let textArea2Val = sender.layout.controls.textArea2.params.value
    let textArea3Val = sender.layout.controls.textArea3.params.value

    let expertizeFieldsData = {
        "directoryDesignerRow1": directoryDesignerRow1Val,
        "textArea1": textArea1Val,
        "directoryDesignerRow2": directoryDesignerRow2Val,
        "textArea2": textArea2Val,
        "textArea3": textArea3Val,
    }

    localStorage.setItem('expertizeFieldsData', JSON.stringify(expertizeFieldsData))
}

export function newExpertizePasteFields(sender: Layout, e: IEventArgs) {
    console.log('newExperizePasteFields')

    let expertizeFieldsData = JSON.parse(localStorage.getItem('expertizeFieldsData'))

    let directoryDesignerRow1Ctrl = sender.layout.controls.directoryDesignerRow1
    let textArea1Ctrl = sender.layout.controls.textArea1
    let directoryDesignerRow2Ctrl = sender.layout.controls.directoryDesignerRow2
    let textArea2Ctrl = sender.layout.controls.textArea2
    let textArea3Ctrl = sender.layout.controls.textArea3

    directoryDesignerRow1Ctrl.params.value = expertizeFieldsData["directoryDesignerRow1"]
    textArea1Ctrl.params.value = expertizeFieldsData["textArea1"]
    directoryDesignerRow2Ctrl.params.value = expertizeFieldsData["directoryDesignerRow2"]
    textArea2Ctrl.params.value = expertizeFieldsData["textArea2"]
    textArea3Ctrl.params.value = expertizeFieldsData["textArea3"]
}

export function disableFieldsInPassport(sender: Layout, e: IEventArgs) {
    console.log('disableFieldsInPassport')

    let controls = sender.layout.controls
    let placeTypeVal = controls.directoryDesignerRow3.params.value
    let placeType = placeTypeVal?placeTypeVal.name:""

    if (placeType == "ГРС") {
        controls.directoryDesignerRow1.params.disabled = true 
        controls.textArea1.params.disabled = true 
        controls.directoryDesignerRow2.params.disabled = true 
        controls.textArea3.params.disabled = true 
        controls.directoryDesignerRow3.params.disabled = true 
        controls.directoryDesignerRow6.params.disabled = true 
        controls.textArea14.params.disabled = true 
        controls.number6.params.disabled = true 
        controls.number7.params.disabled = true 
        controls.number8.params.disabled = true 
        controls.textArea17.params.disabled = true 

        controls.directoryDesignerRow1.params.customCssClasses += " disabled" 
        controls.textArea1.params.customCssClasses += " disabled" 
        controls.directoryDesignerRow2.params.customCssClasses += " disabled" 
        controls.textArea3.params.customCssClasses += " disabled" 
        controls.directoryDesignerRow3.params.customCssClasses += " disabled" 
        controls.directoryDesignerRow6.params.customCssClasses += " disabled" 
        controls.textArea14.params.customCssClasses += " disabled" 
        controls.number6.params.customCssClasses += " disabled" 
        controls.number7.params.customCssClasses += " disabled" 
        controls.number8.params.customCssClasses += " disabled" 
        controls.textArea17.params.customCssClasses += " disabled" 
    } else if (placeType == "КС") {
        controls.directoryDesignerRow1.params.disabled = true 
        controls.directoryDesignerRow2.params.disabled = true 
        controls.textArea3.params.disabled = true
        controls.directoryDesignerRow3.params.disabled = true
        controls.directoryDesignerRow6.params.disabled = true
        controls.textArea14.params.disabled = true
        controls.number6.params.disabled = true
        controls.number7.params.disabled = true
        controls.number8.params.disabled = true
        controls.textArea17.params.disabled = true

        controls.directoryDesignerRow1.params.customCssClasses += " disabled" 
        controls.directoryDesignerRow2.params.customCssClasses += " disabled" 
        controls.textArea3.params.customCssClasses += " disabled" 
        controls.directoryDesignerRow3.params.customCssClasses += " disabled" 
        controls.directoryDesignerRow6.params.customCssClasses += " disabled" 
        controls.textArea14.params.customCssClasses += " disabled" 
        controls.number6.params.customCssClasses += " disabled" 
        controls.number7.params.customCssClasses += " disabled" 
        controls.number8.params.customCssClasses += " disabled" 
        controls.textArea17.params.customCssClasses += " disabled" 
    } else if (placeType == "ЛЧ") {
        controls.directoryDesignerRow1.params.disabled = true;
        controls.textArea1.params.disabled = true;
        controls.directoryDesignerRow2.params.disabled = true;
        controls.textArea2.params.disabled = true;
        controls.textArea3.params.disabled = true;
        controls.textArea5.params.disabled = true;
        controls.directoryDesignerRow3.params.disabled = true;
        controls.directoryDesignerRow4.params.disabled = true;
        controls.textArea6.params.disabled = true;

        controls.number3.params.disabled = true;
        controls.number4.params.disabled = true;
        controls.textArea7.params.disabled = true;

        controls.textArea10.params.disabled = true;
        controls.dateTimePicker1.params.disabled = true;
        controls.textArea12.params.disabled = true;
        controls.textArea13.params.disabled = true;

        controls.directoryDesignerRow1.params.customCssClasses += " disabled";
        controls.textArea1.params.customCssClasses += " disabled";
        controls.directoryDesignerRow2.params.customCssClasses += " disabled";
        controls.textArea2.params.customCssClasses += " disabled";
        controls.textArea3.params.customCssClasses += " disabled";
        controls.textArea5.params.customCssClasses += " disabled";
        controls.directoryDesignerRow3.params.customCssClasses += " disabled";
        controls.directoryDesignerRow4.params.customCssClasses += " disabled";
        controls.textArea6.params.customCssClasses += " disabled";

        controls.number3.params.customCssClasses += " disabled";
        controls.number4.params.customCssClasses += " disabled";
        controls.textArea7.params.customCssClasses += " disabled";

        controls.textArea10.params.customCssClasses += " disabled";
        controls.dateTimePicker1.params.customCssClasses += " disabled";
        controls.textArea12.params.customCssClasses += " disabled";
        controls.textArea13.params.customCssClasses += " disabled";
    } 

    
      
}

export function setDefaultFolder(sender: Layout, e: IEventArgs) {
    console.log('setDefaultFolder')
    
    sender.layout.controls.folder1.params.value = {
        "name": "3. Экспертизы ТУ",
        "type": 1,
        "id": "f9b73fc7-aeff-4078-9afd-d395dadd1e19",
        "targetFolderId": "00000000-0000-0000-0000-000000000000",
        "hasUnloadedSubfolders": false,
        "folders": []
    } 
}
