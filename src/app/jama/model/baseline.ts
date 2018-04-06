/**
 * Jama REST API
 * This is the documentation for the Jama REST API.
 *
 * OpenAPI spec version: latest
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { BaselineOrigin } from './baselineOrigin';

export interface Baseline {
	id?: number;

	name?: string;

	description?: string;

	createdDate?: Date;

	/**
	 * ID of a user
	 */
	createdBy?: number;

	/**
	 * ID of a project
	 */
	project?: number;

	origin?: BaselineOrigin;

	type?: string;

}

