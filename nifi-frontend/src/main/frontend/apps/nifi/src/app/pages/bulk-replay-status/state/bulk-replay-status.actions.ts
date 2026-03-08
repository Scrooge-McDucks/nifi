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

import { createAction, props } from '@ngrx/store';
import { BulkReplayJobDetail, BulkReplayJobSummary } from './index';

export const loadBulkReplayJobs = createAction('[Bulk Replay Status] Load Jobs');

export const loadBulkReplayJobsSuccess = createAction(
    '[Bulk Replay Status] Load Jobs Success',
    props<{ jobs: BulkReplayJobSummary[] }>()
);

export const openJobDetailDialog = createAction(
    '[Bulk Replay Status] Open Job Detail Dialog',
    props<{ jobId: string }>()
);

export const loadJobDetailSuccess = createAction(
    '[Bulk Replay Status] Load Job Detail Success',
    props<{ jobDetail: BulkReplayJobDetail }>()
);

export const refreshJobs = createAction('[Bulk Replay Status] Refresh Jobs');

// DEV-ONLY: Remove before production
export const generateFakeJob = createAction('[Bulk Replay Status] [DEV] Generate Fake Job');

export const clearAllFakeJobs = createAction('[Bulk Replay Status] [DEV] Clear All Fake Jobs');
