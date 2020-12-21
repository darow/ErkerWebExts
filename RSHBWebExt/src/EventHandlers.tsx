import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";

export async function fillOutFolder(sender: Layout, e:IEventArgs) {
    let folderCtrl = sender.layout.controls.folderSelect
    folderCtrl.params.value = { "name": "02. Исходящие письма", "type": 1, "id": "d74012cc-0d41-4631-b594-26ebd9c4495c", "targetFolderId": "00000000-0000-0000-0000-000000000000", "hasUnloadedSubfolders": false, "folders": [] }
}