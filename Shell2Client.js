const axios = require('axios');
const fs = require('fs');
const path = require('path');

/*
	later : additional user.sdk.stream type endpoint
		sequence and sequence_sync, which new promise, subscribes, logs intermittent, resolve on done
*/

const N_TRIALS = 1
const EXP_BACKOFF_MS = 1000

class Shell2Client {

	async _apiPost(route,body){
		let current_trial = 0
		while (current_trial < N_TRIALS) {
			current_trial++
			try {
				const response = await axios.post(
					`https://api.shell2.raiden.ai/${route}` ,
					body ,
					{
						headers: {
							'Content-Type': 'application/json',
							'key': this.api_key,
						}
					}
				)
				return response.data
			}
			catch(error){
				if (error.response.status === 429) {
					// RATE LIMIT EXCEEDED, RETRY WITH EXP BACKOFF
					const delayMs = (EXP_BACKOFF_MS * 2 ** current_trial ) + parseInt(Math.random() * (2*1e3 - 1e3) + 1e3) // jitter
					await new Promise(r => setTimeout(r, delayMs));
				} else {
					return false
				}
			}
		}
		return false
	}

	constructor(api_key) {
		this.api_key = api_key;
		this.session = {
			new : async (query) => { return await this._apiPost(`session/new`,query) },
			update : async (query) => { return await this._apiPost(`session/update`,query) },
			resume : async (query) => { return await this._apiPost(`session/resume`, query) },
			message : async (query) => { return await this._apiPost(`session/message`, query) },
			list : async () => { return await this._apiPost(`session/list`, {}) },
			get : async (query) => { return await this._apiPost(`session/get`, query ) },
		}
		this.sequence = {
			run : async (query) => { return await this._apiPost(`sequence/run`, query ) },
			update : async (query) => { return await this._apiPost(`sequence/update`, query ) },
			list : async () => { return await this._apiPost(`sequence/list`, {}) },
			get : async (query) => { return await this._apiPost(`sequence/get`, query ) },
		}

		this.settings = {
			get : async () => { return await this._apiPost(`user/settings/get`,{}) },
			update : async (query) => { return await this._apiPost(`user/settings/update`,query) },
			reset : async (query) => { return await this._apiPost(`user/settings/update`, {reset:true}) },
		}

		this.storage = {
			//get : this.userSettingsGet.bind(this)
			upload : async (query) => {
				const filename = query.filename ? path.basename(query.filename) : path.basename(query.filepath)
				if (filename === '.') return {status:false,error:`invalid file`}
				const signResponse = await this._apiPost(`user/storage/upload`, {
					filename
				})
				const url = signResponse.url
				const mime = signResponse.mime
				const headers = mime ? {"Content-Type": mime} : {}
				try {
					await axios.put(url, fs.readFileSync(query.filepath), { headers })
					return {status:true,filepath:query.filepath,filename,mime}
				}catch(e){
					return {status:false,error:e}
				}
			},
			download : async (query) => { return await this._apiPost(`user/storage/download`,query) },
			/*
			download : async (query) => {
				try {
					const url = (( await this._apiPost(`user/storage/download`, {filename:query.filename}) ).url )
					if (!query.output) return {status:true,url}
					const response = await axios.get(url, { responseType: 'arraybuffer' })
					fs.writeFileSync(query.output, response.data);
					return {status:true,url,filename:query.filename,output:query.output}
				} catch(e){
					return {status:false,error:e}
				}
			},
			*/
			list : async (query) => { return await this._apiPost(`user/storage/list`, {} ) },
		}
	}
}

module.exports = Shell2Client;
