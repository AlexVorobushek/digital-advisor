package ru.digital.advisor.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import ru.digital.advisor.security.UserDetailsImpl;

public abstract class BaseController {
    protected Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userDetails.getId();
    }
}
