namespace SocPlatform.Api.Shared;

/// <summary>Base de las excepciones de dominio. No crear excepciones custom sin heredar de acá.</summary>
public abstract class AppException(string message) : Exception(message)
{
    public abstract int StatusCode { get; }
}

public class NotFoundError(string message) : AppException(message)
{
    public override int StatusCode => StatusCodes.Status404NotFound;
}

public class ValidationError(string message) : AppException(message)
{
    public override int StatusCode => StatusCodes.Status400BadRequest;
}

public class ConflictError(string message) : AppException(message)
{
    public override int StatusCode => StatusCodes.Status409Conflict;
}
