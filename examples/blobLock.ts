const path = require('path');

class BlobLock
{
    private blob: any;

    constructor (blobDataStore)
    {
        this.blob = blobDataStore;
    }

    getLockFilePath (dir)
    {
        return 'repo.lock';
    }

    lock (dir, callback)
    {
        const lockPath = this.getLockFilePath(dir);

        this.locked(dir, (err, alreadyLocked) => {
            if (err || alreadyLocked)
            {
                return callback(new Error('The repo is already locked'));
            }

            this.blob.put(lockPath, Buffer.from(''), (err, data) => {
                if (err)
                {
                    return callback(err, null);
                }
                callback(null, this.getCloser(lockPath));
            });
        });
    }

    getCloser (lockPath)
    {
        return {
            close: (callback) => {
                this.blob.delete(lockPath, (err) => {
                    if (err && err.statusCode !== 404)
                    {
                        return callback(err);
                    }
                    callback(null);
                });
            }
        }
    }

    locked (dir, callback)
    {
        this.blob.get(this.getLockFilePath(dir), (err, data) => {
            if (err && err.code === 'ERR_NOT_FOUND')
            {
                return callback(null, false);
            }
            else if (err)
            {
                return callback(err);
            }
            callback(null, true);
        });
    }
}

module.exports = BlobLock