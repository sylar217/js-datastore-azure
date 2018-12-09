const standin = require('stand-in');

class BlobStorageError extends Error {
    private code;
    private statusCode;
    constructor (message, code) {
        super(message);
        this.code = message;
        this.statusCode = code;
    }
}

/**
 * Mocks out the azure blob storage calls made by datastore-azure
 * @param {blobService} blobService
 * @returns {void}
 */
module.exports = function (blobService) {
    const mocks: any = {};
    const storage: any = {};

    mocks.deleteContainerIfExists = standin.replace(blobService, 'deleteContainerIfExists', (stand, params, callback) => {
        if (storage[params.Key])
        {
            delete storage[params.Key];
            callback(null, {});
        }
        else
        {
            callback(new BlobStorageError('NotFound', 404), null);
        }
    });

    mocks.getBlobToText = standin.replace(blobService, 'getBlobToText', (stand, params, callback) => {
        if (storage[params.Key])
        {
            callback(null, { Body: storage[params.Key] });
        }
        else
        {
            callback(new BlobStorageError('NotFound', 404), null);
        }
    });

    mocks.doesBlobExist = standin.replace(blobService, 'doesBlobExist', (standin, params, callback) => {
        if (storage[params.Key])
        {
            callback(null, {});
        }
        else
        {
            callback(new BlobStorageError('NotFound', 404), null);
        }
    });

    mocks.listBlobsSegmentedWithPrefix = standin.replace(blobService, 'listBlobsSegmentedWithPrefix', (standin, params, callback) => {
        const results = {
            Contents: []
        }

        for (let k in storage)
        {
            if (k.startsWith(params.Prefix))
            {
                results.Contents.push({
                    Key: k
                });
            }
        }

        callback(null, results);
    });

    mocks.createBlockBlobFromText = standin.replace(blobService, 'createBlockBlobFromText', (stand, params, callback) => {
        storage[params.Key] = params.Body;
        callback(null);
    });
}