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
import jakarta.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import org.apache.nifi.web.api.dto.util.TimestampAdapter;

import java.util.Date;

/**
 * Summary information for a bulk replay job.
 */
@XmlType(name = "bulkReplayJobSummary")
public class BulkReplayJobSummaryDTO {

    private String id;
    private String submittedBy;
    private Date submittedTime;
    private BulkReplayJobStatus status;
    private Integer percentCompleted;
    private Integer totalEvents;
    private Integer replayedCount;
    private Integer failedCount;
    private Integer pendingCount;
    private String componentId;
    private String componentName;

    /**
     * @return the unique id of this bulk replay job
     */
    @Schema(description = "The unique id of this bulk replay job.")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the identity of the user who submitted this job
     */
    @Schema(description = "The identity of the user who submitted this job.")
    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    /**
     * @return the time at which this job was submitted
     */
    @XmlJavaTypeAdapter(TimestampAdapter.class)
    @Schema(description = "The time at which this job was submitted.", type = "string")
    public Date getSubmittedTime() {
        return submittedTime;
    }

    public void setSubmittedTime(Date submittedTime) {
        this.submittedTime = submittedTime;
    }

    /**
     * @return the current status of this job
     */
    @Schema(description = "The current status of this job.")
    public BulkReplayJobStatus getStatus() {
        return status;
    }

    public void setStatus(BulkReplayJobStatus status) {
        this.status = status;
    }

    /**
     * @return the percentage of events that have been processed, from 0 to 100
     */
    @Schema(description = "The percentage of events that have been processed, from 0 to 100.")
    public Integer getPercentCompleted() {
        return percentCompleted;
    }

    public void setPercentCompleted(Integer percentCompleted) {
        this.percentCompleted = percentCompleted;
    }

    /**
     * @return the total number of events selected for replay
     */
    @Schema(description = "The total number of events selected for replay.")
    public Integer getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(Integer totalEvents) {
        this.totalEvents = totalEvents;
    }

    /**
     * @return the number of events that were successfully replayed
     */
    @Schema(description = "The number of events that were successfully replayed.")
    public Integer getReplayedCount() {
        return replayedCount;
    }

    public void setReplayedCount(Integer replayedCount) {
        this.replayedCount = replayedCount;
    }

    /**
     * @return the number of events whose replay failed
     */
    @Schema(description = "The number of events whose replay failed.")
    public Integer getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(Integer failedCount) {
        this.failedCount = failedCount;
    }

    /**
     * @return the number of events that have not yet been processed
     */
    @Schema(description = "The number of events that have not yet been processed.")
    public Integer getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(Integer pendingCount) {
        this.pendingCount = pendingCount;
    }

    /**
     * @return the id of the component whose provenance events are being replayed
     */
    @Schema(description = "The id of the component whose provenance events are being replayed.")
    public String getComponentId() {
        return componentId;
    }

    public void setComponentId(String componentId) {
        this.componentId = componentId;
    }

    /**
     * @return the name of the component whose provenance events are being replayed
     */
    @Schema(description = "The name of the component whose provenance events are being replayed.")
    public String getComponentName() {
        return componentName;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }
}
