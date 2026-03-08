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
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { LARGE_DIALOG } from '@nifi/shared';
import {
    clearAllFakeJobs,
    generateFakeJob,
    refreshJobs
} from '../state/bulk-replay-status.actions';
import { selectJobDetails, selectJobs, selectLoading, selectLoadedTimestamp } from '../state/bulk-replay-status.selectors';
import { BulkReplayJobDetailDialog } from '../ui/bulk-replay-job-detail-dialog/bulk-replay-job-detail-dialog.component';

@Component({
    selector: 'bulk-replay-status',
    templateUrl: './bulk-replay-status.component.html',
    styleUrls: ['./bulk-replay-status.component.scss'],
    standalone: false
})
export class BulkReplayStatus {
    // TODO: Remove before production merge
    readonly DEV_MODE = true;

    private store = inject(Store);
    private dialog = inject(MatDialog);

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
                    this.dialog.open(BulkReplayJobDetailDialog, {
                        ...LARGE_DIALOG,
                        data: { job: jobDetail }
                    });
                }
            });
    }
}
