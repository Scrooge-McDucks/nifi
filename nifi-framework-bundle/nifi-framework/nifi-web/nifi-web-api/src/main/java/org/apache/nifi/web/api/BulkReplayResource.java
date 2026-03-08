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
package org.apache.nifi.web.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.nifi.authorization.Authorizer;
import org.apache.nifi.web.NiFiServiceFacade;
import org.apache.nifi.web.api.entity.BulkReplayJobDetailEntity;
import org.apache.nifi.web.api.entity.BulkReplayJobSummaryEntity;
import org.apache.nifi.web.api.entity.BulkReplayJobsEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * RESTful endpoint for managing bulk provenance event replay jobs.
 */
@Controller
@Path("/bulk-replay-jobs")
@Tag(name = "BulkReplay")
public class BulkReplayResource extends ApplicationResource {

    private NiFiServiceFacade serviceFacade;
    private Authorizer authorizer;

    /**
     * Returns a list of all bulk replay job summaries visible to the current user.
     *
     * @return a bulkReplayJobsEntity
     */
    @GET
    @Consumes(MediaType.WILDCARD)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
            summary = "Gets all bulk replay jobs",
            responses = {
                    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = BulkReplayJobsEntity.class))),
                    @ApiResponse(responseCode = "400", description = "NiFi was unable to complete the request because it was invalid. The request should not be retried without modification."),
                    @ApiResponse(responseCode = "401", description = "Client could not be authenticated."),
                    @ApiResponse(responseCode = "403", description = "Client is not authorized to make this request."),
                    @ApiResponse(responseCode = "409", description = "The request was valid but NiFi was not in the appropriate state to process it.")
            },
            security = {
                    @SecurityRequirement(name = "Read - /provenance")
            }
    )
    public Response getBulkReplayJobs() {
        // TODO: authorize, delegate to serviceFacade, populate response
        return Response.ok().build();
    }

    /**
     * Returns full detail for a single bulk replay job.
     *
     * @param id the job id
     * @return a bulkReplayJobDetailEntity
     */
    @GET
    @Consumes(MediaType.WILDCARD)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    @Operation(
            summary = "Gets a bulk replay job",
            responses = {
                    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = BulkReplayJobDetailEntity.class))),
                    @ApiResponse(responseCode = "400", description = "NiFi was unable to complete the request because it was invalid. The request should not be retried without modification."),
                    @ApiResponse(responseCode = "401", description = "Client could not be authenticated."),
                    @ApiResponse(responseCode = "403", description = "Client is not authorized to make this request."),
                    @ApiResponse(responseCode = "404", description = "The specified resource could not be found."),
                    @ApiResponse(responseCode = "409", description = "The request was valid but NiFi was not in the appropriate state to process it.")
            },
            security = {
                    @SecurityRequirement(name = "Read - /provenance")
            }
    )
    public Response getBulkReplayJob(
            @Parameter(description = "The bulk replay job id.", required = true)
            @PathParam("id") final String id) {
        // TODO: authorize, delegate to serviceFacade, populate response
        return Response.ok().build();
    }

    /**
     * Submits a new bulk replay job.
     *
     * @param requestEntity the job request entity
     * @return a bulkReplayJobSummaryEntity
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
            summary = "Submits a bulk replay job",
            responses = {
                    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = BulkReplayJobSummaryEntity.class))),
                    @ApiResponse(responseCode = "400", description = "NiFi was unable to complete the request because it was invalid. The request should not be retried without modification."),
                    @ApiResponse(responseCode = "401", description = "Client could not be authenticated."),
                    @ApiResponse(responseCode = "403", description = "Client is not authorized to make this request."),
                    @ApiResponse(responseCode = "409", description = "The request was valid but NiFi was not in the appropriate state to process it.")
            },
            security = {
                    @SecurityRequirement(name = "Write - /provenance")
            }
    )
    public Response submitBulkReplayJob(
            @Parameter(description = "The bulk replay job request.", required = true)
            final BulkReplayJobSummaryEntity requestEntity) {
        // TODO: authorize, validate, delegate to serviceFacade, populate response
        return Response.ok().build();
    }

    /**
     * Cancels and removes a bulk replay job.
     *
     * @param id the job id
     * @return a 204 No Content response
     */
    @DELETE
    @Consumes(MediaType.WILDCARD)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    @Operation(
            summary = "Deletes a bulk replay job",
            responses = {
                    @ApiResponse(responseCode = "204", description = "The bulk replay job was successfully deleted."),
                    @ApiResponse(responseCode = "400", description = "NiFi was unable to complete the request because it was invalid. The request should not be retried without modification."),
                    @ApiResponse(responseCode = "401", description = "Client could not be authenticated."),
                    @ApiResponse(responseCode = "403", description = "Client is not authorized to make this request."),
                    @ApiResponse(responseCode = "404", description = "The specified resource could not be found."),
                    @ApiResponse(responseCode = "409", description = "The request was valid but NiFi was not in the appropriate state to process it.")
            },
            security = {
                    @SecurityRequirement(name = "Write - /provenance")
            }
    )
    public Response deleteBulkReplayJob(
            @Parameter(description = "The bulk replay job id.", required = true)
            @PathParam("id") final String id) {
        // TODO: authorize, delegate to serviceFacade
        return Response.noContent().build();
    }

    @Autowired
    public void setServiceFacade(NiFiServiceFacade serviceFacade) {
        this.serviceFacade = serviceFacade;
    }

    @Autowired
    public void setAuthorizer(Authorizer authorizer) {
        this.authorizer = authorizer;
    }
}
