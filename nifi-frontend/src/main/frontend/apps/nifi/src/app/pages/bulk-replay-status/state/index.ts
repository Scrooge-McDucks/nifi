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

import { createFeatureSelector } from '@ngrx/store';

export const bulkReplayStatusFeatureKey = 'bulkReplayStatus';

export type BulkReplayJobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED';

export type BulkReplayEventStatus = 'PENDING' | 'REPLAYED' | 'FAILED';

export interface BulkReplayEventResult {
    eventId: number;
    clusterNodeId?: string;
    flowFileUuid: string;
    eventType: string;
    eventTime: string;
    componentName: string;
    status: BulkReplayEventStatus;
    failureReason?: string;
}

export interface BulkReplayJobSummary {
    id: string;
    submittedBy: string;
    submittedTime: string;
    status: BulkReplayJobStatus;
    percentCompleted: number;
    totalEvents: number;
    replayedCount: number;
    failedCount: number;
    pendingCount: number;
    componentId: string;
    componentName: string;
}

export interface BulkReplayJobDetail extends BulkReplayJobSummary {
    queryCriteria: {
        componentId?: string;
        componentName?: string;
        startDate?: string;
        endDate?: string;
        searchTerms?: { [key: string]: { value: string; inverse: boolean } };
    };
    eventResults: BulkReplayEventResult[];
}

export interface BulkReplayStatusState {
    jobs: BulkReplayJobSummary[];
    jobDetails: { [jobId: string]: BulkReplayJobDetail };
    loadedTimestamp: string;
    loading: boolean;
    status: 'pending' | 'loading' | 'success' | 'error';
}

export const selectBulkReplayStatusState =
    createFeatureSelector<BulkReplayStatusState>(bulkReplayStatusFeatureKey);
