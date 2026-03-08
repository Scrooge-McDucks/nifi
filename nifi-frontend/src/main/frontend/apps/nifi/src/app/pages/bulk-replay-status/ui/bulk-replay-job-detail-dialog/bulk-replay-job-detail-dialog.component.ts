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

import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, KeyValuePipe } from '@angular/common';
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
        MatProgressBarModule,
        MatTableModule,
        MatPaginatorModule,
        DatePipe,
        KeyValuePipe
    ]
})
export class BulkReplayJobDetailDialog implements AfterViewInit {
    dialogData = inject<BulkReplayJobDetailDialogData>(MAT_DIALOG_DATA);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    job: BulkReplayJobDetail = this.dialogData.job;

    eventResultsDataSource = new MatTableDataSource<BulkReplayEventResult>(this.job.eventResults);

    eventResultColumns: string[] = ['eventId', 'flowFileUuid', 'eventType', 'eventTime', 'status', 'failureReason'];

    get jobShortId(): string {
        return this.job.id.substring(0, 8);
    }

    ngAfterViewInit(): void {
        this.eventResultsDataSource.paginator = this.paginator;
    }

    isFailed(result: BulkReplayEventResult): boolean {
        return result.status === 'FAILED';
    }
}
