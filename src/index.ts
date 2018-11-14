import * as assert from 'assert';
import { setImmediate, each, series as waterfall } from 'async';
const path = require('upath');
const asyncFilter = require('interface-datastore').utils.asyncFilter;
const asyncSort = require('interface-datastore').utils.asyncSort;

const IDatastore = require('interface-datastore');
const Key = IDatastore.Key;
const Errors = IDatastore.Errors;

const Deferred = require('pull-defer');
const pull = require('pull-stream');

export type AzureDSInputOptions = {
  blob: BlobInstance,
  createIfMissing?: boolean
}

declare type BlobInstance = {
  config: {
    params: {
      Bucket?: string
    }
  },
  deleteObject: any,
  getObject: any,
  headBucket: any,
  headObject: any,
  listObjectsV2: any,
  upload: any
}

class AzureDataStore {
  private path: string;
  private opts: AzureDSInputOptions;
  private bucket: string;
  private createIfMissing: boolean;

  /**
   * Constructor to initialize the class
   * @param path path to azure blob storage container
   * @param opts Azure DS input options
   */
  public constructor ( path: string, opts: AzureDSInputOptions) {
    this.path = path;
    this.opts = opts;
    const {
      createIfMissing = false,
      blob: {
        config: {
          params: {
            Bucket = ""
          } = {}
        } = {}
      } = {}
    } = opts;

    assert(typeof Bucket === 'string', 'An S3 instance with a predefined Bucket must be supplied. See the datastore-s3 README for examples.');
    assert(typeof createIfMissing === 'boolean', `createIfMissing must be a boolean but was (${typeof createIfMissing}) ${createIfMissing}`);
    this.bucket = Bucket;
    this.createIfMissing = createIfMissing;
  }

  /**
   * Returns the full key which includes the path to the ipfs store
   * @param key 
   */
  private getFullString (key: any): string {
    return path.join('.', this.path, key.toString());
  }

  /**
   * Recursively fetches all keys from azure blob storage
   * @param params
   * @param keys 
   * @param callback 
   */
  private listKeys (params: any, keys: any, callback: any): void {
    
  }

  /**
   * Returns an iterator for fetching objects from azure by their key
   * @param keys 
   * @param keysOnly Whether or not only keys should be returned
   */
  private getBlobIterator (keys: any, keysOnly: boolean): any {

  }

  /**
   * Store the given value under the key.
   * @param key 
   * @param val 
   * @param callback 
   */
  public put (key: any, val: Buffer, callback: any): void {

  }

  /**
   * Read content from azure blob storage.
   * @param key 
   * @param callback 
   */
  public get (key: any, callback: any): void {

  }

  /**
   * Check for the existence of the given key.
   * @param key 
   * @param callback 
   */
  public has (key: any, callback: any): void {

  }

  /**
   * Delete the record under the given key.
   * @param key
   * @param callback 
   */
  public delete (key: any, callback: any): void {

  }

  /**
   * Creates a new batch object
   */
  public batch (): any {

  }

  /**
   * Query the azure blob storage
   * @param q 
   */
  public query (q: any): any {

  }

  /**
   * This will check the blob storage container for access and existence
   * @param callback 
   */
  public open (callback: any): void {

  }

  /**
   * Close the store.
   * @param callback
   */
  public close (callback: any): void {
    setImmediate(callback)
  }
}

module.exports = AzureDataStore;