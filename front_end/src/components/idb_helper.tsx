import { ReplayEntity } from './replay_entity';
export class IDBHelper {
    constructor() {
    }

    /*
    how to check usage:
    navigator.storage.estimate().then((data)=>console.log(data))
    roughly 20K per replay record
    */

    public static LocalIDB: any
    public static ReplayEntityStore = 'ReplayEntityStore'
    public static Key_datetime = 'datetime'
    public static replaySeparator = "===";
    public static maxReplays: number = 1000;

    public static InitIDB(): any {
        let dbReq = indexedDB.open('localDB', 1);
        dbReq.onupgradeneeded = function (event: any) {
            if (event && event.target) {
                IDBHelper.LocalIDB = event.target.result;
            }

            let res = IDBHelper.LocalIDB.createObjectStore(IDBHelper.ReplayEntityStore, { keyPath: IDBHelper.Key_datetime });

            if (!res.indexNames.contains(IDBHelper.Key_datetime)) {
                res.createIndex(IDBHelper.Key_datetime, IDBHelper.Key_datetime);
            }
        }
        dbReq.onsuccess = function (event: any) {
            if (event && event.target) {
                IDBHelper.LocalIDB = event.target.result;
            }
        }
        dbReq.onerror = function (event) {
            console.log('error opening database');
            console.log(event);
        }
    }

    public static SaveReplayEntity(replayState: ReplayEntity) {
        let tx = IDBHelper.LocalIDB.transaction([IDBHelper.ReplayEntityStore], 'readwrite');
        let store = tx.objectStore(IDBHelper.ReplayEntityStore);
        tx.oncomplete = function () { }
        tx.onerror = function (event: any) {
            console.log('error SaveReplayEntity');
            console.log(event);
        }

        var req = store.count();
        req.onsuccess = function () {
            let numToRemove: number = req.result - IDBHelper.maxReplays + 1;
            if (numToRemove > 0) {
                let index = store.index(IDBHelper.Key_datetime);
                let getAllKeysRequest = index.getAllKeys(undefined, numToRemove);
                getAllKeysRequest.onsuccess = function () {
                    let lowerRange = getAllKeysRequest.result[0];
                    let upperRange = getAllKeysRequest.result[getAllKeysRequest.result.length - 1];
                    let deleteRange = IDBKeyRange.bound(lowerRange, upperRange)
                    store.delete(deleteRange)
                    console.log(`attemped to clean up ${numToRemove} records before saving the new one: ${JSON.stringify(getAllKeysRequest.result)}`);
                    IDBHelper.SaveReplayEntityWorker(replayState, store);
                }
                getAllKeysRequest.onerror = function (event: any) {
                    console.log('error in getAllKeysRequest');
                    console.log(event);
                }
            } else {
                IDBHelper.SaveReplayEntityWorker(replayState, store);
            }
        }
        req.onerror = function (event: any) {
            console.log('error in count db store');
            console.log(event);
        }
    }

    public static SaveReplayEntityWorker(replayState: ReplayEntity, store: any) {
        let re = { datetime: replayState.ReplayId, text: JSON.stringify(replayState) };
        store.add(re);

        // test
        // store.add({ datetime: "2022-06-26===20-18-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-26===20-19-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-26===20-20-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-28===20-18-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-28===20-19-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-28===20-20-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-27===20-15-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-27===20-16-54-test-33-4", text: JSON.stringify(replayState) });
        // store.add({ datetime: "2022-06-27===20-17-54-test-33-4", text: JSON.stringify(replayState) });
    }

    public static ReadReplayEntityAll(callback: any) {
        let tx = IDBHelper.LocalIDB.transaction([IDBHelper.ReplayEntityStore], 'readonly');
        let store = tx.objectStore(IDBHelper.ReplayEntityStore);
        let index = store.index(IDBHelper.Key_datetime);
        let req = index.openCursor();

        let dtList: string[] = []
        req.onsuccess = function (event: any) {
            let cursor = event.target.result;
            if (cursor != null) {
                dtList.push(cursor.key)
                cursor.continue();
            } else {
                callback(dtList)
            }
        }
        req.onerror = function (event: any) {
            console.log('error in ReadReplayEntityAll');
            console.log(event);
        }
    }

    public static ReadReplayEntityByDate(dateString: string, callback: any) {
        let tx = IDBHelper.LocalIDB.transaction([IDBHelper.ReplayEntityStore], 'readonly');
        let store = tx.objectStore(IDBHelper.ReplayEntityStore);
        let index = store.index(IDBHelper.Key_datetime);
        let keyRange = IDBKeyRange.bound(dateString, dateString + '\uffff')
        let req = index.openCursor(keyRange);

        let reList: ReplayEntity[] = []
        req.onsuccess = function (event: any) {
            let cursor = event.target.result;
            if (cursor != null) {
                const re = JSON.parse(cursor.value.text)
                let temp = new ReplayEntity();
                temp.CloneFrom(re)
                reList.push(temp)
                cursor.continue();
            } else {
                callback(reList)
            }
        }
        req.onerror = function (event: any) {
            console.log('error in ReadReplayEntityByDate');
            console.log(event);
        }
    }
}
