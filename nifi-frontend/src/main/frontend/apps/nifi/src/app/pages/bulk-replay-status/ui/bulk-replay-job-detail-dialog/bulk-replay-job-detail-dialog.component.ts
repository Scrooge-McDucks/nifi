/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NiFiCommon } from '@nifi/shared';
import { BulkReplayEventResult, BulkReplayJobDetail } from '../../state';

export interface BulkReplayJobDetailDialogData {
    job: BulkReplayJobDetail;
}

@Component({
    selector: 'bulk-replay-job-detail-dialog',
    templateUrl: './bulk-replay-job-detail-dialog.component.html',
    styleUrls: ['./bulk-replay-job-detail-dialog.component.scss'],
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterLink,
        DatePipe,
        KeyValuePipe
    ]
})
export class BulkReplayJobDetailDialog implements AfterViewInit {
    dialogData = inject<BulkReplayJobDetailDialogData>(MAT_DIALOG_DATA);
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    private nifiCommon = inject(NiFiCommon);
    private destroyRef = inject(DestroyRef);

    @Output() refresh = new EventEmitter<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) matSort!: MatSort;

    job: BulkReplayJobDetail = this.dialogData.job;

    eventResultsDataSource = new MatTableDataSource<BulkReplayEventResult>(this.job.eventResults);

    eventResultColumns: string[] = ['eventId', 'flowFileUuid', 'eventTime', 'status', 'failureReason', 'actions'];

    sort: Sort = { active: 'eventTime', direction: 'asc' };

    filterForm: FormGroup;
    filterColumnOptions: string[] = ['any field', 'event id', 'flow file uuid', 'status', 'failure reason'];
    totalCount = this.job.eventResults.length;
    filteredCount = this.job.eventResults.length;

    constructor() {
        this.filterForm = this.formBuilder.group({
            filterTerm: '',
            filterColumn: this.filterColumnOptions[0]
        });

        this.eventResultsDataSource.filterPredicate = (data: BulkReplayEventResult, filter: string) => {
            const { filterTerm, filterColumn } = JSON.parse(filter);
            if (filterColumn === 'any field') {
                return (
                    this.nifiCommon.stringContains(String(data.eventId), filterTerm, true) ||
                    this.nifiCommon.stringContains(data.flowFileUuid, filterTerm, true) ||
                    this.nifiCommon.stringContains(data.eventTime, filterTerm, true) ||
                    this.nifiCommon.stringContains(data.status, filterTerm, true) ||
                    this.nifiCommon.stringContains(data.failureReason ?? '', filterTerm, true)
                );
            } else if (filterColumn === 'event id') {
                return this.nifiCommon.stringContains(String(data.eventId), filterTerm, true);
            } else if (filterColumn === 'flow file uuid') {
                return this.nifiCommon.stringContains(data.flowFileUuid, filterTerm, true);
            } else if (filterColumn === 'status') {
                return this.nifiCommon.stringContains(data.status, filterTerm, true);
            } else if (filterColumn === 'failure reason') {
                return this.nifiCommon.stringContains(data.failureReason ?? '', filterTerm, true);
            }
            return true;
        };
    }

    get jobShortId(): string {
        return this.job.id.substring(0, 8);
    }

    ngAfterViewInit(): void {
        this.eventResultsDataSource.paginator = this.paginator;
        this.eventResultsDataSource.sort = this.matSort;

        this.filterForm
            .get('filterTerm')
            ?.valueChanges.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
            .subscribe((filterTerm: string) => {
                const filterColumn = this.filterForm.get('filterColumn')?.value;
                this.applyFilter(filterTerm, filterColumn);
            });

        this.filterForm
            .get('filterColumn')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((filterColumn: string) => {
                const filterTerm = this.filterForm.get('filterTerm')?.value;
                this.applyFilter(filterTerm, filterColumn);
            });
    }

    applyFilter(filterTerm: string, filterColumn: string): void {
        this.eventResultsDataSource.filter = JSON.stringify({ filterTerm, filterColumn });
        this.filteredCount = this.eventResultsDataSource.filteredData.length;
        if (this.eventResultsDataSource.paginator) {
            this.eventResultsDataSource.paginator.firstPage();
        }
    }

    sortData(sort: Sort): void {
        this.sort = sort;
        const data = this.eventResultsDataSource.data.slice();
        if (!sort.active || sort.direction === '') {
            return;
        }
        this.eventResultsDataSource.data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'eventId':
                    return this.nifiCommon.compareNumber(a.eventId, b.eventId) * (isAsc ? 1 : -1);
                case 'eventTime':
                    return this.nifiCommon.compareString(a.eventTime, b.eventTime) * (isAsc ? 1 : -1);
                case 'status':
                    return this.nifiCommon.compareString(a.status, b.status) * (isAsc ? 1 : -1);
                case 'failureReason':
                    return this.nifiCommon.compareString(a.failureReason ?? '', b.failureReason ?? '') * (isAsc ? 1 : -1);
                default:
                    return 0;
            }
        });
    }

    updateJob(job: BulkReplayJobDetail): void {
        this.job = job;
        this.eventResultsDataSource.data = job.eventResults;
        this.totalCount = job.eventResults.length;
        this.filteredCount = this.eventResultsDataSource.filteredData.length;
    }

    isFailed(result: BulkReplayEventResult): boolean {
        return result.status === 'FAILED';
    }

    searchProvenance(flowFileUuid: string): void {
        this.router.navigate(['/provenance'], { queryParams: { flowFileUuid } });
    }
}
