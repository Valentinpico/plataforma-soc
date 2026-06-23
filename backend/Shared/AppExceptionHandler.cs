using Microsoft.AspNetCore.Diagnostics;

namespace SocPlatform.Api.Shared;

/// <summary>Mapea las excepciones de dominio (AppException) a respuestas HTTP.</summary>
public class AppExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context, Exception exception, CancellationToken ct)
    {
        if (exception is not AppException ex) return false; // deja pasar las no-dominio

        context.Response.StatusCode = ex.StatusCode;
        await context.Response.WriteAsJsonAsync(new { error = ex.Message }, ct);
        return true;
    }
}
