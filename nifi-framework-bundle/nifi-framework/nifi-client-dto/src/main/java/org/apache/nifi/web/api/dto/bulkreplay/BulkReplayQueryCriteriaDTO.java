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
import java.util.Map;

/**
 * The provenance query criteria used to select events for bulk replay.
 */
@XmlType(name = "bulkReplayQueryCriteria")
public class BulkReplayQueryCriteriaDTO {

    private String componentId;
    private String componentName;
    private Date startDate;
    private Date endDate;
    private Map<String, String> searchTerms;

    /**
     * @return the id of the component whose events were queried
     */
    @Schema(description = "The id of the component whose events were queried.")
    public String getComponentId() {
        return componentId;
    }

    public void setComponentId(String componentId) {
        this.componentId = componentId;
    }

    /**
     * @return the name of the component whose events were queried
     */
    @Schema(description = "The name of the component whose events were queried.")
    public String getComponentName() {
        return componentName;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    /**
     * @return the start of the time range used to filter provenance events
     */
    @XmlJavaTypeAdapter(TimestampAdapter.class)
    @Schema(description = "The start of the time range used to filter provenance events.", type = "string")
    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    /**
     * @return the end of the time range used to filter provenance events
     */
    @XmlJavaTypeAdapter(TimestampAdapter.class)
    @Schema(description = "The end of the time range used to filter provenance events.", type = "string")
    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    /**
     * @return additional provenance search terms applied to narrow the event set; key is the search field name, value is the search value
     */
    @Schema(description = "Additional provenance search terms applied to narrow the event set. Key is the search field name, value is the search value.")
    public Map<String, String> getSearchTerms() {
        return searchTerms;
    }

    public void setSearchTerms(Map<String, String> searchTerms) {
        this.searchTerms = searchTerms;
    }
}
