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

import { createReducer, on } from '@ngrx/store';
import {
    BulkReplayEventResult,
    BulkReplayEventStatus,
    BulkReplayJobDetail,
    BulkReplayJobStatus,
    BulkReplayJobSummary,
    BulkReplayStatusState
} from './index';
import {
    clearAllFakeJobs,
    generateFakeJob,
    loadBulkReplayJobsSuccess,
    loadJobDetailSuccess,
    refreshJobs
} from './bulk-replay-status.actions';

// DEV-ONLY: Remove before production
const PROCESSOR_NAMES = [
    'FetchSFTP',
    'PutDatabaseRecord',
    'ConvertRecord',
    'RouteOnAttribute',
    'MergeContent',
    'PublishKafka',
    'InvokeHTTP',
    'ExecuteSQL',
    'GetFile',
    'PutS3Object',
    'TransformJSON',
    'SplitText'
];

const EVENT_TYPES = [
    'RECEIVE',
    'SEND',
    'CONTENT_MODIFIED',
    'ATTRIBUTES_MODIFIED',
    'CLONE',
    'FORK',
    'JOIN',
    'ROUTE',
    'CREATE',
    'FETCH'
];

const FAILURE_REASONS = [
    'Content claim no longer available — content has been aged off',
    'Unable to find the specified event in the provenance repository',
    'Access denied: user does not have write access to the data',
    'The FlowFile content was not found in the content repository',
    'Connection refused when attempting to replay to target processor',
    'Processor is currently disabled and cannot accept replayed FlowFiles'
];

function randomId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(hoursBack: number): string {
    const d = new Date(Date.now() - Math.random() * hoursBack * 60 * 60 * 1000);
    return d.toISOString();
}

function generateFakeJobData(): { summary: BulkReplayJobSummary; detail: BulkReplayJobDetail } {
    const jobId = randomId();
    const processorName = randomFrom(PROCESSOR_NAMES);
    const componentId = randomId();
    const totalEvents = Math.floor(Math.random() * 80) + 5;

    const status: BulkReplayJobStatus = Math.random() < 0.4 ? 'QUEUED' : 'RUNNING';

    let percentCompleted: number;
    if (status === 'QUEUED') {
        percentCompleted = 0;
    } else {
        percentCompleted = Math.floor(Math.random() * 30) + 5;
    }

    const eventResults: BulkReplayEventResult[] = [];
    let replayed = 0;
    let failed = 0;
    let pending = 0;

    const processedCount = status === 'RUNNING' ? Math.floor((percentCompleted / 100) * totalEvents) : 0;

    for (let i = 0; i < totalEvents; i++) {
        let eventStatus: BulkReplayEventStatus;

        if (status === 'QUEUED') {
            eventStatus = 'PENDING';
        } else if (i < processedCount) {
            eventStatus = Math.random() < 0.85 ? 'REPLAYED' : 'FAILED';
        } else {
            eventStatus = 'PENDING';
        }

        if (eventStatus === 'REPLAYED') replayed++;
        else if (eventStatus === 'FAILED') failed++;
        else pending++;

        eventResults.push({
            eventId: Math.floor(Math.random() * 900000) + 100000,
            flowFileUuid: randomId(),
            eventType: randomFrom(EVENT_TYPES),
            eventTime: randomDate(48),
            componentName: processorName,
            status: eventStatus,
            failureReason: eventStatus === 'FAILED' ? randomFrom(FAILURE_REASONS) : undefined
        });
    }

    const submittedTime = randomDate(1);
    const submittedBy = randomFrom(['admin', 'nifi-user', 'dataops', 'analyst']);

    const summary: BulkReplayJobSummary = {
        id: jobId,
        submittedBy,
        submittedTime,
        status,
        percentCompleted,
        totalEvents,
        replayedCount: replayed,
        failedCount: failed,
        pendingCount: pending,
        componentId,
        componentName: processorName
    };

    const detail: BulkReplayJobDetail = {
        ...summary,
        queryCriteria: {
            componentId,
            componentName: processorName,
            startDate: randomDate(72),
            endDate: randomDate(2),
            searchTerms: {
                ProcessorID: { value: componentId, inverse: false },
                ...(Math.random() > 0.5
                    ? { EventType: { value: randomFrom(EVENT_TYPES), inverse: false } }
                    : {})
            }
        },
        eventResults
    };

    return { summary, detail };
}

// DEV-ONLY: Advances a QUEUED or RUNNING job forward on each refresh
function evolveJob(
    summary: BulkReplayJobSummary,
    detail: BulkReplayJobDetail
): { summary: BulkReplayJobSummary; detail: BulkReplayJobDetail } {
    if (
        summary.status === 'COMPLETED' ||
        summary.status === 'PARTIALLY_COMPLETED' ||
        summary.status === 'FAILED'
    ) {
        return { summary, detail };
    }

    const newDetail = { ...detail, eventResults: [...detail.eventResults] };
    let newStatus: BulkReplayJobStatus = summary.status;
    let newPercent = summary.percentCompleted;

    if (summary.status === 'QUEUED') {
        if (Math.random() < 0.7) {
            newStatus = 'RUNNING';
            newPercent = Math.floor(Math.random() * 15) + 5;
        }
    } else if (summary.status === 'RUNNING') {
        newPercent = Math.min(100, summary.percentCompleted + Math.floor(Math.random() * 25) + 15);
    }

    const targetProcessed = Math.floor((newPercent / 100) * summary.totalEvents);
    let replayed = 0;
    let failed = 0;
    let pending = 0;

    for (let i = 0; i < newDetail.eventResults.length; i++) {
        const event = newDetail.eventResults[i];
        if (i < targetProcessed && event.status === 'PENDING') {
            if (Math.random() < 0.85) {
                newDetail.eventResults[i] = { ...event, status: 'REPLAYED' };
            } else {
                newDetail.eventResults[i] = {
                    ...event,
                    status: 'FAILED',
                    failureReason: randomFrom(FAILURE_REASONS)
                };
            }
        }

        if (newDetail.eventResults[i].status === 'REPLAYED') replayed++;
        else if (newDetail.eventResults[i].status === 'FAILED') failed++;
        else pending++;
    }

    if (newPercent >= 100) {
        newPercent = 100;
        if (failed === 0) {
            newStatus = 'COMPLETED';
        } else if (replayed === 0) {
            newStatus = 'FAILED';
        } else {
            newStatus = 'PARTIALLY_COMPLETED';
        }
    }

    const newSummary: BulkReplayJobSummary = {
        ...summary,
        status: newStatus,
        percentCompleted: newPercent,
        replayedCount: replayed,
        failedCount: failed,
        pendingCount: pending
    };

    return {
        summary: newSummary,
        detail: {
            ...newDetail,
            status: newStatus,
            percentCompleted: newPercent,
            replayedCount: replayed,
            failedCount: failed,
            pendingCount: pending
        }
    };
}

export const initialState: BulkReplayStatusState = {
    jobs: [],
    jobDetails: {},
    loadedTimestamp: 'N/A',
    loading: false,
    status: 'pending'
};

export const bulkReplayStatusReducer = createReducer(
    initialState,

    on(generateFakeJob, (state) => {
        const { summary, detail } = generateFakeJobData();
        return {
            ...state,
            jobs: [summary, ...state.jobs],
            jobDetails: { ...state.jobDetails, [summary.id]: detail }
        };
    }),

    on(clearAllFakeJobs, (state) => ({
        ...state,
        jobs: [],
        jobDetails: {}
    })),

    on(refreshJobs, (state) => {
        const evolvedJobs: BulkReplayJobSummary[] = [];
        const evolvedDetails: { [jobId: string]: BulkReplayJobDetail } = {};

        for (const job of state.jobs) {
            const detail = state.jobDetails[job.id];
            if (detail) {
                const { summary: newSummary, detail: newDetail } = evolveJob(job, detail);
                evolvedJobs.push(newSummary);
                evolvedDetails[newSummary.id] = newDetail;
            } else {
                evolvedJobs.push(job);
            }
        }

        return {
            ...state,
            jobs: evolvedJobs,
            jobDetails: evolvedDetails,
            loadedTimestamp: new Date().toISOString(),
            loading: false
        };
    }),

    on(loadBulkReplayJobsSuccess, (state, { jobs }) => ({
        ...state,
        jobs,
        loadedTimestamp: new Date().toISOString(),
        loading: false,
        status: 'success' as const
    })),

    on(loadJobDetailSuccess, (state, { jobDetail }) => ({
        ...state,
        jobDetails: { ...state.jobDetails, [jobDetail.id]: jobDetail }
    }))
);
