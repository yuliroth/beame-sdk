/**
 * Created by zenit1 on 03/07/2016.
 */

require('./Globals');
var _ = require('underscore');
var dataServices = new (require('../services/DataServices'))();

/**
 * @typedef {Object} AuthData
 * @property {String} pk => path to file
 * @property {String} x509 => path to file
 * @property {boolean} generateKeys => flag to private key generation
 * @property {boolean} makeCSR => flag to create csr
 * @property {String} devPath => path for storing keys
 * @property {String|null|undefined} CSRsubj => subject for CSR
 */


/**
 * @typedef {Object} ApiData
 * @property {String} version => api version
 * @property {Object} postData => post data to send to provision in JSON format
 * @property {String} api => api endpoint
 * @property {boolean} answerExpected => if response data expecting from provision
 */


/**
 * @typedef {Object} DebugMessage
 * @param {String} module
 * @param {String} code
 * @param {String} message
 * @param {Object} data
 */

/** @const {String} */
var csrSubj = "C=US/ST=Florida/L=Gainesville/O=LFE.COM, Inc/OU=Development/CN=";

module.exports = {

    /**
     *
     * @param {String} module
     * @param {String} code
     * @param {String} message
     * @param {Object} data
     * @returns {DebugMessage}
     */
    formatDebugMessage: function (module, code, message, data) {
        return {
            module: module,
            code: code,
            message: message,
            data: data
        }
    },

    /**
     *
     * @param {String} path2Pk
     * @param {String} path2X509
     * @param {boolean} genKeys
     * @param {boolean} genScr
     * @param {String|null|undefined} [certPath]
     * @param {String|null|undefined} [hostname]
     * @returns {AuthData}
     */
    getAuthToken: function (path2Pk, path2X509, genKeys, genScr, certPath, hostname) {
        return {
            pk: path2Pk,
            x509: path2X509,
            generateKeys: genKeys,
            makeCSR: genScr,
            devPath: certPath,//static path for now, need to generate with uid to allow multiuser tests
            CSRsubj: csrSubj + hostname
        }
    },


    /**
     * @param {String} version
     * @param {String} endpoint
     * @param {Object} postData
     * @param {boolean} answerExpected
     * @returns {ApiData}
     */
    getApiCallData: function (version, endpoint, postData, answerExpected) {
        return {
            version: version,
            api: endpoint,
            postData: postData,
            answerExpected: answerExpected
        };
    },

    /**
     * @param {String} endpoint
     * @param {Object} postData
     * @param {boolean} answerExpected
     * @returns {ApiData}
     */
    getApiData: function (endpoint, postData, answerExpected) {
        return {
            api: endpoint,
            postData: postData,
            answerExpected: answerExpected
        };
    },

    /**
     * try read metadata file for node
     * @param {String} devDir
     * @param {String} hostname
     * @param {String} module
     * @returns {Promise.<Object>}
     */
    getNodeMetadata: function (devDir, hostname, module) {

        var formatter = this.formatDebugMessage;

        return new Promise(function (resolve, reject) {

            var developerMetadataPath = devDir + global.metadataFileName;
            var metadata = dataServices.readJSON(developerMetadataPath);

            if (_.isEmpty(metadata)) {
                var errorJson = formatter(module, global.MessageCodes.MetadataEmpty, "metadata.json for is empty", {"hostname": hostname});
                console.error(errorJson);
                reject(errorJson);
            }
            else {
                resolve(metadata);
            }

        });
    },
    /**
     *
     * @param {Object} obj
     */
    stringify: function (obj) {
        return JSON.stringify(obj, null, 2);
    },


    isAmazon: function () {
        return process.env.NODE_ENV ? true : false;
    }
}
;
