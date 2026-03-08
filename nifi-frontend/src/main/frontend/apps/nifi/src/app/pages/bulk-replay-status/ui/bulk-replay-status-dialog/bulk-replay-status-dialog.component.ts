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

import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import {
    clearAllFakeJobs,
    generateFakeJob,
    refreshJobs
} from '../../state/bulk-replay-status.actions';
import {
    selectJobDetails,
    selectJobs,
    selectLoading,
    selectLoadedTimestamp
} from '../../state/bulk-replay-status.selectors';
import { BulkReplayJobTable } from '../bulk-replay-job-table/bulk-replay-job-table.component';
import { BulkReplayJobDetailDialog } from '../bulk-replay-job-detail-dialog/bulk-replay-job-detail-dialog.component';
import { XL_DIALOG } from '@nifi/shared';

@Component({
    selector: 'bulk-replay-status-dialog',
    templateUrl: './bulk-replay-status-dialog.component.html',
    styleUrls: ['./bulk-replay-status-dialog.component.scss'],
    imports: [AsyncPipe, MatDialogModule, MatButtonModule, MatIconModule, BulkReplayJobTable]
})
export class BulkReplayStatusDialog {
    // TODO: Remove before production merge
    readonly DEV_MODE = true;

    private store = inject(Store);
    private dialog = inject(MatDialog);
    private router = inject(Router);

    jobs$ = this.store.select(selectJobs);
    loading$ = this.store.select(selectLoading);
    loadedTimestamp$ = this.store.select(selectLoadedTimestamp);

    generateFakeJob(): void {
        this.store.dispatch(generateFakeJob());
    }

    generateBatchJobs(): void {
        for (let i = 0; i < 10; i++) {
            this.store.dispatch(generateFakeJob());
        }
    }

    clearAllJobs(): void {
        this.store.dispatch(clearAllFakeJobs());
    }

    onRefresh(): void {
        this.store.dispatch(refreshJobs());
    }

    onViewJobDetail(jobId: string): void {
        this.store
            .select(selectJobDetails)
            .pipe(take(1))
            .subscribe((details) => {
                const jobDetail = details[jobId];
                if (jobDetail) {
                    const dialogRef = this.dialog.open(BulkReplayJobDetailDialog, {
                        ...XL_DIALOG,
                        data: { job: jobDetail }
                    });

                    dialogRef.componentInstance.refresh
                        .pipe(takeUntil(dialogRef.afterClosed()))
                        .subscribe(() => {
                            this.store.dispatch(refreshJobs());
                            this.store
                                .select(selectJobDetails)
                                .pipe(take(1))
                                .subscribe((updated) => {
                                    const updatedJob = updated[jobId];
                                    if (updatedJob) {
                                        dialogRef.componentInstance.updateJob(updatedJob);
                                    }
                                });
                        });
                }
            });
    }

    openInNewTab(): void {
        const url = this.router.serializeUrl(this.router.createUrlTree(['/bulk-replay-status']));
        window.open(url, '_blank');
    }
}
