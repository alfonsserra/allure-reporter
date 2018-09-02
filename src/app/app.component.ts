import { ChangeDetectorRef, Component, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { TestSummaryTableComponent } from './features/report/summary/test-summary-table.component';
import { TestSuite } from './model/test-suite.model';
import { Step, TestCase } from './model/test-case.model';
import { ReporterDialog, ReporterDialogParameters } from './features/reporter/reporter-dialog.component';
import { LoginDialog, LoginDialogParameters } from './features/login/login-dialog.component';
import { DialogService } from 'systelab-components/widgets/modal';
import { ToastrService } from 'ngx-toastr';
import { TestCaseService } from './service/test-case.service';
import { TestSuiteService } from './service/test-suite.service';

@Component({
	selector:      'app-root',
	templateUrl:   'app.component.html',
	styleUrls:     ['app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {

	@ViewChildren(TestSummaryTableComponent) public summaryList: QueryList<TestSummaryTableComponent>;

	public testSuites: TestSuite[] = [];

	public uploadingFiles: string[] = [];

	public showUser = false;
	public showReport = false;

	public username = '';
	public password = '';
	public server = 'https://jama.systelab.net/contour/rest/latest';
	public numberOfSteps = 1;

	private _showSummary = true;
	get showSummary(): boolean {
		return this._showSummary;
	}

	set showSummary(show: boolean) {
		this._showSummary = show;
		this.update();
	}

	private _showResults = true;
	get showResults(): boolean {
		return this._showResults;
	}

	set showResults(show: boolean) {
		this._showResults = show;
		this.update();
	}

	constructor(private http: HttpClient, private ref: ChangeDetectorRef, protected dialogService: DialogService, protected testSuiteService: TestSuiteService,protected testCaseService: TestCaseService, private toastr: ToastrService) {
	}

	public fileDrop(event: UploadEvent) {

		const files: UploadFile[] = event.files;

		for (const file of files) {
			const fileEntry = file.fileEntry as FileSystemFileEntry;
			fileEntry.file(info => {
				this.uploadingFiles.push(info.name);

				const reader = new FileReader();
				reader.onload = (e: any) => {
					if (info.name.endsWith('.json')) {
						const test: TestCase = JSON.parse(e.target.result);
						this.addTest(test);
					} else {
						if (info.name.endsWith('.xml')) {
							const parser: DOMParser = new DOMParser();
							const xmlDoc: Document = parser.parseFromString(e.target.result, 'text/xml');
							const newTestSuite = this.testSuiteService.parseFromDocument(xmlDoc);
							this.addTestSuite(newTestSuite);
						}
					}
				};
				reader.onloadend = (e: any) => {
					for (let i = this.uploadingFiles.length - 1; i >= 0; i--) {
						if (this.uploadingFiles[i] === info.name) {
							this.uploadingFiles.splice(i, 1);
						}
					}

					// Step number must be incremental after the sorting
					this.testSuites.forEach((suite) => {
						this.numberOfSteps = 1;
						suite.testCases.forEach((testcase) => {
							this.setNumberOfStep(testcase.steps);
						});
					});

					this.update();

				};
				reader.readAsText(info);
			});
		}
	}

	// All the steps with Expected Result must have a step number
	public setNumberOfStep(steps: Step[]) {
		steps.forEach(step => {
			step.numberOfStep = this.numberOfSteps++;
			if (step.steps && step.steps.length > 0) {
				this.setNumberOfStep(step.steps);
			}
		});
	}

	public update() {
		this.ref.detectChanges();
		this.summaryList.toArray()
			.forEach(summary => summary.setTests(this.testSuites));
	}

	private addTest(test: TestCase) {
		const testSuiteId = this.testCaseService.getTmsLink(test);
		const testSuiteName = this.testCaseService.getTmsDescription(test);

		if (test.steps && test.steps.length > 0) {
			const testSuite = this.testSuites.find(ts => ts.id === testSuiteId);
			if (testSuite) {
				this.testSuiteService.addTestCaseToTestSuite(test, testSuite);
			} else {
				const newTestSuite = new TestSuite(testSuiteId, testSuiteName);
				this.testSuiteService.addTestCaseToTestSuite(test, newTestSuite);

				this.addTestSuite(newTestSuite);
			}
		}
	}

	private addTestSuite(newTestSuite: TestSuite) {
		if (newTestSuite.id) {
			const testSuite = this.testSuites.find(ts => ts.id === newTestSuite.id);
			if (testSuite) {
				newTestSuite.testCases.forEach(tc => this.testSuiteService.addTestCaseToTestSuite(tc, testSuite));
			} else {
				this.testSuites.push(newTestSuite);
				this.testSuites.sort((a, b) => (a.id > b.id ? -1 : 1));
			}
		}
	}

	public getDateDetails(test: TestCase) {
		const date = new Date();
		date.setTime(test.start);
		const duration = test.stop - test.start;
		return this.formatDate(date) + '    (Duration ' + duration + ' ms)';
	}

	private formatDate(date: Date) {
		let hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		const sMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
		const strTime = hours + ':' + sMinutes + ' ' + ampm;
		return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
	}

	public doShowUser(show: boolean) {
		this.showUser = show;
		const parameters: LoginDialogParameters = LoginDialog.getParameters();
		parameters.username = this.username;
		parameters.password = this.password;
		parameters.server = this.server;
		this.dialogService.showDialog(LoginDialog, parameters)
			.subscribe(
				(result) => {
					if (result) {
						this.username = result.username;
						this.password = result.password;
						this.server = result.server;
					}
				});
	}

	public doShowReport(show: boolean) {
		this.showReport = show;
		const parameters: ReporterDialogParameters = ReporterDialog.getParameters();
		parameters.username = this.username;
		parameters.password = this.password;
		parameters.server = this.server;
		parameters.testSuites = this.testSuites;

		if (this.testSuites.length === 0) {
			this.toastr.error('No test case provided.');
			return;
		}
		if (!parameters.username) {
			this.toastr.error('No username provided.');
			return;
		}
		if (!parameters.password) {
			this.toastr.error('No password provided.');
			return;
		}
		if (!parameters.server) {
			this.toastr.error('No server provided.');
			return;
		}

		this.dialogService.showDialog(ReporterDialog, parameters)
			.subscribe(
				(result) => {

				});
	}
}
