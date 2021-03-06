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

export interface AbstractVersionedItem {
	id?: number;

	/**
	 * Currently active version of the versioned item. If no version is active, currentVersion will not be returned.
	 */
	currentVersion?: number;

	version?: number;

	type?: string;

}


