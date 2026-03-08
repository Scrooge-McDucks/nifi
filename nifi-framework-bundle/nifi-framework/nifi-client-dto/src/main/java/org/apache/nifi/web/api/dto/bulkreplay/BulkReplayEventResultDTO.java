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
 * The replay outcome for a single provenance event within a bulk replay job.
 */
@XmlType(name = "bulkReplayEventResult")
public class BulkReplayEventResultDTO {

    private Long eventId;
    private String clusterNodeId;
    private String flowFileUuid;
    private String eventType;
    private Date eventTime;
    private String componentName;
    private BulkReplayEventStatus status;
    private String failureReason;

    /**
     * @return the numeric id of the provenance event
     */
    @Schema(description = "The numeric id of the provenance event.")
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    /**
     * @return the id of the cluster node on which the event originated, or null in standalone mode
     */
    @Schema(description = "The id of the cluster node on which the event originated. Null in standalone mode.")
    public String getClusterNodeId() {
        return clusterNodeId;
    }

    public void setClusterNodeId(String clusterNodeId) {
        this.clusterNodeId = clusterNodeId;
    }

    /**
     * @return the UUID of the FlowFile associated with this event
     */
    @Schema(description = "The UUID of the FlowFile associated with this event.")
    public String getFlowFileUuid() {
        return flowFileUuid;
    }

    public void setFlowFileUuid(String flowFileUuid) {
        this.flowFileUuid = flowFileUuid;
    }

    /**
     * @return the type of the provenance event (e.g. RECEIVE, SEND, CONTENT_MODIFIED)
     */
    @Schema(description = "The type of the provenance event.")
    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    /**
     * @return the timestamp when the provenance event occurred
     */
    @XmlJavaTypeAdapter(TimestampAdapter.class)
    @Schema(description = "The timestamp when the provenance event occurred.", type = "string")
    public Date getEventTime() {
        return eventTime;
    }

    public void setEventTime(Date eventTime) {
        this.eventTime = eventTime;
    }

    /**
     * @return the name of the component that generated the event
     */
    @Schema(description = "The name of the component that generated the event.")
    public String getComponentName() {
        return componentName;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    /**
     * @return the replay status of this event
     */
    @Schema(description = "The replay status of this event.")
    public BulkReplayEventStatus getStatus() {
        return status;
    }

    public void setStatus(BulkReplayEventStatus status) {
        this.status = status;
    }

    /**
     * @return the reason replay failed for this event, or null if replay succeeded or is still pending
     */
    @Schema(description = "The reason replay failed for this event. Null if replay succeeded or is still pending.")
    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
}
