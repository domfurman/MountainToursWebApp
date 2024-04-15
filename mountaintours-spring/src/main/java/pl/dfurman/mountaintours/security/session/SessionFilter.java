package pl.dfurman.mountaintours.security.session;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.dfurman.mountaintours.user.User;
import pl.dfurman.mountaintours.user.UserService;

import java.io.IOException;

@Component
public class SessionFilter extends OncePerRequestFilter {
    private final InMemorySessionRegistry sessionRegistry;
    private final UserService userService;

    @Autowired
    public SessionFilter(InMemorySessionRegistry sessionRegistry, UserService userService) {
        this.sessionRegistry = sessionRegistry;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String sessionId = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (sessionId == null || sessionId.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = sessionRegistry.getUsernameForSession(sessionId);
        if (username == null) {
            filterChain.doFilter(request, response);
            return;
        }

        User currentUser = userService.loadUserByUsername(username);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                currentUser,
                null,
                currentUser.getAuthorities()
                );

        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        filterChain.doFilter(request, response);
    }

}
