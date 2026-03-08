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
package org.apache.nifi.web.api.dto.bulkreplay;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.xml.bind.annotation.XmlType;

import java.util.List;

/**
 * Full detail for a bulk replay job, including per-event results and the original query criteria.
 */
@XmlType(name = "bulkReplayJobDetail")
public class BulkReplayJobDetailDTO extends BulkReplayJobSummaryDTO {

    private BulkReplayQueryCriteriaDTO queryCriteria;
    private List<BulkReplayEventResultDTO> eventResults;

    /**
     * @return the provenance query criteria that was used to select events for this job
     */
    @Schema(description = "The provenance query criteria used to select events for this job.")
    public BulkReplayQueryCriteriaDTO getQueryCriteria() {
        return queryCriteria;
    }

    public void setQueryCriteria(BulkReplayQueryCriteriaDTO queryCriteria) {
        this.queryCriteria = queryCriteria;
    }

    /**
     * @return the per-event replay outcomes for this job
     */
    @Schema(description = "The per-event replay outcomes for this job.")
    public List<BulkReplayEventResultDTO> getEventResults() {
        return eventResults;
    }

    public void setEventResults(List<BulkReplayEventResultDTO> eventResults) {
        this.eventResults = eventResults;
    }
}
