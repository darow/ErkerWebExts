import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import {ICancelableEventArgs} from "@docsvision/webclient/System/ICancelableEventArgs";


export async function newFunc(sender:Layout) {
    console.log("NewFunc");
} 

export async function emplCardRenewDigest(sender:Layout,  args: ICancelableEventArgs<any>) {
    console.log("NewFunc");

    args.wait()

    let surname = sender.layout.controls.surname.value?sender.layout.controls.surname.value:''
    let name = sender.layout.controls.name.value?sender.layout.controls.name.value:''
    let patronymic = sender.layout.controls.patronymic.value?sender.layout.controls.patronymic.value:''
    let emplNum = sender.layout.controls.emplNum.value?sender.layout.controls.emplNum.value:''

    let digest = surname + ' ' + name + ' ' + patronymic + ' ' + emplNum
    sender.layout.controls.digest.value = digest
    args.accept()
} 

export async function fillOutFolder(sender: Layout, e:IEventArgs) {
    let folderCtrl = sender.layout.controls.folderSelect
    folderCtrl.params.value = { "name": "02. Исходящие письма", "type": 1, "id": "d74012cc-0d41-4631-b594-26ebd9c4495c", "targetFolderId": "00000000-0000-0000-0000-000000000000", "hasUnloadedSubfolders": false, "folders": [] }
}


export async function removeGridBlockClass(sender:Layout) {
    console.log("removeGridBlockClass");

    $(".performers-list").removeClass("grid-block") 
} 