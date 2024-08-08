using Logic.Extensions;

namespace NotesBack.Common;

public static class HttpContextExtensions
{
    public static int GetIntValueFromClaim(this HttpContext httpContext, string type)
    {
        var claim = httpContext.User.Claims.FirstOrDefault(x => x.Type == type)
            .ThrowIfNull(() => throw new ArgumentException($"Claim with type [{type}] doesn't exist"));

        if (!int.TryParse(claim.Value, out var result))
            throw new ArgumentException($"Claim with type [{type}] cannot be converted to int");

        return result;
    }
}
