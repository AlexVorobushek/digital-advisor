package ru.digital.advisor.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.digital.advisor.dto.ChatRequest;
import ru.digital.advisor.dto.ChatResponse;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class ChatService {
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Value("${N8N_WEBHOOK_URL}")
    private String n8nWebhookUrl;

    @Value("${N8N_USER:}")
    private String n8nUser;

    @Value("${N8N_PASSWORD:}")
    private String n8nPassword;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(60000);
        this.restTemplate = new RestTemplate(factory);
    }

    public ChatResponse getAdvisorResponse(ChatRequest request, String userName, String userToken) {
        logger.info("--> Sending request to n8n: {}", n8nWebhookUrl);
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", request.getMessage());
        body.put("session_type", request.getSessionType());
        body.put("user_name", userName);
        body.put("user_token", userToken); // Передаем токен в n8n

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        if (n8nUser != null && !n8nUser.isEmpty()) {
            String auth = n8nUser + ":" + n8nPassword;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            String rawResponse = restTemplate.postForObject(n8nWebhookUrl, entity, String.class);
            logger.info("Raw response from n8n: {}", rawResponse);

            if (rawResponse == null || rawResponse.isEmpty()) {
                return new ChatResponse("Антон прислал пустой ответ.");
            }

            JsonNode root = objectMapper.readTree(rawResponse);
            String resultText = "Текст не найден.";

            if (root.has("text")) resultText = root.get("text").asText();
            else if (root.has("output")) resultText = root.get("output").asText();
            else if (root.has("message")) resultText = root.get("message").asText();

            return new ChatResponse(resultText);
        } catch (Exception e) {
            logger.error("Error calling n8n: {}", e.getMessage());
            return new ChatResponse("Ошибка: " + e.getMessage());
        }
    }
}
