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

import { ContentDisposition } from './contentDisposition';
import { FormDataContentDisposition } from './formDataContentDisposition';
import { MediaType } from './mediaType';
import { MessageBodyWorkers } from './messageBodyWorkers';
import { MultiPart } from './multiPart';
import { ParameterizedHeader } from './parameterizedHeader';
import { Providers } from './providers';

export interface FormDataBodyPart {
	contentDisposition?: ContentDisposition;

	entity?: any;

	headers?: { [key: string]: Array<string>; };

	mediaType?: MediaType;

	messageBodyWorkers?: MessageBodyWorkers;

	parent?: MultiPart;

	providers?: Providers;

	simple?: boolean;

	formDataContentDisposition?: FormDataContentDisposition;

	name?: string;

	value?: string;

	parameterizedHeaders?: { [key: string]: Array<ParameterizedHeader>; };

}


