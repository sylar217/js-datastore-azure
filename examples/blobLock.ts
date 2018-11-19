const path = require('path');

class blobLock
{
    private blob: any;

    constructor (blobDataStore)
    {
        this.blob = blobDataStore;
    }

    getLockFilePath (dir)
    {
        return path.join(dir, 'repo.lock');
    }

    lock (dir, callback)
    {
        const lockPath = this.getLockFilePath(dir);
    }
}