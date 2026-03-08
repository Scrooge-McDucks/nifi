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

import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NiFiCommon } from '@nifi/shared';
import { BulkReplayJobSummary } from '../../state';

@Component({
    selector: 'bulk-replay-job-table',
    templateUrl: './bulk-replay-job-table.component.html',
    styleUrls: ['./bulk-replay-job-table.component.scss'],
    host: { class: 'flex-1 flex flex-col min-h-0' },
    imports: [
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatProgressBarModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        DatePipe
    ]
})
export class BulkReplayJobTable implements AfterViewInit {
    private formBuilder = inject(FormBuilder);
    private nifiCommon = inject(NiFiCommon);
    private destroyRef = inject(DestroyRef);

    @Input() set jobs(jobs: BulkReplayJobSummary[]) {
        if (jobs) {
            this.dataSource.data = this.sortJobs(jobs, this.sort);
            this.dataSource.filterPredicate = (data: BulkReplayJobSummary, filter: string) => {
                const { filterTerm, filterColumn } = JSON.parse(filter);
                if (filterColumn === 'component name') {
                    return this.nifiCommon.stringContains(data.componentName, filterTerm, true);
                } else if (filterColumn === 'status') {
                    return this.nifiCommon.stringContains(data.status, filterTerm, true);
                } else if (filterColumn === 'submitted by') {
                    return this.nifiCommon.stringContains(data.submittedBy, filterTerm, true);
                }
                return true;
            };
            this.totalCount = jobs.length;
            this.filteredCount = this.dataSource.filteredData.length;

            const filterTerm = this.filterForm.get('filterTerm')?.value;
            if (filterTerm?.length > 0) {
                const filterColumn = this.filterForm.get('filterColumn')?.value;
                this.applyFilter(filterTerm, filterColumn);
            } else {
                this.resetPaginator();
            }
        }
    }

    @Input() loading: boolean = false;
    @Input() loadedTimestamp: string = 'N/A';

    @Output() viewJobDetail = new EventEmitter<string>();
    @Output() refresh = new EventEmitter<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    displayedColumns: string[] = [
        'submittedTime',
        'submittedBy',
        'componentName',
        'status',
        'progress',
        'totalEvents',
        'replayedCount',
        'failedCount',
        'pendingCount',
        'actions'
    ];

    dataSource = new MatTableDataSource<BulkReplayJobSummary>();

    sort: Sort = { active: 'submittedTime', direction: 'desc' };

    filterForm: FormGroup;
    filterColumnOptions: string[] = ['component name', 'status', 'submitted by'];
    totalCount = 0;
    filteredCount = 0;

    constructor() {
        this.filterForm = this.formBuilder.group({
            filterTerm: '',
            filterColumn: this.filterColumnOptions[0]
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;

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

    sortJobs(jobs: BulkReplayJobSummary[], sort: Sort): BulkReplayJobSummary[] {
        return jobs.slice().sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            let retVal = 0;
            switch (sort.active) {
                case 'submittedTime':
                    retVal = this.nifiCommon.compareString(a.submittedTime, b.submittedTime);
                    break;
                case 'submittedBy':
                    retVal = this.nifiCommon.compareString(a.submittedBy, b.submittedBy);
                    break;
                case 'componentName':
                    retVal = this.nifiCommon.compareString(a.componentName, b.componentName);
                    break;
                case 'status':
                    retVal = this.nifiCommon.compareString(a.status, b.status);
                    break;
                case 'totalEvents':
                    retVal = this.nifiCommon.compareNumber(a.totalEvents, b.totalEvents);
                    break;
            }
            return retVal * (isAsc ? 1 : -1);
        });
    }

    updateSort(sort: Sort): void {
        this.sort = sort;
        this.dataSource.data = this.sortJobs(this.dataSource.data, sort);
    }

    applyFilter(filterTerm: string, filterColumn: string): void {
        this.dataSource.filter = JSON.stringify({ filterTerm, filterColumn });
        this.filteredCount = this.dataSource.filteredData.length;
        this.resetPaginator();
    }

    resetPaginator(): void {
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    refreshClicked(): void {
        this.refresh.emit();
    }

    viewDetailsClicked(job: BulkReplayJobSummary): void {
        this.viewJobDetail.emit(job.id);
    }

    isActive(job: BulkReplayJobSummary): boolean {
        return job.status === 'RUNNING' || job.status === 'QUEUED';
    }
}
