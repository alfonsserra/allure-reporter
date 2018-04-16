import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FileDropModule } from 'ngx-file-drop';
import { TestLabelComponent } from './features/report/labels/test-label.component';
import { MarkdownModule } from 'ngx-markdown';
import { TestStepsComponent } from './features/report/steps/test-steps.component';
import { TestSummaryTableComponent } from './features/report/summary/test-summary-table.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';
import { TestLinkComponent } from './features/report/links/test-link.component';
import { ApiModule } from './jama/index';
import { LoginComponent } from './features/login/login.component';
import { ReportComponent } from './features/reporter/reporter.component';
import { FormsModule } from '@angular/forms';

/*
export function apiConfig() {
	return new Configuration({
		username: 'username',
		password: 'password',
		basePath: 'https://XXXXX/contour/rest/latest',
		withCredentials: true
	});
}
*/
@NgModule({
	imports:      [
		FormsModule,
		ApiModule,
		BrowserModule,
		HttpClientModule,
		FileDropModule,
		MarkdownModule.forRoot()
	],
	declarations: [
		AppComponent,
		TestLabelComponent,
		TestLinkComponent,
		TestStepsComponent,
		TestSummaryTableComponent,
		NavbarComponent,
		FooterComponent,
		LoginComponent,
		ReportComponent
	],
	providers:    [],
	bootstrap:    [AppComponent]
})
export class AppModule {
}
