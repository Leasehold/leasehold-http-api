/*
 * Copyright © 2019 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

'use strict';

const HttpApi = require('./http_api');
const BaseModule = require('lisk-framework/src/modules/base_module');
const { config: defaultConfig } = require('./defaults');
const pkg = require('./package.json');

const DEFAULT_ALIAS = 'leasehold_http_api';

/* eslint-disable class-methods-use-this */

/**
 * Http API module specification
 *
 * @namespace Framework.Modules
 * @type {module.LeaseholdHttpAPIModule}
 */
class LeaseholdHttpAPIModule extends BaseModule {
	constructor(options) {
		super({...defaultConfig.default, ...options});
		if (!options) {
			options = {};
		}
		this.alias = options.alias;
		this.options = options.config;
		this.appConfig = options.appConfig;
		this.httpApi = null;
	}

	get dependencies() {
		return ['app', 'network', this.options.chainModuleAlias];
	}

	static get alias() {
		return DEFAULT_ALIAS;
	}

	static get info() {
		return {
			author: 'Jonathan Gros-Dubois',
			version: pkg.version,
			name: DEFAULT_ALIAS,
		};
	}

	static get defaults() {
		return defaultConfig;
	}

	get events() {
		return [];
	}

	get actions() {
		return {};
	}

	async load(channel) {
		this.httpApi = new HttpApi(channel, this.options, this.appConfig);

		await channel.once('app:ready', async () => {
			await this.httpApi.bootstrap();
		});
	}

	async unload() {
		return this.httpApi ? this.httpApi.cleanup(0) : true;
	}
}

module.exports = LeaseholdHttpAPIModule;
