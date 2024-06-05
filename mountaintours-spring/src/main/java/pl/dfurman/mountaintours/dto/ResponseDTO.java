package pl.dfurman.mountaintours.dto;

import lombok.Data;

@Data
public class ResponseDTO {
    private String sessionId;
    private boolean success;
    private String message;
}
