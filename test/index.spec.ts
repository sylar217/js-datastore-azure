const Key = require('interface-datastore').Key
import * as storage from 'azure-storage';
const blobServiceMock = require('./utils/blobStorage-mock');
const standin = require('stand-in')
import { AzureDataStore } from '../src/index'

describe('AzureDataStore', () => {
    const blobService = storage.createBlobService();
    const containerName = 'ipfscontainer';
    describe('construction', () => {
        it('Requires a container', () => {
            expect(
                () => new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName })
            ).toThrow(); 
        });
        it('createIfMissing defaults to false', () => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName });
                    expect(blobStore.createIfMissing).toBe(false);
                }
            });
        });
        it('createIfMissing can be set to true', () => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName, createIfMissing: true });
                    expect(blobStore.createIfMissing).toBe(true);
                }
            });
        });
    });

    describe('put', () => {
        it('should include the path in the key', (done) => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName });

                    standin.replace(blobService, 'createBlockBlobFromText', function (stand, params, callback) {
                        expect(params.Key).toEqual('.ipfs/datastore/z/key');
                        stand.restore();
                        callback(null);
                    });
                    
                    blobStore.put(new Key('/z/key'), Buffer.from('test data'), done);
                }
            });
        });
        it('should return a standard error when the put fails', (done) => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName });

                    standin.replace(blobService, 'createBlockBlobFromText', function (stand, params, callback) {
                        expect(params.Key).toEqual('.ipfs/datastore/z/key');
                        stand.restore();
                        callback(new Error('bad things happened'));
                    });
                    
                    blobStore.put(new Key('/z/key'), Buffer.from('test data'), (err) => {
                        expect(err.code).toEqual('ERR_DB_WRITE_FAILED');
                        done();
                    });
                }
            });
        });
    });

    describe('get', () => {
        it('should include the path in the fetch key', (done) => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName });

                    standin.replace(blobService, 'getBlobToText', function (stand, params, callback) {
                        expect(params.Key).toEqual('.ipfs/datastore/z/key');
                        stand.restore();
                        callback(null, { Body: Buffer.from('test') });
                    });
                    
                    blobStore.get(new Key('/z/Key'), done);
                }
            });
        });
        it('should return a standard not found error code if the key isnt found', (done) => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName });

                    standin.replace(blobService, 'getBlobToText', function (stand, params, callback) {
                        expect(params.Key).toEqual('.ipfs/datastore/z/key');
                        stand.restore();
                        let error = new Error('not found'); 
                        callback(error);
                    });
                    
                    blobStore.get(new Key('/z/Key'), (err) => {
                        expect(err.code).toEqual('ERR_NOT_FOUND');
                        done();
                    });
                }
            });
        });
    });

    describe('delete', () => {
        it('should return a standard delete error if deletion fails', (done) => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName });

                    standin.replace(blobService, 'deleteContainerIfExists', function (stand, params, callback) {
                        expect(params.Key).toEqual('.ipfs/datastore/z/key');
                        stand.restore();
                        callback(new Error('bad things'));
                    });
                    
                    blobStore.delete(new Key('/z/Key'), (err) => {
                        expect(err.code).toEqual('ERR_DB_DELETE_FAILED');
                        done();
                    });
                }
            });
        });
    });

    describe('open', () => {
        it('should return a standard open error if blob exist check fails', (done) => {
            blobService.createContainerIfNotExists(containerName, err => {
                if (err) {
                    console.log('Error creating container');
                }
                else 
                {
                    const blobStore = new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName });

                    standin.replace(blobService, 'doesBlobExist', function (stand, params, callback) {
                        stand.restore();
                        callback(new Error('unknown'));
                    });
                    
                    blobStore.open((err) => {
                        expect(err.code).toEqual('ERR_DB_OPEN_FAILED');
                        done();
                    });
                }
            });
        });
    });

    describe('interface-datastore', () => {
        require('interface-datastore/src/tests')({
            setup (callback) {
                blobService.createContainerIfNotExists(containerName, err => {
                    if (err) {
                        console.log('Error creating container');
                    }
                    else 
                    {
                       blobServiceMock(blobService);
                       callback(null, new AzureDataStore('.ipfs/datastore', { blob: blobService, containerName: containerName }));
                    }
                });
            },
            teardown (callback) {
                callback(null);
            }
        });
    });
});