package ru.digital.advisor.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.dto.ChatRequest;
import ru.digital.advisor.dto.ChatResponse;
import ru.digital.advisor.security.UserDetailsImpl;
import ru.digital.advisor.service.ChatService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/send")
    public ChatResponse sendMessage(@RequestBody ChatRequest request, 
                                  @AuthenticationPrincipal UserDetailsImpl userDetails,
                                  HttpServletRequest httpRequest) {
        
        String userName = userDetails != null ? userDetails.getEmail() : "Пользователь";
        // Извлекаем токен из текущего запроса
        String authHeader = httpRequest.getHeader("Authorization");
        String token = (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
        
        return chatService.getAdvisorResponse(request, userName, token);
    }
}
