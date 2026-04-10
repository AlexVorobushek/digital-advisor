import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ClaudeTest {
    public static void main(String[] args) throws Exception {
        String apiKey = "YOUR_ANTHROPIC_API_KEY";

        String requestBody = """
        {
          "model": "claude-3-haiku-20240307",
          "max_tokens": 100,
          "messages": [
            {"role": "user", "content": "Привет, скажи коротко что такое Java"}
          ]
        }
        """;

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.anthropic.com/v1/messages"))
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        System.out.println("Status: " + response.statusCode());
        System.out.println("Body: " + response.body());
    }
}